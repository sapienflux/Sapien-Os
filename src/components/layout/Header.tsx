import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  CreditCard,
  UserPlus,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenNewAdmission: () => void;
  onOpenQuickPayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenNewAdmission,
  onOpenQuickPayment,
}) => {
  const {
    role,
    searchQuery,
    setSearchQuery,
    alerts,
    dismissAlert,
    students,
    batches,
    invoices,
    setSelectedStudentForDetail,
    setActiveTab,
  } = useERP();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close notifications if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search matching results
  const filteredStudents = searchQuery.trim()
    ? students
        .filter(
          (s) =>
            s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const filteredBatches = searchQuery.trim()
    ? batches
        .filter(
          (b) =>
            b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.programTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const userRoleMeta = {
    admin: { name: 'Mansoor Al-Hassan', tag: 'Super Administrator', initials: 'MH' },
    director: { name: 'Dr. Marcus Vance', tag: 'Academic Director', initials: 'MV' },
    faculty: { name: 'Prof. Elena Rostova', tag: 'Lead Faculty Lead', initials: 'ER' },
    finance: { name: 'Arthur Pendelton', tag: 'Chief Financial Bursar', initials: 'AP' },
    student: { name: 'Devon Kovac', tag: 'Scholar · GenAI Track', initials: 'DK' },
  }[role];

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#0B1B2B] border-b border-[#182F48] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#152B44] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with Live Results */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search students, student ID, batches, invoices..."
              className="w-full bg-[#071424] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-8 py-2 rounded-lg border border-[#1C3654] focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Popover */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#091828] border border-[#1E3B5C] rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Matching Records
              </div>
              {filteredStudents.length === 0 && filteredBatches.length === 0 ? (
                <div className="py-3 text-center text-slate-400">
                  No records found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentForDetail(s);
                        setActiveTab('students');
                        setSearchFocused(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-[#122840] flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[10px] text-[#C59B27] font-mono">{s.studentCode}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {s.programTitle}
                      </span>
                    </button>
                  ))}

                  {filteredBatches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveTab('academics');
                        setSearchFocused(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-[#122840] flex items-center justify-between text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#DFB142]">{b.code}</span>
                        <span className="text-slate-300 truncate max-w-[160px]">{b.programTitle}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{b.room}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Fast Actions, Alerts, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Institutional Action Buttons */}
        {role !== 'student' && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenNewAdmission}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Student</span>
            </button>

            {(role === 'admin' || role === 'finance') && (
              <button
                onClick={onOpenQuickPayment}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142C47] hover:bg-[#1B385A] text-slate-200 hover:text-white border border-[#21436B] text-xs font-medium transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#DFB142]" />
                <span>Record Fee</span>
              </button>
            )}
          </div>
        )}

        {/* Date Indicator (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 pl-2 pr-3 py-1 bg-[#071424] rounded-lg border border-[#19324E]">
          <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Autumn Trimester 2026 · Week 7</span>
        </div>

        {/* System Notifications Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Open notifications"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#152B44] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-[#0B1B2B]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#081524] border border-[#1E3B5C] rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#182E47] flex items-center justify-between bg-[#0B1B2B]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">Institutional Alerts</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/60">
                    {alerts.length} High Priority
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#15273C] p-1">
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    All operational metrics and thresholds in normal status.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 hover:bg-[#0D1E30] transition-colors rounded-lg flex items-start gap-2.5"
                    >
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          alert.severity === 'high'
                            ? 'text-rose-400'
                            : alert.severity === 'medium'
                            ? 'text-amber-400'
                            : 'text-sky-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 leading-snug">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#182E47]/50 text-[10px]">
                          <span className="text-slate-500">{alert.timestamp}</span>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#19324E]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C395C] to-[#0D1F33] border border-[#C59B27]/40 flex items-center justify-center text-xs font-bold text-[#DFB142] shadow-inner">
            {userRoleMeta.initials}
          </div>
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-xs font-bold text-slate-100">{userRoleMeta.name}</span>
            <span className="text-[10px] text-[#C59B27] font-medium mt-0.5">
              {userRoleMeta.tag}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
