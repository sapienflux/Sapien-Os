import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  Save,
  Check,
  X,
  History,
  Info,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AttendanceStatus } from '../../types/erp';

export const AttendanceTracker: React.FC = () => {
  const { batches, students, attendanceSessions, markBatchAttendance, role } = useERP();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sessionTopic, setSessionTopic] = useState<string>('Neural Network Architecture & Backprop');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const batchStudents = students.filter((s) => s.batchId === selectedBatch?.id);

  // Local attendance status state for the active sheet: studentId -> status
  const [rollCall, setRollCall] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; notes: string }> = {};
    batchStudents.forEach((std) => {
      initial[std.id] = { status: 'present', notes: '' };
    });
    return initial;
  });

  // Whenever batch changes, initialize rollCall for those students
  const handleBatchChange = (newBatchId: string) => {
    setSelectedBatchId(newBatchId);
    const newBatchStudents = students.filter((s) => s.batchId === newBatchId);
    const initial: Record<string, { status: AttendanceStatus; notes: string }> = {};
    newBatchStudents.forEach((std) => {
      initial[std.id] = { status: 'present', notes: '' };
    });
    setRollCall(initial);
    setSavedSuccess(false);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setRollCall((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { notes: '' }),
        status,
      },
    }));
    setSavedSuccess(false);
  };

  const setStudentNotes = (studentId: string, notes: string) => {
    setRollCall((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        notes,
      },
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
    batchStudents.forEach((std) => {
      updated[std.id] = { status: 'present', notes: '' };
    });
    setRollCall(updated);
    setSavedSuccess(false);
  };

  const handleSaveRollCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const records = batchStudents.map((std) => ({
      studentId: std.id,
      status: rollCall[std.id]?.status || 'present',
      notes: rollCall[std.id]?.notes || undefined,
    }));

    markBatchAttendance(selectedBatch.id, sessionDate, sessionTopic, records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Recent sessions for this batch
  const batchHistory = attendanceSessions.filter((s) => s.batchId === selectedBatch?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Academic Delivery</span>
            <span aria-hidden="true">·</span>
            <span>Live Class Roll Call</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Daily Attendance & Lab Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance tracking with automated 80% institutional threshold calculation
          </p>
        </div>

        {/* Batch Selection Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedBatchId}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="bg-[#06121E] text-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} · {b.programTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Roll Call Form Sheet */}
      <form onSubmit={handleSaveRollCall} className="space-y-4">
        {/* Session Meta Configuration Box */}
        <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Session Date</label>
            <input
              type="date"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-[#06121E] text-white p-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-400 mb-1 font-medium">
              Curricular Topic / Lab Objective
            </label>
            <input
              type="text"
              required
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="e.g. Distributed Model Sharding & Tensor Parallelism"
              className="w-full bg-[#06121E] text-white p-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27]"
            />
          </div>
        </div>

        {/* Student Attendance List Table */}
        <div className="bg-[#091827] border border-[#162D47] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#142940] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#DFB142]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Cohort Roll Call Sheet ({batchStudents.length} Scholars)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllPresent}
                className="px-3 py-1.5 rounded-lg bg-[#0F2236] hover:bg-[#16314D] text-slate-200 text-xs font-semibold border border-[#1E3B5C] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark All Present</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#06111D] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#142940]">
                <tr>
                  <th className="py-3 px-4">Scholar ID & Name</th>
                  <th className="py-3 px-4">Cumulative Attendance</th>
                  <th className="py-3 px-4">Session Verification</th>
                  <th className="py-3 px-4">Instructor Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#13273E] text-slate-300">
                {batchStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No scholars registered for this cohort yet.
                    </td>
                  </tr>
                ) : (
                  batchStudents.map((std) => {
                    const currentStatus = rollCall[std.id]?.status || 'present';
                    const currentNotes = rollCall[std.id]?.notes || '';

                    return (
                      <tr key={std.id} className="hover:bg-[#0B1E32]/50 transition-colors">
                        {/* Student Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[11px] text-[#C59B27] font-semibold">
                              {std.studentCode}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">
                              ·
                            </span>
                            <span className="font-bold text-white">
                              {std.firstName} {std.lastName}
                            </span>
                          </div>
                        </td>

                        {/* Cumulative Attendance */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold ${
                                std.attendanceRate >= 80 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {std.attendanceRate}%
                            </span>
                            {std.attendanceRate < 80 && (
                              <span className="text-[10px] text-rose-400 font-semibold">
                                (Below 80% Rule)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Interactive Verification Buttons (Allowed per constitution) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStudentStatus(std.id, 'present')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                                  : 'bg-[#0E2034] text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Present
                            </button>

                            <button
                              type="button"
                              onClick={() => setStudentStatus(std.id, 'late')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                                  : 'bg-[#0E2034] text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Late
                            </button>

                            <button
                              type="button"
                              onClick={() => setStudentStatus(std.id, 'excused')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'excused'
                                  ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400'
                                  : 'bg-[#0E2034] text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Excused
                            </button>

                            <button
                              type="button"
                              onClick={() => setStudentStatus(std.id, 'absent')}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-700 text-white shadow-sm ring-1 ring-rose-400'
                                  : 'bg-[#0E2034] text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>

                        {/* Notes Input */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={currentNotes}
                            onChange={(e) => setStudentNotes(std.id, e.target.value)}
                            placeholder="Reason for absence or late arrival..."
                            className="w-full bg-[#06121E] text-xs text-slate-200 placeholder-slate-500 px-2.5 py-1 rounded border border-[#162D47] focus:outline-none focus:border-[#C59B27]"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Action Bar Footer */}
          <div className="p-4 bg-[#071321] border-t border-[#142940] flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-400">
              <span>Instructor of Record: </span>
              <span className="font-bold text-white">{selectedBatch?.instructorName}</span>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle className="w-4 h-4" />
                  Attendance Logged & Compliance Standing Updated!
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Commit Roll Call</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Historical Sessions Log */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#DFB142]" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Prior Attendance Sessions ({batchHistory.length})
          </h2>
        </div>

        {batchHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No prior session records on file for this batch.</p>
        ) : (
          <div className="space-y-2">
            {batchHistory.map((s) => {
              const presentCount = s.records.filter((r) => r.status === 'present').length;
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-lg bg-[#071321] border border-[#142940] flex items-center justify-between flex-wrap gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{s.date}</span>
                      <span aria-hidden="true" className="text-slate-600">
                        ·
                      </span>
                      <span className="text-slate-300 font-medium">{s.topicCovered}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono font-bold">
                      {presentCount} / {s.records.length} Present
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
