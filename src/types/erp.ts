export type UserRole = 'admin' | 'director' | 'faculty' | 'finance' | 'student';

export type StudentStatus = 'active' | 'probation' | 'graduated' | 'leave';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Student {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  programId: string;
  programTitle: string;
  batchId: string;
  batchCode: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number; // 0 to 100
  admissionDate: string;
  emergencyContact: EmergencyContact;
  nationalId?: string;
  notes?: string;
}

export interface ProgramModule {
  code: string;
  title: string;
  hours: number;
  aiLabHours: number;
}

export interface Program {
  id: string;
  code: string;
  title: string;
  track: 'ai_engineering' | 'robotics' | 'generative_ai' | 'data_science' | 'cyber_sec';
  durationWeeks: number;
  creditHours: number;
  tuitionFee: number;
  description: string;
  modules: ProgramModule[];
  prerequisites: string[];
}

export interface Batch {
  id: string;
  code: string;
  programId: string;
  programTitle: string;
  instructorId: string;
  instructorName: string;
  startDate: string;
  endDate: string;
  timing: string;
  days: string[];
  room: string;
  maxCapacity: number;
  enrolledCount: number;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  batchId: string;
  batchCode: string;
  date: string;
  instructorId: string;
  topicCovered: string;
  records: StudentAttendanceRecord[];
}

export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'scholarship';
export type InvoiceStatus = 'paid' | 'partial' | 'unpaid' | 'overdue';

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  recordedBy: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  programTitle: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  payments: PaymentTransaction[];
}

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  specializations: string[];
  assignedBatches: string[];
  status: 'active' | 'on_sabbatical';
  avatar?: string;
}

export interface SystemAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  category: 'attendance' | 'finance' | 'academic' | 'admissions';
  resolved?: boolean;
}

// ================= PHASE 2 ENTERPRISE MODULES ================= //

// 1. Admissions Inquiries & Prospective Scholars Pipeline
export type LeadStage =
  | 'inquiry'
  | 'assessment_scheduled'
  | 'technical_interview'
  | 'offer_extended'
  | 'enrolled'
  | 'declined';

export interface LeadInquiry {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  programInterestedId: string;
  programTitle: string;
  stage: LeadStage;
  leadScore: number; // 0 - 100
  priorExperience: string;
  notes: string;
  appliedDate: string;
  lastContacted: string;
}

// 2. Examination, Grading & Assessment Management
export type AssessmentType = 'quiz' | 'lab_benchmark' | 'midterm_exam' | 'capstone_project';
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F';

export interface Assessment {
  id: string;
  batchId: string;
  batchCode: string;
  moduleCode: string;
  title: string;
  type: AssessmentType;
  maxScore: number;
  weightPercent: number;
  dueDate: string;
}

export interface StudentGradeRecord {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  score: number;
  letterGrade: LetterGrade;
  feedback?: string;
  submittedDate: string;
  gradedBy: string;
}

export interface ModuleGradeSummary {
  moduleCode: string;
  moduleTitle: string;
  credits: number;
  grade: LetterGrade;
  score: number;
}

export interface StudentTranscript {
  studentId: string;
  studentCode: string;
  studentName: string;
  programTitle: string;
  batchCode: string;
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  moduleGrades: ModuleGradeSummary[];
  completionStatus: 'in_progress' | 'graduated' | 'honors';
  honorsRank?: string;
  issueDate: string;
  verificationHash: string;
}

// 3. Laboratory Facilities & Campus Matrix
export interface LabFacility {
  id: string;
  name: string;
  building: string;
  roomNumber: string;
  computeSpecs: string;
  capacity: number;
  status: 'operational' | 'maintenance' | 'reserved';
}

export interface TimetableSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  timeSlot: string; // e.g. "09:00 AM - 01:00 PM"
  facilityId: string;
  facilityName: string;
  batchId: string;
  batchCode: string;
  programTitle: string;
  instructorName: string;
}

// 4. Institutional Audit Trail
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  actionType: 'admission' | 'grade_posted' | 'fee_payment' | 'attendance_marked' | 'batch_created' | 'lead_updated';
  details: string;
}
