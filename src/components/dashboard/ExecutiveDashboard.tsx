import React from 'react';
import {
  Users,
  GraduationCap,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Building,
  Cpu,
  Bot,
  Terminal,
  Database,
  UserCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Student, Batch } from '../../types/erp';

interface ExecutiveDashboardProps {
  onOpenAdmission: () => void;
  onOpenQuickPayment: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenAdmission,
  onOpenQuickPayment,
}) => {
  const {
    role,
    students,
    batches,
    invoices,
    faculty,
    alerts,
    financialSummary,
    setActiveTab,
    setSelectedStudentForDetail,
    setSelectedInvoiceForPrint,
  } = useERP();

  // Metrics calculations
  const activeStudents = students.filter((s) => s.status === 'active');
  const probationStudents = students.filter((s) => s.status === 'probation');
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendanceRate, 0) / (students.length || 1)
  );

  const activeBatches = batches.filter((b) => b.status === 'in_progress');
  const upcomingBatches = batches.filter((b) => b.status === 'upcoming');

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  // Track counts
  const trackDistribution = [
    {
      name: 'Generative AI & Agent Swarms',
      code: 'SAP-AI-501',
      count: students.filter((s) => s.programTitle.includes('Generative AI')).length,
      icon: Cpu,
      accent: 'border-amber-500/60 text-amber-400',
    },
    {
      name: 'Embodied Robotics Systems',
      code: 'SAP-ROB-402',
      count: students.filter((s) => s.programTitle.includes('Robotics')).length,
      icon: Bot,
      accent: 'border-sky-500/60 text-sky-400',
    },
    {
      name: 'Full-Stack Enterprise AI',
      code: 'SAP-ENG-303',
      count: students.filter((s) => s.programTitle.includes('Full-Stack')).length,
      icon: Terminal,
      accent: 'border-emerald-500/60 text-emerald-400',
    },
    {
      name: 'Data Science & Predictive ML',
      code: 'SAP-DS-204',
      count: students.filter((s) => s.programTitle.includes('Data Science')).length,
      icon: Database,
      accent: 'border-indigo-500/60 text-indigo-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Institutional Subtitle */}
      <div className="bg-gradient-to-r from-[#0C1E32] via-[#0E243C] to-[#0A1828] border border-[#1B3654] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C59B27]/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1.5">
              <span>SAPIEN ACADEMY</span>
              <span aria-hidden="true">·</span>
              <span>Autonomous Academic Operations</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-normal">Trimester Fall 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Institutional Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time governance over academic cohorts, neural research laboratories, student
              information pipelines, and bursar cashflow.
            </p>
          </div>

          {/* Quick Action Matrix for Admin & Finance */}
          {role !== 'student' && (
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={onOpenAdmission}
                className="px-3.5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Admissions Portal</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="px-3.5 py-2 rounded-lg bg-[#142A42] hover:bg-[#1A3859] text-white border border-[#23456C] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-[#DFB142]" />
                <span>Roll Call</span>
              </button>

              {(role === 'admin' || role === 'finance') && (
                <button
                  onClick={onOpenQuickPayment}
                  className="px-3.5 py-2 rounded-lg bg-[#142A42] hover:bg-[#1A3859] text-white border border-[#23456C] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Fee Collection</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Strategic Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Scholars */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-[#091827] border border-[#162D47] rounded-xl p-5 hover:border-[#C59B27]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide uppercase text-[10px]">Total Enrolled</span>
            <Users className="w-4 h-4 text-[#C59B27]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {students.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {activeStudents.length} Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#13273E] flex items-center justify-between text-[11px] text-slate-400">
            <span>Probation: {probationStudents.length}</span>
            <span className="text-[#DFB142] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
              SIS Roster <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 2: Financial Realization */}
        <div
          onClick={() => setActiveTab('finance')}
          className="bg-[#091827] border border-[#162D47] rounded-xl p-5 hover:border-[#C59B27]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide uppercase text-[10px]">Fee Collection Rate</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {financialSummary.collectionRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ${(financialSummary.totalCollected / 1000).toFixed(1)}k collected
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#13273E] flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-amber-400 font-medium">
              Pending: ${(financialSummary.totalOutstanding / 1000).toFixed(1)}k
            </span>
            <span className="text-[#DFB142] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
              Ledger <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 3: Active Batches */}
        <div
          onClick={() => setActiveTab('academics')}
          className="bg-[#091827] border border-[#162D47] rounded-xl p-5 hover:border-[#C59B27]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide uppercase text-[10px]">Academic Cohorts</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {batches.length}
            </span>
            <span className="text-xs text-sky-400 font-medium">
              {activeBatches.length} in session
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#13273E] flex items-center justify-between text-[11px] text-slate-400">
            <span>Upcoming: {upcomingBatches.length}</span>
            <span className="text-[#DFB142] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
              Schedules <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 4: Institutional Attendance Standing */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-[#091827] border border-[#162D47] rounded-xl p-5 hover:border-[#C59B27]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wide uppercase text-[10px]">Mean Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                avgAttendance >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {avgAttendance}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Policy Target $\ge$ 80%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#13273E] flex items-center justify-between text-[11px] text-slate-400">
            <span className={avgAttendance >= 80 ? 'text-emerald-400' : 'text-rose-400'}>
              {avgAttendance >= 80 ? 'Compliant' : 'Review Needed'}
            </span>
            <span className="text-[#DFB142] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
              Roll Call <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Today's Class Sessions + Operational Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Timetable & Daily Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Today's Laboratory & Lecture Schedule
                </h2>
                <p className="text-xs text-slate-400">
                  Daily live roll call, lab venue assignments, and faculty leads
                </p>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-semibold text-[#DFB142] hover:text-[#C59B27] flex items-center gap-1 transition-colors"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 rounded-xl bg-[#0B1C2E] border border-[#18314E] hover:border-[#21436A] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#142940] border border-[#C59B27]/30 flex items-center justify-center text-[#DFB142] font-mono text-xs font-bold shrink-0">
                      {batch.code.split('-')[2]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white tracking-wide">
                          {batch.code}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          {batch.programTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-[#DFB142]" />
                          {batch.timing}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{batch.room}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#C59B27] font-medium">{batch.instructorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-white">
                        {batch.enrolledCount} / {batch.maxCapacity}
                      </p>
                      <p className="text-[10px] text-slate-400">Students</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="px-3 py-1.5 rounded-lg bg-[#142B44] hover:bg-[#1E3B5E] text-slate-200 hover:text-white border border-[#214166] text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#DFB142]" />
                      <span>Take Attendance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Track Cohort Distribution */}
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-white tracking-tight mb-1">
              Future Skills Curricula Distribution
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Enrollment density across primary AI, robotics, and computational tracks
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {trackDistribution.map((track) => {
                const Icon = track.icon;
                return (
                  <div
                    key={track.code}
                    className="p-3.5 rounded-lg bg-[#0B1C2E] border border-[#18314E] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#12263C] border border-[#203D5E] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#DFB142]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{track.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{track.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">{track.count}</span>
                      <span className="text-[10px] text-slate-400 block">Enrolled</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Urgent Attention Queue & Faculty Quick View */}
        <div className="space-y-6">
          {/* Urgent Institutional Action Items */}
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Attention Required</h2>
              </div>
              <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                {probationStudents.length + overdueInvoices.length} Items
              </span>
            </div>

            <div className="space-y-3">
              {/* Overdue Fee Invoices */}
              {overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoiceForPrint(inv);
                    setActiveTab('finance');
                  }}
                  className="p-3 rounded-lg bg-[#141219] border border-rose-900/40 hover:border-rose-700/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-300">{inv.studentName}</span>
                    <span className="font-mono text-rose-400 font-bold">${inv.balance}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Invoice {inv.invoiceNumber} past due date ({inv.dueDate}).
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{inv.studentCode}</span>
                    <span className="text-rose-400 font-semibold hover:underline">
                      Review Invoice $\rightarrow$
                    </span>
                  </div>
                </div>
              ))}

              {/* Attendance Probation Students */}
              {probationStudents.map((std) => (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStudentForDetail(std);
                    setActiveTab('students');
                  }}
                  className="p-3 rounded-lg bg-[#191612] border border-amber-900/40 hover:border-amber-700/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      {std.firstName} {std.lastName}
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      {std.attendanceRate}% Attendance
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Below institutional 80% threshold in {std.batchCode}.
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{std.studentCode}</span>
                    <span className="text-amber-400 font-semibold hover:underline">
                      Advisor Profile $\rightarrow$
                    </span>
                  </div>
                </div>
              ))}

              {probationStudents.length === 0 && overdueInvoices.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                  All students and invoices are compliant.
                </div>
              )}
            </div>
          </div>

          {/* Lead Faculty On Duty */}
          <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white tracking-tight">Active Faculty Leads</h2>
              <button
                onClick={() => setActiveTab('faculty')}
                className="text-xs text-[#DFB142] hover:text-[#C59B27] font-semibold"
              >
                All Faculty
              </button>
            </div>

            <div className="space-y-2.5">
              {faculty.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  className="p-2.5 rounded-lg bg-[#0B1C2E] border border-[#162D47] flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-200">{f.name}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{f.role}</p>
                  </div>
                  <span className="text-[10px] font-medium text-[#DFB142] bg-[#122840] px-2 py-0.5 rounded border border-[#1F3D61]">
                    {f.assignedBatches.length} Cohorts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
