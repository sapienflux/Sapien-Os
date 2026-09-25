import React from 'react';
import { X, Printer, ShieldCheck, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { Student } from '../../types/erp';
import { useERP } from '../../context/ERPContext';
import { SapienLogo } from '../SapienLogo';

interface AcademicTranscriptModalProps {
  student: Student | null;
  onClose: () => void;
}

export const AcademicTranscriptModal: React.FC<AcademicTranscriptModalProps> = ({
  student,
  onClose,
}) => {
  const { getStudentTranscript } = useERP();

  if (!student) return null;

  const transcript = getStudentTranscript(student.id);
  if (!transcript) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden p-4 bg-[#091827] text-white flex items-center justify-between border-b border-[#18314E]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#DFB142]" />
            <span className="text-xs font-bold">Official Academic Transcript & Record</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Transcript</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Academic Transcript Document */}
        <div className="p-8 sm:p-12 space-y-6 bg-white font-sans text-xs">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            <div>
              <SapienLogo variant="full" size="lg" />
              <p className="text-[10px] tracking-widest uppercase text-slate-600 font-bold mt-2">
                OFFICE OF THE REGISTRAR & ACADEMIC ACCREDITATION
              </p>
              <p className="text-[10px] text-slate-500">
                100 Innovation Way, Autonomous Hall · registrar@sapien.academy
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-white">
                OFFICIAL TRANSCRIPT OF RECORD
              </span>
              <p className="font-mono text-xs font-bold text-[#C59B27] mt-1.5">
                VERIFICATION: {transcript.verificationHash}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Date of Issue: {transcript.issueDate}</p>
            </div>
          </div>

          {/* Scholar Bio-Demographic Data Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Scholar Full Name
              </span>
              <p className="font-black text-slate-900 text-sm mt-0.5">{transcript.studentName}</p>
              <p className="font-mono text-xs font-bold text-[#C59B27] mt-0.5">
                ID: {transcript.studentCode}
              </p>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Degree / Program Credential
              </span>
              <p className="font-bold text-slate-900 text-xs mt-0.5">{transcript.programTitle}</p>
              <p className="text-[11px] text-slate-600">Cohort {transcript.batchCode}</p>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Academic Standing
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-black text-slate-900 text-base">{transcript.gpa.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500">/ 4.0 GPA</span>
              </div>
              {transcript.honorsRank && (
                <span className="text-[10px] font-bold text-[#C59B27] block">
                  ★ {transcript.honorsRank}
                </span>
              )}
            </div>
          </div>

          {/* Curricular Modules & Coursework Evaluation Table */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
              Curricular Modules & Laboratory Practicum Record
            </h2>
            <table className="w-full text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Module Code</th>
                  <th className="py-2.5 px-3">Module Title</th>
                  <th className="py-2.5 px-3 text-center">Credit Hours</th>
                  <th className="py-2.5 px-3 text-center">Numerical Pts</th>
                  <th className="py-2.5 px-3 text-right">Letter Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transcript.moduleGrades.map((m) => (
                  <tr key={m.moduleCode} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {m.moduleCode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-900 font-medium">{m.moduleTitle}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{m.credits} Units</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {m.score}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 text-xs">
                      {m.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Summary Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Total Credits</span>
              <p className="font-black text-slate-900 text-sm mt-0.5">
                {transcript.totalCredits} Credit Hours
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400">
                Attendance Compliance
              </span>
              <p className="font-black text-emerald-700 text-sm mt-0.5">
                {student.attendanceRate}% Verified
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Credential Status</span>
              <p className="font-black text-[#C59B27] text-sm mt-0.5">
                {transcript.completionStatus.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Official Signatures & Verification Seal */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-[10px] text-slate-500">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                <span>Cryptographically Sealed Document</span>
              </div>
              <p className="leading-relaxed">
                This document is certified by the Academic Governance Council of SAPIEN ACADEMY.
                Tamper verification may be confirmed via institutional ledger hash{' '}
                <span className="font-mono text-slate-700 font-bold">
                  {transcript.verificationHash}
                </span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <span className="font-serif italic text-slate-900 text-xs">M. Vance</span>
                </div>
                <p className="font-bold text-slate-700">Dr. Marcus Vance</p>
                <p className="text-[9px]">Academic Director</p>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <span className="font-serif italic text-slate-900 text-xs">A. Al-Mansoor</span>
                </div>
                <p className="font-bold text-slate-700">Mansoor Al-Hassan</p>
                <p className="text-[9px]">Institutional Registrar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
