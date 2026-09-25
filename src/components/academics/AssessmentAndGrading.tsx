import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileText,
  Save,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Assessment, LetterGrade, AssessmentType, Student } from '../../types/erp';

export const AssessmentAndGrading: React.FC = () => {
  const {
    batches,
    students,
    assessments,
    grades,
    addAssessment,
    recordGrade,
    setSelectedStudentForTranscript,
    role,
  } = useERP();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const batchAssessments = assessments.filter((a) => a.batchId === selectedBatch?.id);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    batchAssessments[0]?.id || ''
  );

  const selectedAssessment =
    assessments.find((a) => a.id === selectedAssessmentId) || batchAssessments[0];

  const batchStudents = students.filter((s) => s.batchId === selectedBatch?.id);

  // Local state for grading inputs
  const [gradeInputs, setGradeInputs] = useState<
    Record<string, { score: number; letterGrade: LetterGrade; feedback: string }>
  >({});

  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // New Assessment Modal State
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AssessmentType>('lab_benchmark');
  const [newModuleCode, setNewModuleCode] = useState('GEN-101');
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newWeight, setNewWeight] = useState(25);
  const [newDueDate, setNewDueDate] = useState('2026-10-15');

  const handleScoreChange = (studentId: string, scoreVal: number) => {
    // Auto-map score to letter grade
    let letter: LetterGrade = 'F';
    if (scoreVal >= 97) letter = 'A+';
    else if (scoreVal >= 93) letter = 'A';
    else if (scoreVal >= 90) letter = 'A-';
    else if (scoreVal >= 87) letter = 'B+';
    else if (scoreVal >= 83) letter = 'B';
    else if (scoreVal >= 80) letter = 'B-';
    else if (scoreVal >= 77) letter = 'C+';
    else if (scoreVal >= 70) letter = 'C';

    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: {
        score: scoreVal,
        letterGrade: letter,
        feedback: prev[studentId]?.feedback || '',
      },
    }));
  };

  const handleFeedbackChange = (studentId: string, feedback: string) => {
    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: {
        score: prev[studentId]?.score ?? 90,
        letterGrade: prev[studentId]?.letterGrade ?? 'A-',
        feedback,
      },
    }));
  };

  const handleSaveGrade = (studentId: string) => {
    if (!selectedAssessment) return;
    const input = gradeInputs[studentId];
    const existing = grades.find(
      (g) => g.assessmentId === selectedAssessment.id && g.studentId === studentId
    );

    const score = input?.score ?? existing?.score ?? 90;
    const letterGrade = input?.letterGrade ?? existing?.letterGrade ?? 'A-';
    const feedback = input?.feedback ?? existing?.feedback ?? 'Evaluated according to rubric standards.';

    recordGrade({
      assessmentId: selectedAssessment.id,
      studentId,
      score,
      letterGrade,
      feedback,
      gradedBy: selectedBatch?.instructorName || 'Faculty Evaluator',
    });

    setSaveFeedback(`Grade for scholar committed & GPA recalculated.`);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const created = addAssessment({
      batchId: selectedBatch.id,
      batchCode: selectedBatch.code,
      moduleCode: newModuleCode,
      title: newTitle.trim() || 'Curricular Benchmark',
      type: newType,
      maxScore: Number(newMaxScore),
      weightPercent: Number(newWeight),
      dueDate: newDueDate,
    });

    setSelectedAssessmentId(created.id);
    setShowNewAssessmentModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Academic Affairs</span>
            <span aria-hidden="true">·</span>
            <span>Continuous Assessment & Grading Schemes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Curricular Assessments & Gradebook
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Module benchmarks, laboratory grading, and real-time GPA calculations
          </p>
        </div>

        {/* Batch Selector & Assessment Creation */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedBatchId}
            onChange={(e) => {
              setSelectedBatchId(e.target.value);
              const batchAsms = assessments.filter((a) => a.batchId === e.target.value);
              setSelectedAssessmentId(batchAsms[0]?.id || '');
            }}
            className="bg-[#06121E] text-slate-200 text-xs font-bold px-3 py-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} · {b.programTitle}
              </option>
            ))}
          </select>

          {role !== 'student' && (
            <button
              onClick={() => setShowNewAssessmentModal(true)}
              className="px-3.5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Assessments Navigation + Gradebook Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Assessments List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Cohort Assessments ({batchAssessments.length})
            </h2>
          </div>

          <div className="space-y-2.5">
            {batchAssessments.length === 0 ? (
              <div className="p-6 bg-[#081524] rounded-xl border border-[#142940] text-center text-xs text-slate-400">
                No assessments configured for this cohort yet. Click "Publish Assessment" to add one.
              </div>
            ) : (
              batchAssessments.map((asm) => {
                const isSelected = asm.id === selectedAssessment?.id;
                const asmGrades = grades.filter((g) => g.assessmentId === asm.id);

                return (
                  <div
                    key={asm.id}
                    onClick={() => setSelectedAssessmentId(asm.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F243B] border-[#C59B27] shadow-lg'
                        : 'bg-[#091827] border-[#162D47] hover:border-[#1E3E63]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-[#DFB142] font-bold">{asm.moduleCode}</span>
                      <span className="text-slate-400 font-semibold uppercase">
                        {asm.type.replace('_', ' ')} · {asm.weightPercent}% Weight
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                      {asm.title}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#162D47]/70 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Due: {asm.dueDate}</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {asmGrades.length} / {batchStudents.length} Graded
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (2 Cols): Active Gradebook Table */}
        <div className="lg:col-span-2 space-y-5">
          {selectedAssessment ? (
            <div className="bg-[#091827] border border-[#162D47] rounded-xl overflow-hidden shadow-sm">
              {/* Assessment Meta Header */}
              <div className="p-4 border-b border-[#142940] bg-[#0A1828] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#DFB142]">
                      {selectedAssessment.moduleCode}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      Max Score: {selectedAssessment.maxScore} pts · {selectedAssessment.weightPercent}% Total Weight
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-0.5">{selectedAssessment.title}</h2>
                </div>

                {saveFeedback && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saveFeedback}
                  </span>
                )}
              </div>

              {/* Scholar Gradebook Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#06111D] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#142940]">
                    <tr>
                      <th className="py-3 px-4">Scholar Details</th>
                      <th className="py-3 px-4">Current GPA</th>
                      <th className="py-3 px-4">Points Score</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Instructor Feedback</th>
                      <th className="py-3 px-4 text-right">Commit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#13273E] text-slate-300">
                    {batchStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No scholars allocated to this cohort yet.
                        </td>
                      </tr>
                    ) : (
                      batchStudents.map((std) => {
                        const existingGrade = grades.find(
                          (g) =>
                            g.assessmentId === selectedAssessment.id && g.studentId === std.id
                        );

                        const currentScore =
                          gradeInputs[std.id]?.score ?? existingGrade?.score ?? 90;
                        const currentLetter =
                          gradeInputs[std.id]?.letterGrade ?? existingGrade?.letterGrade ?? 'A-';
                        const currentFeedback =
                          gradeInputs[std.id]?.feedback ?? existingGrade?.feedback ?? '';

                        return (
                          <tr key={std.id} className="hover:bg-[#0B1E32]/50 transition-colors">
                            {/* Scholar Info & Transcript Link */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-[11px] text-[#C59B27] font-semibold">
                                  {std.studentCode}
                                </span>
                                <span aria-hidden="true" className="text-slate-600">
                                  ·
                                </span>
                                <button
                                  onClick={() => setSelectedStudentForTranscript(std)}
                                  className="font-bold text-white hover:text-[#DFB142] hover:underline text-left"
                                  title="View Official Academic Transcript"
                                >
                                  {std.firstName} {std.lastName}
                                </button>
                              </div>
                            </td>

                            {/* Current GPA */}
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-white">
                                {std.gpa.toFixed(2)}
                              </span>
                            </td>

                            {/* Score Input */}
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min={0}
                                max={selectedAssessment.maxScore}
                                value={currentScore}
                                onChange={(e) =>
                                  handleScoreChange(std.id, Number(e.target.value))
                                }
                                disabled={role === 'student'}
                                className="w-16 bg-[#071321] text-xs font-mono font-bold text-white p-1.5 rounded border border-[#19334F] text-center focus:outline-none focus:border-[#C59B27] disabled:opacity-70"
                              />
                            </td>

                            {/* Letter Grade Badge */}
                            <td className="py-3 px-4">
                              <span
                                className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                                  currentLetter.startsWith('A')
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : currentLetter.startsWith('B')
                                    ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {currentLetter}
                              </span>
                            </td>

                            {/* Feedback Input */}
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={currentFeedback}
                                onChange={(e) => handleFeedbackChange(std.id, e.target.value)}
                                placeholder="Rubric feedback or code review remarks..."
                                disabled={role === 'student'}
                                className="w-full bg-[#071321] text-xs text-slate-300 p-1.5 rounded border border-[#19334F] focus:outline-none focus:border-[#C59B27] disabled:opacity-70"
                              />
                            </td>

                            {/* Commit Button */}
                            <td className="py-3 px-4 text-right">
                              {role !== 'student' && (
                                <button
                                  onClick={() => handleSaveGrade(std.id)}
                                  className="px-2.5 py-1 rounded bg-[#142A42] hover:bg-[#1E3B5C] text-[#DFB142] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                                  title="Commit Grade to Transcript"
                                >
                                  Save
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[#091827] border border-[#162D47] rounded-xl p-8 text-center text-xs text-slate-400">
              Select an assessment from the left panel or publish a new one.
            </div>
          )}
        </div>
      </div>

      {/* New Assessment Modal */}
      {showNewAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h2 className="text-base font-black text-white">Publish Cohort Assessment</h2>
            <p className="text-xs text-slate-400">
              Create a formal benchmark, exam, or capstone milestone for {selectedBatch?.code}
            </p>

            <form onSubmit={handleCreateAssessment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lab Benchmark 2: Triton Kernel Acceleration"
                  className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as AssessmentType)}
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  >
                    <option value="lab_benchmark">Lab Benchmark</option>
                    <option value="quiz">Quiz / Checkpoint</option>
                    <option value="midterm_exam">Midterm Exam</option>
                    <option value="capstone_project">Capstone Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Module Code</label>
                  <input
                    type="text"
                    value={newModuleCode}
                    onChange={(e) => setNewModuleCode(e.target.value)}
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Max Points</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Weight (% of Total)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-[#071321] text-white p-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#142940]">
                <button
                  type="button"
                  onClick={() => setShowNewAssessmentModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold shadow-md"
                >
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
