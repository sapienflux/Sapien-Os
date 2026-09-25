import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Shield,
  CreditCard,
  Printer,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  BookOpen,
  Award,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Student } from '../../types/erp';
import { SapienLogo } from '../SapienLogo';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onRecordPayment: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onRecordPayment,
}) => {
  const {
    invoices,
    setSelectedInvoiceForPrint,
    setSelectedStudentForTranscript,
    updateStudent,
  } = useERP();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(student.notes || '');

  // Student invoices
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);
  const totalInvoiced = studentInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = studentInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = studentInvoices.reduce((sum, inv) => sum + inv.balance, 0);

  const handleSaveNotes = () => {
    updateStudent(student.id, { notes: notesText });
    setEditingNotes(false);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#0C1E32] to-[#0A1828] border-b border-[#162D47] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#142A42] border border-[#C59B27]/40 flex items-center justify-center text-lg font-black text-[#DFB142] shadow-inner">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="font-mono text-xs font-bold text-[#C59B27] px-2 py-0.5 rounded bg-[#10243A] border border-[#C59B27]/30">
                  {student.studentCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{student.programTitle}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 flex-wrap">
                <span>Cohort: {student.batchCode}</span>
                <span aria-hidden="true">·</span>
                <span>Admitted: {student.admissionDate}</span>
                <span aria-hidden="true">·</span>
                <span className={student.status === 'active' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  Status: {student.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setSelectedStudentForTranscript(student);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-[#DFB142] hover:text-white border border-[#23456C] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Generate Official Certified Transcript"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>
            <button
              onClick={handlePrintCard}
              className="p-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 hover:text-white transition-colors"
              title="Print Profile Summary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Academic Key Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#071321] border border-[#162D47]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Cumulative GPA
              </span>
              <p className="text-2xl font-black text-white mt-1">{student.gpa.toFixed(2)}</p>
              <span className="text-[10px] text-slate-500">Institutional scale (4.0 Max)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#071321] border border-[#162D47]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Attendance Compliance
              </span>
              <p
                className={`text-2xl font-black mt-1 ${
                  student.attendanceRate >= 80 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {student.attendanceRate}%
              </p>
              <span className="text-[10px] text-slate-500">
                {student.attendanceRate >= 80 ? 'In Good Standing' : 'Probationary Review'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#071321] border border-[#162D47]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Bursar Account Balance
              </span>
              <p
                className={`text-2xl font-black mt-1 ${
                  totalOutstanding === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                ${totalOutstanding}
              </p>
              <span className="text-[10px] text-slate-500">${totalPaid} Total Paid</span>
            </div>
          </div>

          {/* Contact & Personal Information */}
          <div className="bg-[#071321] border border-[#162D47] rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Scholar Identification & Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-slate-400">Institutional Email:</span>
                <span className="font-medium text-white truncate">{student.email}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-slate-400">Primary Phone:</span>
                <span className="font-medium text-white">{student.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="font-medium text-white">
                  {student.emergencyContact.name} ({student.emergencyContact.relation}) ·{' '}
                  {student.emergencyContact.phone}
                </span>
              </div>

              {student.nationalId && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Shield className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span className="text-slate-400">Government/Passport ID:</span>
                  <span className="font-medium text-white font-mono">{student.nationalId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Invoices & Receipts */}
          <div className="bg-[#071321] border border-[#162D47] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Bursar Financial Ledger
              </h3>
              <button
                onClick={() => onRecordPayment(student)}
                className="text-xs font-bold text-[#DFB142] hover:text-[#C59B27] flex items-center gap-1 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Fee Payment</span>
              </button>
            </div>

            {studentInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No invoices on file.</p>
            ) : (
              <div className="space-y-2">
                {studentInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-lg bg-[#0B1C2E] border border-[#19334F] flex items-center justify-between flex-wrap gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{inv.invoiceNumber}</span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span className="text-slate-400">Due {inv.dueDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Total: ${inv.totalAmount} · Paid: ${inv.paidAmount} · Balance: ${inv.balance}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : inv.status === 'partial'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>

                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="px-2.5 py-1 rounded bg-[#142A42] hover:bg-[#1E3B5C] text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3 text-[#DFB142]" />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic Advisory Notes */}
          <div className="bg-[#071321] border border-[#162D47] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Advisory Notes & Milestones
              </h3>
              {!editingNotes ? (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-xs text-[#DFB142] hover:underline font-semibold"
                >
                  Edit Notes
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs font-bold text-[#C59B27] hover:underline"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {editingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={3}
                className="w-full bg-[#040C16] text-xs text-slate-200 p-2.5 rounded-lg border border-[#1D3A5D] focus:outline-none focus:border-[#C59B27]"
                placeholder="Add faculty observations, honors thesis progress, or counseling logs..."
              />
            ) : (
              <p className="text-xs text-slate-300 italic bg-[#040C16] p-3 rounded-lg border border-[#142940]">
                {student.notes || 'No advisory notes recorded for this scholar yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#081524] border-t border-[#162D47] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
