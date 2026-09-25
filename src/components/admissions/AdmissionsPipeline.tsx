import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  Calendar,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeadInquiry, LeadStage } from '../../types/erp';

export const AdmissionsPipeline: React.FC = () => {
  const {
    leads,
    programs,
    batches,
    updateLeadStage,
    convertLeadToScholar,
    addLead,
    setSelectedStudentForDetail,
    setActiveTab,
    role,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
  const [activeStageTab, setActiveStageTab] = useState<string>('all');

  // Conversion Modal State
  const [leadToConvert, setLeadToConvert] = useState<LeadInquiry | null>(null);
  const [conversionBatchId, setConversionBatchId] = useState<string>('');

  // New Lead Modal State
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadProgramId, setNewLeadProgramId] = useState(programs[0]?.id || '');
  const [newLeadExperience, setNewLeadExperience] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [newLeadScore, setNewLeadScore] = useState(85);

  const stageColumns: { id: LeadStage; title: string; color: string; badgeColor: string }[] = [
    {
      id: 'inquiry',
      title: 'Inquiry & Screening',
      color: 'border-slate-700',
      badgeColor: 'text-slate-300 bg-slate-900 border-slate-700',
    },
    {
      id: 'assessment_scheduled',
      title: 'Technical Assessment',
      color: 'border-amber-600',
      badgeColor: 'text-amber-300 bg-amber-950/70 border-amber-800',
    },
    {
      id: 'technical_interview',
      title: 'Faculty Interview',
      color: 'border-sky-600',
      badgeColor: 'text-sky-300 bg-sky-950/70 border-sky-800',
    },
    {
      id: 'offer_extended',
      title: 'Offer Extended',
      color: 'border-[#C59B27]',
      badgeColor: 'text-[#DFB142] bg-[#142A42] border-[#C59B27]/40',
    },
    {
      id: 'enrolled',
      title: 'Matriculated Scholar',
      color: 'border-emerald-600',
      badgeColor: 'text-emerald-300 bg-emerald-950/70 border-emerald-800',
    },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        l.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.programTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram =
        selectedProgramFilter === 'all' || l.programInterestedId === selectedProgramFilter;

      const matchesStage = activeStageTab === 'all' || l.stage === activeStageTab;

      return matchesSearch && matchesProgram && matchesStage;
    });
  }, [leads, searchTerm, selectedProgramFilter, activeStageTab]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const program = programs.find((p) => p.id === newLeadProgramId) || programs[0];

    addLead({
      applicantName: newLeadName.trim(),
      email: newLeadEmail.trim(),
      phone: newLeadPhone.trim() || '+1 (555) 000-0000',
      programInterestedId: program.id,
      programTitle: program.title,
      stage: 'inquiry',
      leadScore: Number(newLeadScore),
      priorExperience: newLeadExperience.trim() || 'Software/engineering background.',
      notes: newLeadNotes.trim() || 'Initial admissions inquiry captured.',
    });

    setShowNewLeadModal(false);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadExperience('');
    setNewLeadNotes('');
  };

  const handleOpenConvertModal = (lead: LeadInquiry) => {
    setLeadToConvert(lead);
    const eligibleBatches = batches.filter((b) => b.programId === lead.programInterestedId);
    setConversionBatchId(eligibleBatches[0]?.id || batches[0]?.id || '');
  };

  const handleConfirmConversion = () => {
    if (!leadToConvert || !conversionBatchId) return;
    const newStudent = convertLeadToScholar(leadToConvert.id, conversionBatchId);
    setLeadToConvert(null);
    setSelectedStudentForDetail(newStudent);
    setActiveTab('students');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Admissions Office</span>
            <span aria-hidden="true">·</span>
            <span>Prospective Scholars & Conversion Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admissions Funnel & Evaluation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage applicant qualifications, review technical assessments, and matriculate into cohorts
          </p>
        </div>

        {role !== 'student' && (
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Applicant Inquiry</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicants by name, email, or curriculum track..."
            className="w-full bg-[#071424] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedProgramFilter}
            onChange={(e) => setSelectedProgramFilter(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Future Skills Tracks</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Board View (5 Linear Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stageColumns.map((col) => {
          const columnLeads = filteredLeads.filter((l) => l.stage === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#081524] border border-[#142940] rounded-xl flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#142940] bg-[#0A1828] rounded-t-xl flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-white leading-tight">{col.title}</h2>
                  <span className="text-[10px] text-slate-400">{columnLeads.length} Candidates</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${col.badgeColor}`}
                >
                  {columnLeads.length}
                </span>
              </div>

              {/* Candidate Cards Stream */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                {columnLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-500">
                    No candidates in this stage.
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-lg bg-[#0B1C2E] border border-[#183350] hover:border-[#C59B27]/50 transition-all shadow-xs space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#DFB142] transition-colors leading-snug">
                            {lead.applicantName}
                          </p>
                          <p className="text-[10px] text-[#C59B27] truncate max-w-[150px] font-medium">
                            {lead.programTitle}
                          </p>
                        </div>

                        {/* Candidate Score */}
                        <div
                          className="shrink-0 text-right"
                          title="Entrance Aptitude Score (Out of 100)"
                        >
                          <span
                            className={`font-mono text-xs font-black ${
                              lead.leadScore >= 90
                                ? 'text-emerald-400'
                                : lead.leadScore >= 80
                                ? 'text-[#DFB142]'
                                : 'text-slate-300'
                            }`}
                          >
                            {lead.leadScore}
                          </span>
                          <span className="text-[9px] text-slate-500 block">pts</span>
                        </div>
                      </div>

                      {/* Prior Experience Snippet */}
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed bg-[#071321] p-1.5 rounded border border-[#13273E]">
                        {lead.priorExperience}
                      </p>

                      {/* Contact & Date Info */}
                      <div className="pt-1.5 border-t border-[#142940] flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[110px]">{lead.email}</span>
                        <span>{lead.appliedDate}</span>
                      </div>

                      {/* Stage Progression & Action Controls */}
                      {role !== 'student' && (
                        <div className="pt-1.5 flex items-center justify-between gap-1 text-[10px]">
                          {lead.stage !== 'enrolled' ? (
                            <>
                              <select
                                value={lead.stage}
                                onChange={(e) =>
                                  updateLeadStage(lead.id, e.target.value as LeadStage)
                                }
                                className="bg-[#071321] text-slate-300 text-[10px] font-medium px-1.5 py-1 rounded border border-[#193554] focus:outline-none cursor-pointer"
                              >
                                <option value="inquiry">Inquiry</option>
                                <option value="assessment_scheduled">Assessment</option>
                                <option value="technical_interview">Interview</option>
                                <option value="offer_extended">Offer</option>
                                <option value="declined">Declined</option>
                              </select>

                              {lead.stage === 'offer_extended' && (
                                <button
                                  onClick={() => handleOpenConvertModal(lead)}
                                  className="px-2 py-1 rounded bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Matriculate into Student Roster"
                                >
                                  <span>Matriculate</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Enrolled Scholar</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Convert to Scholar Modal */}
      {leadToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#DFB142]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Matriculate Candidate</h2>
                <p className="text-xs text-slate-400">
                  Convert candidate to enrolled student record & generate invoice
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#071321] border border-[#142940] space-y-1 text-xs">
              <p className="font-bold text-white">{leadToConvert.applicantName}</p>
              <p className="text-slate-400">{leadToConvert.email}</p>
              <p className="text-[#DFB142] font-medium">{leadToConvert.programTitle}</p>
            </div>

            <div>
              <label className="block text-slate-300 text-xs mb-1 font-medium">
                Assign Cohort Section
              </label>
              <select
                value={conversionBatchId}
                onChange={(e) => setConversionBatchId(e.target.value)}
                className="w-full bg-[#071321] text-xs text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                {batches
                  .filter((b) => b.programId === leadToConvert.programInterestedId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} · {b.room} ({b.enrolledCount}/{b.maxCapacity} Seats)
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#142940]">
              <button
                onClick={() => setLeadToConvert(null)}
                className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConversion}
                className="px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold shadow-md"
              >
                Confirm Admission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Inquiry Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">Record Prospective Scholar Inquiry</h2>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Bell"
                  className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="jordan.bell@lab.io"
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+1 (555) 991-3320"
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Desired Program Track</label>
                <select
                  value={newLeadProgramId}
                  onChange={(e) => setNewLeadProgramId(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Technical Background</label>
                <input
                  type="text"
                  value={newLeadExperience}
                  onChange={(e) => setNewLeadExperience(e.target.value)}
                  placeholder="e.g. C++, ROS2, robotics sensor fusion experience"
                  className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Aptitude Score (1-100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newLeadScore}
                    onChange={(e) => setNewLeadScore(Number(e.target.value))}
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Notes / Counseling</label>
                  <input
                    type="text"
                    value={newLeadNotes}
                    onChange={(e) => setNewLeadNotes(e.target.value)}
                    placeholder="e.g. Inquired about evening schedule"
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#142940]">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold shadow-md"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
