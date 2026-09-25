import React from 'react';
import {
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Clock,
  MapPin,
  CheckCircle2,
  BookOpen,
  Printer,
  Cpu,
  Award,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ScholarPortal: React.FC = () => {
  const {
    students,
    batches,
    programs,
    invoices,
    setSelectedInvoiceForPrint,
    setSelectedStudentForTranscript,
  } = useERP();

  // Pick the primary demo student (Devon Kovac)
  const currentStudent = students[0];
  const enrolledBatch = batches.find((b) => b.id === currentStudent?.batchId);
  const enrolledProgram = programs.find((p) => p.id === currentStudent?.programId);
  const studentInvoices = invoices.filter((i) => i.studentId === currentStudent?.id);

  if (!currentStudent) return null;

  return (
    <div className="space-y-6">
      {/* Scholar Welcome Card */}
      <div className="bg-gradient-to-r from-[#0C1E32] via-[#0E243C] to-[#0A1828] border border-[#1B3654] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1.5">
              <span>SAPIEN SCHOLAR PORTAL</span>
              <span aria-hidden="true">·</span>
              <span>Autonomous Hall · Student ID: {currentStudent.studentCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {currentStudent.firstName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              You are currently enrolled in{' '}
              <span className="text-[#DFB142] font-semibold">{currentStudent.programTitle}</span>{' '}
              (Cohort {currentStudent.batchCode}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-[#071321] border border-[#162D47] text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative GPA</span>
              <span className="text-xl font-black text-white">{currentStudent.gpa.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#071321] border border-[#162D47] text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
              <span className="text-xl font-black text-emerald-400">{currentStudent.attendanceRate}%</span>
            </div>
            <button
              onClick={() => setSelectedStudentForTranscript(currentStudent)}
              className="p-3 rounded-xl bg-[#142A42] hover:bg-[#1E3B5C] border border-[#C59B27]/40 text-[#DFB142] hover:text-white transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-md group"
              title="View and print official academic transcript and record"
            >
              <Award className="w-5 h-5 text-[#DFB142] group-hover:scale-110 transition-transform mb-0.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Official Transcript</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Classes & Bursar Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Enrolled Cohort Schedule & Curriculum Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cohort Live Schedule */}
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Assigned Academic Schedule
            </h2>

            {enrolledBatch ? (
              <div className="p-4 rounded-xl bg-[#0B1C2E] border border-[#18314E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#DFB142]">
                    Cohort {enrolledBatch.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active Session
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Schedule Window
                    </span>
                    <p className="font-bold text-white mt-0.5">{enrolledBatch.days.join(', ')}</p>
                    <p className="text-[11px] text-slate-400">{enrolledBatch.timing}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Laboratory Venue
                    </span>
                    <p className="font-bold text-white mt-0.5">{enrolledBatch.room}</p>
                    <p className="text-[11px] text-slate-400">High-Performance Compute</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Lead Faculty
                    </span>
                    <p className="font-bold text-white mt-0.5">{enrolledBatch.instructorName}</p>
                    <p className="text-[11px] text-slate-400">Autonomous Systems</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Program Modules */}
          {enrolledProgram && (
            <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Curricular Syllabus & Lab Milestones
              </h2>
              <div className="space-y-2">
                {enrolledProgram.modules.map((m, idx) => (
                  <div
                    key={m.code}
                    className="p-3 rounded-lg bg-[#071321] border border-[#13273E] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-[#122840] border border-[#203D5E] flex items-center justify-center font-mono text-[10px] text-[#DFB142] font-bold">
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-white">{m.title}</p>
                        <p className="text-[10px] font-mono text-slate-400">{m.code}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {m.hours} Hours ({m.aiLabHours}h GPU Lab)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Tuition Statement & Receipts */}
        <div className="space-y-6">
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bursar Tuition Statement
            </h2>

            {studentInvoices.length === 0 ? (
              <p className="text-xs text-slate-400">No invoices on file.</p>
            ) : (
              <div className="space-y-3">
                {studentInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl bg-[#071321] border border-[#162D47] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#DFB142]">{inv.invoiceNumber}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Total Invoiced:</span>
                      <span className="font-mono text-white">${inv.totalAmount}</span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Amount Paid:</span>
                      <span className="font-mono text-emerald-400">${inv.paidAmount}</span>
                    </div>

                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#13273E]">
                      <span className="text-slate-300">Remaining Balance:</span>
                      <span className="font-mono text-amber-400">${inv.balance}</span>
                    </div>

                    <button
                      onClick={() => setSelectedInvoiceForPrint(inv)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#DFB142]" />
                      <span>Print Official Receipt</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
