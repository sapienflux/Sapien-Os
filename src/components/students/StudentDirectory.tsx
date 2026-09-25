import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  CreditCard,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Student, StudentStatus } from '../../types/erp';

interface StudentDirectoryProps {
  onOpenAdmission: () => void;
  onOpenQuickPaymentForStudent: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  onOpenAdmission,
  onOpenQuickPaymentForStudent,
}) => {
  const {
    students,
    programs,
    batches,
    role,
    setSelectedStudentForDetail,
    updateStudent,
    deleteStudent,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        std.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        std.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        std.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        std.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram = selectedProgram === 'all' || std.programId === selectedProgram;
      const matchesStatus = selectedStatus === 'all' || std.status === selectedStatus;
      const matchesBatch = selectedBatch === 'all' || std.batchId === selectedBatch;

      return matchesSearch && matchesProgram && matchesStatus && matchesBatch;
    });
  }, [students, searchTerm, selectedProgram, selectedStatus, selectedBatch]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Student Code',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Program',
      'Batch',
      'Status',
      'GPA',
      'Attendance Rate',
      'Admission Date',
    ];

    const rows = filteredStudents.map((s) => [
      s.studentCode,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      s.email,
      s.phone,
      `"${s.programTitle}"`,
      s.batchCode,
      s.status,
      s.gpa.toFixed(2),
      `${s.attendanceRate}%`,
      s.admissionDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAPIEN_Scholars_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Student Information System</span>
            <span aria-hidden="true">·</span>
            <span>Master Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Academic Scholars Roster
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {filteredStudents.length} of {students.length} enrolled scholars displayed across active future skills tracks
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-[#0F2236] hover:bg-[#16314D] text-slate-300 hover:text-white border border-[#1E3B5C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          {role !== 'student' && (
            <button
              onClick={onOpenAdmission}
              className="px-3.5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit Scholar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full bg-[#071424] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        {/* Program Track Selector */}
        <div>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Academic Tracks</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Cohort / Batch Selector */}
        <div>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Batches / Cohorts</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} ({b.room})
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Academic Standings</option>
            <option value="active">Active Enrolled</option>
            <option value="probation">Probation (&lt; 80% attendance)</option>
            <option value="graduated">Graduated Alumni</option>
            <option value="leave">On Approved Leave</option>
          </select>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#06111D] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#142940]">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Program & Batch</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Cumulative GPA</th>
                <th className="py-3 px-4">Academic Status</th>
                <th className="py-3 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#13273E] text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No scholars found matching current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const isProbation = std.status === 'probation' || std.attendanceRate < 75;

                  return (
                    <tr
                      key={std.id}
                      className="hover:bg-[#0B1E32]/70 transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#142A42] border border-[#C59B27]/30 flex items-center justify-center text-xs font-bold text-[#DFB142] shrink-0">
                            {std.firstName[0]}
                            {std.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-[#DFB142] transition-colors">
                              {std.firstName} {std.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="font-mono text-[#C59B27]">{std.studentCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>{std.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Program & Batch */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-200 truncate max-w-xs">
                          {std.programTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Cohort {std.batchCode}
                        </p>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#071424] rounded-full h-1.5 overflow-hidden border border-[#17314E]">
                            <div
                              className={`h-full rounded-full ${
                                std.attendanceRate >= 85
                                  ? 'bg-emerald-400'
                                  : std.attendanceRate >= 75
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${std.attendanceRate}%` }}
                            />
                          </div>
                          <span
                            className={`font-semibold font-mono ${
                              std.attendanceRate >= 80 ? 'text-slate-200' : 'text-rose-400 font-bold'
                            }`}
                          >
                            {std.attendanceRate}%
                          </span>
                        </div>
                      </td>

                      {/* GPA */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white text-xs">
                          {std.gpa.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/ 4.0 Scale</span>
                      </td>

                      {/* Academic Status (Clean unboxed text per anti-slop rules) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              std.status === 'active'
                                ? 'bg-emerald-400'
                                : std.status === 'probation'
                                ? 'bg-rose-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span
                            className={`font-semibold capitalize text-xs ${
                              std.status === 'active'
                                ? 'text-emerald-400'
                                : std.status === 'probation'
                                ? 'text-rose-400'
                                : 'text-slate-300'
                            }`}
                          >
                            {std.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForDetail(std)}
                            className="p-1.5 rounded-lg bg-[#142940] hover:bg-[#1E3B5C] text-slate-300 hover:text-white transition-colors"
                            title="View Scholar Profile & Academic Transcript"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {(role === 'admin' || role === 'finance') && (
                            <button
                              onClick={() => onOpenQuickPaymentForStudent(std)}
                              className="p-1.5 rounded-lg bg-[#142940] hover:bg-[#1E3B5C] text-[#DFB142] hover:text-white transition-colors"
                              title="Record Tuition Fee Receipt"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
