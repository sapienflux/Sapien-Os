import React, { useState } from 'react';
import { X, UserPlus, GraduationCap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewAdmissionModal: React.FC<NewAdmissionModalProps> = ({ isOpen, onClose }) => {
  const { programs, batches, addStudent, setSelectedStudentForDetail } = useERP();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedProgram = programs.find((p) => p.id === programId) || programs[0];
  const eligibleBatches = batches.filter((b) => b.programId === programId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please provide the scholar legal full name and institutional email.');
      return;
    }

    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Emergency contact name and telephone are mandatory for laboratory access.');
      return;
    }

    const assignedBatch = eligibleBatches[0]?.id || batchId;

    const newStudent = addStudent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      programId: selectedProgram.id,
      batchId: assignedBatch,
      emergencyContact: {
        name: emergencyName.trim(),
        relation: emergencyRelation,
        phone: emergencyPhone.trim(),
      },
      nationalId: nationalId.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setSelectedStudentForDetail(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0C1E32] to-[#0A1828] border-b border-[#162D47] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#DFB142]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Admit New Academy Scholar</h2>
              <p className="text-xs text-slate-400">
                Enrollment, batch cohort allocation & automated bursar invoice generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Scholar Identification */}
          <div>
            <h3 className="text-xs font-bold text-[#DFB142] uppercase tracking-wider mb-2.5">
              1. Scholar Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alexander"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Hayes"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander.hayes@student.sapien.academy"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 392-1082"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-medium">National / Passport ID</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. P90123847"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>
          </div>

          {/* Section: Academic Track & Cohort Placement */}
          <div className="pt-2 border-t border-[#15273C]">
            <h3 className="text-xs font-bold text-[#DFB142] uppercase tracking-wider mb-2.5">
              2. Academic Track & Cohort Placement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Future Skills Program</label>
                <select
                  value={programId}
                  onChange={(e) => {
                    setProgramId(e.target.value);
                    const matchingBatches = batches.filter((b) => b.programId === e.target.value);
                    if (matchingBatches.length > 0) {
                      setBatchId(matchingBatches[0].id);
                    }
                  }}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (${p.tuitionFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Assigned Cohort Batch</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
                >
                  {eligibleBatches.length > 0 ? (
                    eligibleBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} ({b.room})
                      </option>
                    ))
                  ) : (
                    <option value="">No active batches for this program</option>
                  )}
                </select>
              </div>
            </div>

            {/* Tuition Breakdown Preview */}
            <div className="mt-3 p-3 rounded-lg bg-[#050E17] border border-[#142A42] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Total Invoiced on Admission:</span>
                <p className="text-[11px] text-slate-500">
                  Includes Program Tuition (${selectedProgram.tuitionFee}) + Neural Lab GPU Pass ($350) + Registration ($150)
                </p>
              </div>
              <span className="text-base font-black text-white font-mono">
                ${selectedProgram.tuitionFee + 500}
              </span>
            </div>
          </div>

          {/* Section: Emergency Contact */}
          <div className="pt-2 border-t border-[#15273C]">
            <h3 className="text-xs font-bold text-[#DFB142] uppercase tracking-wider mb-2.5">
              3. Emergency Contact & Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Evelyn Hayes"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Relationship *</label>
                <select
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
                >
                  <option value="Parent">Parent</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Emergency Phone *</label>
                <input
                  type="tel"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+1 (555) 901-4432"
                  className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#15273C] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Admission & Generate Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
