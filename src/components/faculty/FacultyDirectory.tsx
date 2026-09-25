import React from 'react';
import { UserCheck, Mail, Phone, BookOpen, Award, GraduationCap, Building2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const FacultyDirectory: React.FC = () => {
  const { faculty, batches, students } = useERP();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Academic Faculty</span>
            <span aria-hidden="true">·</span>
            <span>Chairs & Senior Lecturers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Distinguished Faculty Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            World-class researchers, roboticists, and enterprise software architects leading future skills
          </p>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {faculty.map((f) => {
          // Count total students taught by this faculty member
          const assignedBatchObjects = batches.filter((b) => f.assignedBatches.includes(b.code));
          const totalScholarsTaught = assignedBatchObjects.reduce(
            (sum, b) => sum + b.enrolledCount,
            0
          );

          return (
            <div
              key={f.id}
              className="bg-[#091827] border border-[#162D47] rounded-xl p-6 shadow-sm space-y-4 hover:border-[#C59B27]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#142C47] to-[#0A1A2C] border border-[#C59B27]/40 flex items-center justify-center text-lg font-black text-[#DFB142] shadow-inner">
                    {f.name
                      .split(' ')
                      .filter((n) => !n.includes('.'))
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{f.name}</h2>
                    <p className="text-xs text-[#DFB142] font-medium mt-0.5">{f.role}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.department}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  {f.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="pt-3 border-t border-[#142940] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                  <span className="truncate">{f.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                  <span>{f.phone}</span>
                </div>
              </div>

              {/* Research Specializations (rendered as clean typographic items, no pill boxes) */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Core AI & Research Domains
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                  {f.specializations.map((spec, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-200">{spec}</span>
                      {idx < f.specializations.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Teaching Load */}
              <div className="pt-3 border-t border-[#142940] flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Assigned Cohorts: </span>
                  <span className="font-mono text-[#DFB142] font-bold">
                    {f.assignedBatches.join(', ')}
                  </span>
                </div>
                <div className="text-slate-400">
                  <span>Mentoring: </span>
                  <span className="font-bold text-white">{totalScholarsTaught} Scholars</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
