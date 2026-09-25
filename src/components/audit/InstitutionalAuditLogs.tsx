import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  GraduationCap,
  CreditCard,
  CalendarCheck,
  Award,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AuditLogEntry } from '../../types/erp';

export const InstitutionalAuditLogs: React.FC = () => {
  const { auditLogs } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actionType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedActionType === 'all' || log.actionType === selectedActionType;

      return matchesSearch && matchesType;
    });
  }, [auditLogs, searchTerm, selectedActionType]);

  const handleExportLogs = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Role', 'Action Type', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.actorRole,
      l.actionType,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAPIEN_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'admission':
        return { label: 'ADMISSION', color: 'bg-indigo-950 text-indigo-300 border-indigo-800' };
      case 'fee_payment':
        return { label: 'BURSAR PAYMENT', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'grade_posted':
        return { label: 'GRADE POSTED', color: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'attendance_marked':
        return { label: 'ROLL CALL', color: 'bg-sky-950 text-sky-300 border-sky-800' };
      case 'batch_created':
        return { label: 'COHORT LAUNCH', color: 'bg-purple-950 text-purple-300 border-purple-800' };
      case 'lead_updated':
        return { label: 'ADMISSIONS LEAD', color: 'bg-slate-900 text-slate-300 border-slate-700' };
      default:
        return { label: 'SYSTEM', color: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Security & Governance</span>
            <span aria-hidden="true">·</span>
            <span>Immutable Institutional Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            System Operations & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger of admissions, fee receipts, grades posted, and attendance sessions
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-2 rounded-lg bg-[#0F2236] hover:bg-[#16314D] text-slate-200 hover:text-white border border-[#1E3B5C] text-xs font-bold transition-all flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit records by actor name, event description, or action..."
            className="w-full bg-[#071424] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Operational Events</option>
            <option value="admission">Admissions</option>
            <option value="grade_posted">Grades & Assessments</option>
            <option value="fee_payment">Bursar Fee Payments</option>
            <option value="attendance_marked">Roll Call Sessions</option>
            <option value="batch_created">Cohort Launches</option>
            <option value="lead_updated">Applicant Pipeline</option>
          </select>
        </div>
      </div>

      {/* Main Audit Records Table */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#06111D] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#142940]">
              <tr>
                <th className="py-3 px-4">Event Timestamp</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Operational Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#13273E] text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    No audit records matching search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.actionType);
                  return (
                    <tr key={log.id} className="hover:bg-[#0B1E32]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{log.actor}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{log.actorRole}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 leading-relaxed font-medium">
                        {log.details}
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
