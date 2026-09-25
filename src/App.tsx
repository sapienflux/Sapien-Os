/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { StudentDirectory } from './components/students/StudentDirectory';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { NewAdmissionModal } from './components/students/NewAdmissionModal';
import { ProgramsAndBatches } from './components/academics/ProgramsAndBatches';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { BursarLedger } from './components/finance/BursarLedger';
import { RecordPaymentModal } from './components/finance/RecordPaymentModal';
import { PrintReceiptModal } from './components/finance/PrintReceiptModal';
import { FacultyDirectory } from './components/faculty/FacultyDirectory';
import { ScholarPortal } from './components/student-portal/ScholarPortal';
import { AdmissionsPipeline } from './components/admissions/AdmissionsPipeline';
import { AssessmentAndGrading } from './components/academics/AssessmentAndGrading';
import { AcademicTranscriptModal } from './components/academics/AcademicTranscriptModal';
import { CampusTimetableMatrix } from './components/facilities/CampusTimetableMatrix';
import { InstitutionalAuditLogs } from './components/audit/InstitutionalAuditLogs';
import { Student, Invoice } from './types/erp';

const ERPAppContent: React.FC = () => {
  const {
    role,
    activeTab,
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    selectedStudentForTranscript,
    setSelectedStudentForTranscript,
    invoices,
  } = useERP();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [preselectedPaymentInvoice, setPreselectedPaymentInvoice] = useState<Invoice | undefined>(
    undefined
  );

  const handleOpenPaymentForStudent = (student: Student) => {
    const studentInv = invoices.find((i) => i.studentId === student.id && i.balance > 0);
    setPreselectedPaymentInvoice(studentInv);
    setIsPaymentModalOpen(true);
  };

  const handleOpenPaymentForInvoice = (invoice?: Invoice) => {
    setPreselectedPaymentInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06111D] text-slate-100 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        {/* Sticky Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenNewAdmission={() => setIsAdmissionModalOpen(true)}
          onOpenQuickPayment={() => handleOpenPaymentForInvoice()}
        />

        {/* View Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Student View special handling */}
          {role === 'student' && activeTab === 'dashboard' ? (
            <ScholarPortal />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard
                  onOpenAdmission={() => setIsAdmissionModalOpen(true)}
                  onOpenQuickPayment={() => handleOpenPaymentForInvoice()}
                />
              )}

              {activeTab === 'admissions' && <AdmissionsPipeline />}

              {activeTab === 'students' && (
                <StudentDirectory
                  onOpenAdmission={() => setIsAdmissionModalOpen(true)}
                  onOpenQuickPaymentForStudent={handleOpenPaymentForStudent}
                />
              )}

              {activeTab === 'academics' && <ProgramsAndBatches />}

              {activeTab === 'attendance' && <AttendanceTracker />}

              {activeTab === 'grading' && <AssessmentAndGrading />}

              {activeTab === 'finance' && (
                <BursarLedger onOpenRecordPayment={handleOpenPaymentForInvoice} />
              )}

              {activeTab === 'facilities' && <CampusTimetableMatrix />}

              {activeTab === 'faculty' && <FacultyDirectory />}

              {activeTab === 'audit' && <InstitutionalAuditLogs />}
            </>
          )}
        </main>
      </div>

      {/* Modals & Slide-outs */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          onRecordPayment={handleOpenPaymentForStudent}
        />
      )}

      {selectedStudentForTranscript && (
        <AcademicTranscriptModal
          student={selectedStudentForTranscript}
          onClose={() => setSelectedStudentForTranscript(null)}
        />
      )}

      <NewAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPreselectedPaymentInvoice(undefined);
        }}
        preselectedInvoice={preselectedPaymentInvoice}
      />

      <PrintReceiptModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
