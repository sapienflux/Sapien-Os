import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  UserCheck,
  Bell,
  ChevronRight,
  ShieldCheck,
  Building2,
  LogOut,
  UserPlus,
  Award,
  Cpu,
  FileCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SapienLogo } from '../SapienLogo';
import { UserRole } from '../../types/erp';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { role, setRole, activeTab, setActiveTab, alerts, students, invoices, leads } = useERP();

  const activeLeadsCount = leads.filter(
    (l) => l.stage !== 'enrolled' && l.stage !== 'declined'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ['admin', 'director', 'faculty', 'finance', 'student'],
    },
    {
      id: 'admissions',
      label: 'Admissions Pipeline',
      icon: UserPlus,
      badge: activeLeadsCount > 0 ? activeLeadsCount : null,
      badgeColor: 'text-[#DFB142] bg-[#142A42] border border-[#C59B27]/40',
      allowedRoles: ['admin', 'director'],
    },
    {
      id: 'students',
      label: 'Student Directory (SIS)',
      icon: Users,
      badge: students.length,
      allowedRoles: ['admin', 'director', 'faculty', 'finance'],
    },
    {
      id: 'academics',
      label: 'Programs & Batches',
      icon: GraduationCap,
      badge: null,
      allowedRoles: ['admin', 'director', 'faculty', 'student'],
    },
    {
      id: 'attendance',
      label: 'Daily Roll Call & Timetable',
      icon: CalendarCheck,
      badge: null,
      allowedRoles: ['admin', 'director', 'faculty', 'student'],
    },
    {
      id: 'grading',
      label: 'Assessments & Gradebook',
      icon: Award,
      badge: null,
      allowedRoles: ['admin', 'director', 'faculty', 'student'],
    },
    {
      id: 'finance',
      label: 'Bursar & Financial Ledger',
      icon: CreditCard,
      badge: invoices.filter((i) => i.status === 'unpaid' || i.status === 'overdue').length,
      badgeColor: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
      allowedRoles: ['admin', 'director', 'finance'],
    },
    {
      id: 'facilities',
      label: 'Neural Labs & Matrix',
      icon: Cpu,
      badge: null,
      allowedRoles: ['admin', 'director', 'faculty'],
    },
    {
      id: 'faculty',
      label: 'Faculty & Researchers',
      icon: UserCheck,
      badge: null,
      allowedRoles: ['admin', 'director'],
    },
    {
      id: 'audit',
      label: 'Institutional Audit Trail',
      icon: ShieldCheck,
      badge: null,
      allowedRoles: ['admin', 'director'],
    },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    admin: { title: 'Super Administrator', color: 'text-[#DFB142]' },
    director: { title: 'Academic Director', color: 'text-sky-400' },
    faculty: { title: 'Lead Instructor', color: 'text-emerald-400' },
    finance: { title: 'Bursar & Finance Officer', color: 'text-amber-400' },
    student: { title: 'Enrolled Scholar', color: 'text-indigo-400' },
  };

  const activeNav = navItems.filter((item) => item.allowedRoles.includes(role));

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#07121E] border-r border-[#15273C] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-68'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header / Branding */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-[#15273C] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <SapienLogo variant={collapsed ? 'mark' : 'white-text'} size={collapsed ? 'sm' : 'md'} />
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-[#15273C] transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* User Role Switcher Quick Pill */}
        <div className="px-3 py-3 border-b border-[#15273C]/80">
          {!collapsed ? (
            <div className="p-2.5 rounded-lg bg-[#0B1B2B] border border-[#1B3252]/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Current Role Context</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#132840] text-[#DFB142] border border-[#C59B27]/30">
                  Active
                </span>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#071424] text-xs font-semibold text-slate-200 rounded px-2 py-1.5 border border-[#1F3757] focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                <option value="admin">Super Administrator (All Access)</option>
                <option value="director">Academic Director</option>
                <option value="faculty">Lead Faculty / Instructor</option>
                <option value="finance">Bursar & Finance Officer</option>
                <option value="student">Student Portal View</option>
              </select>
            </div>
          ) : (
            <div className="flex justify-center" title={`Role: ${roleLabels[role].title}`}>
              <div className="w-9 h-9 rounded-lg bg-[#0B1B2B] border border-[#1B3252] flex items-center justify-center text-[#DFB142]">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Core Institutional Modules
            </div>
          )}

          {activeNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#12263F] text-white shadow-sm border border-[#1F3E65]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0D1E30]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#DFB142]' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== null && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-[#152B44] text-slate-300 border border-[#214268]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Institutional Campus & Status Footer */}
        <div className="p-3 border-t border-[#15273C] bg-[#050D17]">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Building2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-slate-300 text-[11px] leading-tight truncate">
                    Main AI & Robotics Campus
                  </p>
                  <p className="text-[10px] text-slate-500">Autonomous Hall · Hub 01</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#15273C]/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>ERP Build 2026.9</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Main AI & Robotics Campus · Online">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
