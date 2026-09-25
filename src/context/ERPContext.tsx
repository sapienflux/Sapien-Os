import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  Student,
  Program,
  Batch,
  Invoice,
  FacultyMember,
  SystemAlert,
  AttendanceSession,
  AttendanceStatus,
  PaymentMethod,
  LeadInquiry,
  LeadStage,
  Assessment,
  StudentGradeRecord,
  LabFacility,
  TimetableSlot,
  AuditLogEntry,
  StudentTranscript,
  LetterGrade,
} from '../types/erp';
import {
  INITIAL_STUDENTS,
  INITIAL_PROGRAMS,
  INITIAL_BATCHES,
  INITIAL_INVOICES,
  INITIAL_FACULTY,
  INITIAL_ALERTS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_LEADS,
  INITIAL_ASSESSMENTS,
  INITIAL_GRADES,
  INITIAL_FACILITIES,
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface FinancialSummary {
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number; // percentage
}

interface ERPContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  students: Student[];
  programs: Program[];
  batches: Batch[];
  invoices: Invoice[];
  faculty: FacultyMember[];
  alerts: SystemAlert[];
  attendanceSessions: AttendanceSession[];
  leads: LeadInquiry[];
  assessments: Assessment[];
  grades: StudentGradeRecord[];
  facilities: LabFacility[];
  timetableSlots: TimetableSlot[];
  auditLogs: AuditLogEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStudentForDetail: Student | null;
  setSelectedStudentForDetail: (student: Student | null) => void;
  selectedInvoiceForPrint: Invoice | null;
  setSelectedInvoiceForPrint: (invoice: Invoice | null) => void;
  selectedStudentForTranscript: Student | null;
  setSelectedStudentForTranscript: (student: Student | null) => void;

  // Actions
  addStudent: (studentData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    programId: string;
    batchId: string;
    emergencyContact: { name: string; relation: string; phone: string };
    nationalId?: string;
    notes?: string;
    initialTuitionPlan?: 'full' | 'installment_2' | 'installment_3';
  }) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addBatch: (batchData: Omit<Batch, 'id' | 'enrolledCount'>) => Batch;
  updateBatch: (id: string, updates: Partial<Batch>) => void;

  markBatchAttendance: (
    batchId: string,
    date: string,
    topic: string,
    records: { studentId: string; status: AttendanceStatus; notes?: string }[]
  ) => void;

  recordPayment: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    reference: string,
    recordedBy: string,
    notes?: string
  ) => void;

  createInvoice: (
    studentId: string,
    items: { description: string; amount: number }[],
    dueDate: string
  ) => Invoice | null;

  // Phase 2 Admissions, Assessments & Audit
  updateLeadStage: (leadId: string, stage: LeadStage, notes?: string) => void;
  addLead: (leadData: Omit<LeadInquiry, 'id' | 'appliedDate' | 'lastContacted'>) => LeadInquiry;
  convertLeadToScholar: (leadId: string, batchId: string) => Student;

  addAssessment: (assessmentData: Omit<Assessment, 'id'>) => Assessment;
  recordGrade: (gradeData: {
    assessmentId: string;
    studentId: string;
    score: number;
    letterGrade: LetterGrade;
    feedback?: string;
    gradedBy: string;
  }) => void;

  addAuditLog: (actionType: AuditLogEntry['actionType'], details: string) => void;
  getStudentTranscript: (studentId: string) => StudentTranscript | null;

  dismissAlert: (id: string) => void;
  financialSummary: FinancialSummary;
  resetToDefaults: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'sapien_erp_role',
  STUDENTS: 'sapien_erp_students_v1',
  BATCHES: 'sapien_erp_batches_v1',
  INVOICES: 'sapien_erp_invoices_v1',
  SESSIONS: 'sapien_erp_sessions_v1',
  ALERTS: 'sapien_erp_alerts_v1',
  LEADS: 'sapien_erp_leads_v1',
  ASSESSMENTS: 'sapien_erp_assessments_v1',
  GRADES: 'sapien_erp_grades_v1',
  AUDIT_LOGS: 'sapien_erp_audit_logs_v1',
};

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<Student | null>(null);

  // Core Data Stores
  const [programs] = useState<Program[]>(INITIAL_PROGRAMS);
  const [faculty] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [facilities] = useState<LabFacility[]>(INITIAL_FACILITIES);
  const [timetableSlots] = useState<TimetableSlot[]>(INITIAL_TIMETABLE_SLOTS);

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_SESSIONS;
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Phase 2 Persistence Stores
  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [grades, setGrades] = useState<StudentGradeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Persist handlers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const addAuditLog = (actionType: AuditLogEntry['actionType'], details: string) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
    const actorMeta = {
      admin: 'Mansoor Al-Hassan (Admin)',
      director: 'Dr. Marcus Vance (Director)',
      faculty: 'Lead Faculty Instructor',
      finance: 'Arthur Pendelton (Bursar)',
      student: 'Student Portal User',
    }[role];

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: actorMeta,
      actorRole: role,
      actionType,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addStudent = (studentData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    programId: string;
    batchId: string;
    emergencyContact: { name: string; relation: string; phone: string };
    nationalId?: string;
    notes?: string;
    initialTuitionPlan?: 'full' | 'installment_2' | 'installment_3';
  }): Student => {
    const program = programs.find((p) => p.id === studentData.programId) || programs[0];
    const batch = batches.find((b) => b.id === studentData.batchId) || batches[0];

    const nextNumber = students.length + 1;
    const studentCode = `SAP-2026-${String(nextNumber).padStart(3, '0')}`;
    const newStudentId = `std-${Date.now()}`;

    const newStudent: Student = {
      id: newStudentId,
      studentCode,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      phone: studentData.phone,
      programId: program.id,
      programTitle: program.title,
      batchId: batch.id,
      batchCode: batch.code,
      status: 'active',
      gpa: 3.8, // starting initial standing
      attendanceRate: 100,
      admissionDate: new Date().toISOString().split('T')[0],
      emergencyContact: studentData.emergencyContact,
      nationalId: studentData.nationalId,
      notes: studentData.notes,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update batch enrolled count
    setBatches((prev) =>
      prev.map((b) => (b.id === batch.id ? { ...b, enrolledCount: b.enrolledCount + 1 } : b))
    );

    // Auto-generate official tuition invoice
    const totalTuition = program.tuitionFee;
    const invNumber = `INV-2026-${String(invoices.length + 101).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      studentId: newStudentId,
      studentName: `${studentData.firstName} ${studentData.lastName}`,
      studentCode,
      programTitle: program.title,
      issueDate: today,
      dueDate: due,
      items: [
        { description: `${program.title} - Tuition Fee`, amount: totalTuition },
        { description: 'Sapien Neural Cloud Lab GPU Pass', amount: 350 },
        { description: 'Registration & Smart Student ID Credentials', amount: 150 },
      ],
      totalAmount: totalTuition + 500,
      paidAmount: 0,
      balance: totalTuition + 500,
      status: 'unpaid',
      payments: [],
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    addAuditLog(
      'admission',
      `Admitted ${studentData.firstName} ${studentData.lastName} (${studentCode}) into ${program.title} in batch ${batch.code}.`
    );

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((std) => (std.id === id ? { ...std, ...updates } : std))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((std) => std.id !== id));
  };

  const addBatch = (batchData: Omit<Batch, 'id' | 'enrolledCount'>): Batch => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      enrolledCount: 0,
    };
    setBatches((prev) => [...prev, newBatch]);
    addAuditLog('batch_created', `Launched new cohort section ${newBatch.code} in ${newBatch.room}.`);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const markBatchAttendance = (
    batchId: string,
    date: string,
    topic: string,
    records: { studentId: string; status: AttendanceStatus; notes?: string }[]
  ) => {
    const batch = batches.find((b) => b.id === batchId);
    const newSession: AttendanceSession = {
      id: `att-${Date.now()}`,
      batchId,
      batchCode: batch ? batch.code : 'BATCH',
      date,
      instructorId: batch ? batch.instructorId : 'fac-1',
      topicCovered: topic,
      records,
    };

    setAttendanceSessions((prev) => [newSession, ...prev]);

    // Recalculate attendance rates for students present in this batch
    setStudents((prev) =>
      prev.map((student) => {
        const studentRecord = records.find((r) => r.studentId === student.id);
        if (!studentRecord) return student;

        const studentPastSessions = attendanceSessions.filter((s) =>
          s.records.some((r) => r.studentId === student.id)
        );

        let presentCount = studentRecord.status === 'present' ? 1 : 0;
        let totalCount = 1;

        studentPastSessions.forEach((s) => {
          const rec = s.records.find((r) => r.studentId === student.id);
          if (rec) {
            totalCount++;
            if (rec.status === 'present' || rec.status === 'late') {
              presentCount++;
            }
          }
        });

        const rate = Math.round((presentCount / totalCount) * 100);
        return {
          ...student,
          attendanceRate: rate,
          status: rate < 75 && student.status === 'active' ? 'probation' : student.status,
        };
      })
    );

    addAuditLog(
      'attendance_marked',
      `Committed session roll call for ${batch?.code || 'cohort'} (${date}) on "${topic}".`
    );
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    reference: string,
    recordedBy: string,
    notes?: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;

        const newPaidAmount = inv.paidAmount + amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaidAmount);
        const newStatus: Invoice['status'] =
          newBalance === 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : inv.status;

        const paymentTx = {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          method,
          reference: reference || `REF-${Date.now().toString().slice(-6)}`,
          recordedBy,
          notes,
        };

        const updatedInvoice: Invoice = {
          ...inv,
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus,
          payments: [paymentTx, ...inv.payments],
        };

        if (selectedInvoiceForPrint?.id === invoiceId) {
          setSelectedInvoiceForPrint(updatedInvoice);
        }

        addAuditLog(
          'fee_payment',
          `Recorded payment of $${amount.toLocaleString()} for ${inv.studentName} (${inv.invoiceNumber}) via ${method.toUpperCase()}.`
        );

        return updatedInvoice;
      })
    );
  };

  const createInvoice = (
    studentId: string,
    items: { description: string; amount: number }[],
    dueDate: string
  ): Invoice | null => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const invoiceNumber = `INV-2026-${String(invoices.length + 101).padStart(4, '0')}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentCode: student.studentCode,
      programTitle: student.programTitle,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      totalAmount,
      paidAmount: 0,
      balance: totalAmount,
      status: 'unpaid',
      payments: [],
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  // Phase 2 Admissions Inquiries
  const updateLeadStage = (leadId: string, stage: LeadStage, notes?: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          stage,
          notes: notes !== undefined ? notes : lead.notes,
          lastContacted: new Date().toISOString().split('T')[0],
        };
      })
    );

    const leadObj = leads.find((l) => l.id === leadId);
    addAuditLog(
      'lead_updated',
      `Updated applicant ${leadObj?.applicantName || 'lead'} stage to ${stage.replace('_', ' ').toUpperCase()}.`
    );
  };

  const addLead = (leadData: Omit<LeadInquiry, 'id' | 'appliedDate' | 'lastContacted'>): LeadInquiry => {
    const today = new Date().toISOString().split('T')[0];
    const newLead: LeadInquiry = {
      ...leadData,
      id: `lead-${Date.now()}`,
      appliedDate: today,
      lastContacted: today,
    };
    setLeads((prev) => [newLead, ...prev]);
    addAuditLog(
      'lead_updated',
      `Registered new inquiry for ${newLead.applicantName} in ${newLead.programTitle}.`
    );
    return newLead;
  };

  const convertLeadToScholar = (leadId: string, batchId: string): Student => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const nameParts = lead.applicantName.split(' ');
    const firstName = nameParts[0] || 'Scholar';
    const lastName = nameParts.slice(1).join(' ') || 'Applicant';

    const admittedStudent = addStudent({
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone,
      programId: lead.programInterestedId,
      batchId,
      emergencyContact: {
        name: `${firstName}'s Emergency Contact`,
        relation: 'Family',
        phone: lead.phone,
      },
      notes: `Converted from Admissions Pipeline. Prior experience: ${lead.priorExperience}`,
    });

    // Mark lead as enrolled
    updateLeadStage(leadId, 'enrolled', `Successfully matriculated as ${admittedStudent.studentCode}.`);
    return admittedStudent;
  };

  // Phase 2 Assessments & Grades
  const addAssessment = (assessmentData: Omit<Assessment, 'id'>): Assessment => {
    const newAssessment: Assessment = {
      ...assessmentData,
      id: `asm-${Date.now()}`,
    };
    setAssessments((prev) => [...prev, newAssessment]);
    addAuditLog(
      'grade_posted',
      `Published assessment "${newAssessment.title}" for ${newAssessment.batchCode}.`
    );
    return newAssessment;
  };

  const recordGrade = (gradeData: {
    assessmentId: string;
    studentId: string;
    score: number;
    letterGrade: LetterGrade;
    feedback?: string;
    gradedBy: string;
  }) => {
    const student = students.find((s) => s.id === gradeData.studentId);
    if (!student) return;

    const newGrade: StudentGradeRecord = {
      id: `grd-${Date.now()}`,
      assessmentId: gradeData.assessmentId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentCode: student.studentCode,
      score: gradeData.score,
      letterGrade: gradeData.letterGrade,
      feedback: gradeData.feedback,
      submittedDate: new Date().toISOString().split('T')[0],
      gradedBy: gradeData.gradedBy,
    };

    setGrades((prev) => [newGrade, ...prev.filter((g) => !(g.assessmentId === gradeData.assessmentId && g.studentId === student.id))]);

    // Recalculate GPA dynamically from all student grades
    const allStudentGrades = [
      ...grades.filter((g) => g.studentId === student.id && g.assessmentId !== gradeData.assessmentId),
      newGrade,
    ];

    const gradePointMap: Record<LetterGrade, number> = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'F': 0.0,
    };

    const totalPoints = allStudentGrades.reduce(
      (sum, g) => sum + (gradePointMap[g.letterGrade] ?? 3.0),
      0
    );
    const newGpa = Number((totalPoints / allStudentGrades.length).toFixed(2));

    updateStudent(student.id, {
      gpa: Math.min(4.0, Math.max(1.0, newGpa)),
    });

    addAuditLog(
      'grade_posted',
      `Graded ${student.firstName} ${student.lastName} with ${gradeData.letterGrade} (${gradeData.score} pts).`
    );
  };

  // Phase 2 Student Academic Transcript Generator
  const getStudentTranscript = (studentId: string): StudentTranscript | null => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const program = programs.find((p) => p.id === student.programId) || programs[0];
    const studentGradeRecords = grades.filter((g) => g.studentId === student.id);

    // Map modules to grades
    const moduleGrades = program.modules.map((m, idx) => {
      const matchGrade = studentGradeRecords.find((g) => {
        const asm = assessments.find((a) => a.id === g.assessmentId);
        return asm?.moduleCode === m.code;
      });

      const letterGrade: LetterGrade = matchGrade ? matchGrade.letterGrade : idx === 0 ? 'A' : idx === 1 ? 'A-' : 'B+';
      const score = matchGrade ? matchGrade.score : idx === 0 ? 94 : idx === 1 ? 88 : 85;

      return {
        moduleCode: m.code,
        moduleTitle: m.title,
        credits: Math.round(m.hours / 10),
        grade: letterGrade,
        score,
      };
    });

    const totalCredits = program.creditHours;
    const creditsEarned = Math.round(totalCredits * (student.attendanceRate / 100));

    // Generate deterministic verification hash
    const verificationHash = `SAP-VERIFY-${student.studentCode}-${student.id.slice(-4)}-SECURE`;

    return {
      studentId: student.id,
      studentCode: student.studentCode,
      studentName: `${student.firstName} ${student.lastName}`,
      programTitle: student.programTitle,
      batchCode: student.batchCode,
      gpa: student.gpa,
      totalCredits,
      creditsEarned,
      moduleGrades,
      completionStatus: student.gpa >= 3.8 ? 'honors' : 'in_progress',
      honorsRank: student.gpa >= 3.8 ? 'Dean’s Neural Honor Roll (Top 5%)' : undefined,
      issueDate: new Date().toISOString().split('T')[0],
      verificationHash,
    };
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const resetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setBatches(INITIAL_BATCHES);
    setInvoices(INITIAL_INVOICES);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setAlerts(INITIAL_ALERTS);
    setLeads(INITIAL_LEADS);
    setAssessments(INITIAL_ASSESSMENTS);
    setGrades(INITIAL_GRADES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  };

  const financialSummary: FinancialSummary = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
    const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

    return {
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      collectionRate,
    };
  }, [invoices]);

  return (
    <ERPContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        students,
        programs,
        batches,
        invoices,
        faculty,
        alerts,
        attendanceSessions,
        leads,
        assessments,
        grades,
        facilities,
        timetableSlots,
        auditLogs,
        searchQuery,
        setSearchQuery,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        selectedInvoiceForPrint,
        setSelectedInvoiceForPrint,
        selectedStudentForTranscript,
        setSelectedStudentForTranscript,
        addStudent,
        updateStudent,
        deleteStudent,
        addBatch,
        updateBatch,
        markBatchAttendance,
        recordPayment,
        createInvoice,
        updateLeadStage,
        addLead,
        convertLeadToScholar,
        addAssessment,
        recordGrade,
        addAuditLog,
        getStudentTranscript,
        dismissAlert,
        financialSummary,
        resetToDefaults,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
