import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  Plus,
  Clock,
  MapPin,
  User,
  Users,
  Calendar,
  CheckCircle,
  Cpu,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Batch, Program } from '../../types/erp';

export const ProgramsAndBatches: React.FC = () => {
  const { programs, batches, faculty, addBatch, students, setSelectedStudentForDetail, setActiveTab } =
    useERP();

  const [activeTab, setActiveTabState] = useState<'batches' | 'curricula'>('batches');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);

  // New Batch Form State
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchProgramId, setNewBatchProgramId] = useState(programs[0]?.id || '');
  const [newBatchInstructorId, setNewBatchInstructorId] = useState(faculty[0]?.id || '');
  const [newBatchStartDate, setNewBatchStartDate] = useState('2026-11-01');
  const [newBatchEndDate, setNewBatchEndDate] = useState('2027-04-30');
  const [newBatchTiming, setNewBatchTiming] = useState('09:00 AM - 01:00 PM');
  const [newBatchDays, setNewBatchDays] = useState(['Mon', 'Wed', 'Fri']);
  const [newBatchRoom, setNewBatchRoom] = useState('Turing Neural Lab (Room 303)');
  const [newBatchCapacity, setNewBatchCapacity] = useState(25);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const enrolledInSelectedBatch = students.filter((s) => s.batchId === selectedBatch?.id);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const program = programs.find((p) => p.id === newBatchProgramId) || programs[0];
    const instructor = faculty.find((f) => f.id === newBatchInstructorId) || faculty[0];

    const code =
      newBatchCode.trim() ||
      `BCH-2026-${program.track.slice(0, 1).toUpperCase()}${batches.length + 1}`;

    const created = addBatch({
      code,
      programId: program.id,
      programTitle: program.title,
      instructorId: instructor.id,
      instructorName: instructor.name,
      startDate: newBatchStartDate,
      endDate: newBatchEndDate,
      timing: newBatchTiming,
      days: newBatchDays,
      room: newBatchRoom,
      maxCapacity: Number(newBatchCapacity),
      status: 'upcoming',
    });

    setSelectedBatchId(created.id);
    setShowNewBatchModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header with Segmented Navigation Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Academic Affairs</span>
            <span aria-hidden="true">·</span>
            <span>Programs & Cohort Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Curricula & Cohort Operations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active neural laboratory schedules, course modules, and cohort seat allocations
          </p>
        </div>

        {/* Functional Segmented Control (Allowed per constitution) */}
        <div className="flex items-center gap-1 p-1 bg-[#06121E] border border-[#18314E] rounded-lg">
          <button
            onClick={() => setActiveTabState('batches')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'batches'
                ? 'bg-[#152B44] text-white shadow-sm border border-[#214268]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic Cohorts ({batches.length})
          </button>
          <button
            onClick={() => setActiveTabState('curricula')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'curricula'
                ? 'bg-[#152B44] text-white shadow-sm border border-[#214268]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Program Syllabi ({programs.length})
          </button>
        </div>
      </div>

      {activeTab === 'batches' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (1 Col): Cohort Select List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Cohort Batches
              </h2>
              <button
                onClick={() => setShowNewBatchModal(true)}
                className="px-2.5 py-1 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Batch</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {batches.map((b) => {
                const isSelected = b.id === selectedBatch?.id;
                const capacityPct = Math.round((b.enrolledCount / b.maxCapacity) * 100);

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBatchId(b.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F243B] border-[#C59B27] shadow-lg'
                        : 'bg-[#091827] border-[#162D47] hover:border-[#1E3E63]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#DFB142]">{b.code}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          b.status === 'in_progress'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                      {b.programTitle}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{b.days.join(', ')}</span>
                      <span className="text-slate-300 font-medium">{b.timing}</span>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-2.5 pt-2 border-t border-[#162D47]/70">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Enrolled Seats</span>
                        <span className="font-mono font-bold text-white">
                          {b.enrolledCount} / {b.maxCapacity} ({capacityPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#06121E] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            capacityPct >= 90
                              ? 'bg-amber-400'
                              : 'bg-gradient-to-r from-[#DFB142] to-emerald-400'
                          }`}
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (2 Cols): Selected Batch Deep Dive & Scholar Roster */}
          <div className="lg:col-span-2 space-y-5">
            {selectedBatch && (
              <>
                {/* Cohort Detailed Information Card */}
                <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#152B44] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#DFB142]">
                          {selectedBatch.code}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span className="text-xs text-slate-400">{selectedBatch.room}</span>
                      </div>
                      <h2 className="text-lg font-black text-white mt-1">
                        {selectedBatch.programTitle}
                      </h2>
                    </div>

                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-[#DFB142] hover:text-white border border-[#23456C] text-xs font-bold transition-all flex items-center gap-1.5 self-start cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Take Class Roll Call</span>
                    </button>
                  </div>

                  {/* Batch Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#071424] border border-[#152B44]">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Lead Instructor
                      </span>
                      <p className="font-bold text-white text-xs mt-1">
                        {selectedBatch.instructorName}
                      </p>
                      <span className="text-[10px] text-slate-500">Autonomous Systems Faculty</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#071424] border border-[#152B44]">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Schedule Window
                      </span>
                      <p className="font-bold text-white text-xs mt-1">
                        {selectedBatch.days.join(' · ')}
                      </p>
                      <span className="text-[10px] text-slate-500">{selectedBatch.timing}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#071424] border border-[#152B44]">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Laboratory Venue
                      </span>
                      <p className="font-bold text-white text-xs mt-1 truncate">
                        {selectedBatch.room}
                      </p>
                      <span className="text-[10px] text-slate-500">Hardware & Compute Access</span>
                    </div>
                  </div>
                </div>

                {/* Cohort Scholar Roster */}
                <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Enrolled Cohort Roster
                      </h3>
                      <p className="text-xs text-slate-400">
                        {enrolledInSelectedBatch.length} scholars allocated to this section
                      </p>
                    </div>
                  </div>

                  {enrolledInSelectedBatch.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No scholars allocated to this cohort yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#13273E]">
                      {enrolledInSelectedBatch.map((std) => (
                        <div
                          key={std.id}
                          className="py-3 flex items-center justify-between hover:bg-[#0B1E32]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#142A42] border border-[#C59B27]/30 flex items-center justify-center text-xs font-bold text-[#DFB142]">
                              {std.firstName[0]}
                              {std.lastName[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {std.firstName} {std.lastName}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="font-mono text-[#C59B27]">{std.studentCode}</span>
                                <span aria-hidden="true">·</span>
                                <span>Attendance: {std.attendanceRate}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] font-bold uppercase ${
                                std.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {std.status}
                            </span>
                            <button
                              onClick={() => setSelectedStudentForDetail(std)}
                              className="text-xs text-[#DFB142] hover:underline font-semibold"
                            >
                              View $\rightarrow$
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Curricula & Programs View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#DFB142]">{prog.code}</span>
                  <h2 className="text-base font-black text-white mt-1 leading-snug">
                    {prog.title}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-white font-mono">
                    ${prog.tuitionFee}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Tuition Fee</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

              {/* Program Attributes */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-[#142940]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Duration
                  </span>
                  <p className="font-bold text-white">{prog.durationWeeks} Weeks</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Credit Units
                  </span>
                  <p className="font-bold text-white">{prog.creditHours} Hours</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Modules
                  </span>
                  <p className="font-bold text-white">{prog.modules.length} Core</p>
                </div>
              </div>

              {/* Modules Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Academic Modules & AI Labs
                </h3>
                <div className="space-y-1.5">
                  {prog.modules.map((m) => (
                    <div
                      key={m.code}
                      className="p-2 rounded-lg bg-[#071321] border border-[#13273E] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#C59B27] font-bold">
                          {m.code}
                        </span>
                        <span className="text-slate-200 font-medium truncate max-w-[200px]">
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {m.hours}h ({m.aiLabHours}h Lab)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Batch Creation Modal */}
      {showNewBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h2 className="text-lg font-black text-white mb-1">Launch New Academic Cohort</h2>
            <p className="text-xs text-slate-400 mb-4">
              Allocate laboratory facilities, assigned faculty lead, and student seat capacity
            </p>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Program Track</label>
                <select
                  value={newBatchProgramId}
                  onChange={(e) => setNewBatchProgramId(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Lead Faculty Member</label>
                <select
                  value={newBatchInstructorId}
                  onChange={(e) => setNewBatchInstructorId(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                >
                  {faculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Batch Code</label>
                  <input
                    type="text"
                    value={newBatchCode}
                    onChange={(e) => setNewBatchCode(e.target.value)}
                    placeholder="e.g. BCH-2026-X1"
                    className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Max Capacity</label>
                  <input
                    type="number"
                    value={newBatchCapacity}
                    onChange={(e) => setNewBatchCapacity(Number(e.target.value))}
                    min={5}
                    max={50}
                    className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Classroom / Lab Venue</label>
                <input
                  type="text"
                  value={newBatchRoom}
                  onChange={(e) => setNewBatchRoom(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#15273C]">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] font-bold shadow-md"
                >
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
