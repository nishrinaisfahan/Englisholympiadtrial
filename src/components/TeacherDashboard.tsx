import React, { useState } from 'react';
import {
  ExamSettings,
  ExamSubmission,
  Question,
  SyllabusCategory,
} from '../types/olympiad';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import {
  Lock,
  Unlock,
  Shield,
  Settings,
  Users,
  FileQuestion,
  Download,
  Trash2,
  Plus,
  Edit2,
  RotateCcw,
  CheckCircle,
  Eye,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

interface TeacherDashboardProps {
  submissions: ExamSubmission[];
  questions: Question[];
  settings: ExamSettings;
  teacherPin: string;
  onUpdateSettings: (settings: ExamSettings) => void;
  onUpdateQuestions: (questions: Question[]) => void;
  onResetQuestions: () => void;
  onClearSubmissions: () => void;
  onReviewSubmission: (submission: ExamSubmission) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions,
  questions,
  settings,
  teacherPin,
  onUpdateSettings,
  onUpdateQuestions,
  onResetQuestions,
  onClearSubmissions,
  onReviewSubmission,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'roster' | 'questions' | 'settings'>('roster');

  // Question editing / adding state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingNewQuestion, setIsAddingNewQuestion] = useState<boolean>(false);
  const [questionFilter, setQuestionFilter] = useState<string>('all');

  // Exam settings local form
  const [duration, setDuration] = useState<number>(settings.durationMinutes);
  const [strictSafeBrowser, setStrictSafeBrowser] = useState<boolean>(settings.strictSafeBrowser);
  const [maxViolations, setMaxViolations] = useState<number>(settings.maxAllowedViolations);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(settings.shuffleQuestions);
  const [passingScore, setPassingScore] = useState<number>(settings.passingScore);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === teacherPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid Teacher Access PIN. Default is 1234.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      durationMinutes: duration,
      strictSafeBrowser,
      maxAllowedViolations: maxViolations,
      shuffleQuestions,
      passingScore,
    });
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // Export submissions to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['Submission ID', 'Student Name', 'Grade', 'School', 'Date', 'Score', 'Correct', 'Total', 'Award', 'Violations', 'Duration Seconds'];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.studentName.replace(/"/g, '""')}"`,
      s.studentGrade,
      `"${s.school.replace(/"/g, '""')}"`,
      new Date(s.submittedAt).toISOString(),
      s.score,
      s.correctCount,
      s.totalQuestions,
      s.award,
      s.violations.length,
      s.durationSeconds,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `olympiad_grade7_8_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save edited or new question
  const handleSaveQuestion = (q: Question) => {
    if (isAddingNewQuestion) {
      const updated = [...questions, { ...q, id: questions.length + 1 }];
      onUpdateQuestions(updated);
      setIsAddingNewQuestion(false);
    } else {
      const updated = questions.map((item) => (item.id === q.id ? q : item));
      onUpdateQuestions(updated);
      setEditingQuestion(null);
    }
  };

  // If not authenticated, show Teacher PIN gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Teacher Mode Authentication
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your Instructor PIN to access class exam results, Safe Exam Browser controls, and Question Bank customization.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Instructor PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN (default: 1234)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Access Teacher Console</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Default Demo PIN: <strong className="font-mono text-slate-800">1234</strong></span>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="cursor-pointer text-indigo-600 hover:underline font-semibold"
            >
              Instant Demo Access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter questions by category
  const filteredQuestions = questions.filter((q) => {
    if (questionFilter === 'all') return true;
    return q.category === questionFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
            <span>Instructor Administration</span>
            <span aria-hidden="true">·</span>
            <span>Grade 7–8 English Olympiad</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Teacher Management Console
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="cursor-pointer text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
          >
            Lock Console
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-md text-xs font-medium">
        <button
          onClick={() => setActiveTab('roster')}
          className={`cursor-pointer flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'roster'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Class Submissions ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`cursor-pointer flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'questions'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`cursor-pointer flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-white text-slate-900 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Exam Rules & Safe Browser</span>
        </button>
      </div>

      {/* TAB 1: Class Roster & Submissions */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Top action row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Review student marks, cheating detection audit logs, and category strengths.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={submissions.length === 0}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to CSV</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all student test records?')) {
                    onClearSubmissions();
                  }
                }}
                disabled={submissions.length === 0}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Records</span>
              </button>
            </div>
          </div>

          {/* Submissions table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No student submissions found. When students complete a test in Safe Exam mode, results appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Grade & School</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Award</th>
                      <th className="py-3 px-4">Safe Exam Audit</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {sub.studentName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {sub.studentGrade} · {sub.school}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <span className="text-base text-indigo-700">{sub.score}</span> / 100
                          <span className="text-[11px] text-slate-500 font-normal ml-1">
                            ({sub.correctCount}/{sub.totalQuestions})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                          {sub.award}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {sub.violations.length === 0 ? (
                            <span className="text-emerald-700 font-medium">0 Violations (Clean)</span>
                          ) : (
                            <span className="text-amber-700 font-medium">
                              {sub.violations.length} Tab/Blur Switch(es)
                              {sub.isLockedDueToViolations && ' (Auto-Locked)'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onReviewSubmission(sub)}
                            className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Mark</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Question Bank Manager */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                20-Question Olympiad Question Bank
              </h2>
              <p className="text-xs text-slate-500">
                Aligned with Sections A, B, C, D of the official Grade 7–8 Olympiad curriculum.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Reset question bank back to default 20 curriculum questions?')) {
                    onResetQuestions();
                  }
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                onClick={() => {
                  setIsAddingNewQuestion(true);
                  setEditingQuestion({
                    id: questions.length + 1,
                    category: 'A',
                    topic: 'New Olympiad Topic',
                    stem: '',
                    options: [
                      { key: 'A', text: '' },
                      { key: 'B', text: '' },
                      { key: 'C', text: '' },
                      { key: 'D', text: '' },
                    ],
                    correctAnswer: 'A',
                    explanation: '',
                    difficulty: 'Medium',
                  });
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setQuestionFilter('all')}
              className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
                questionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sections ({questions.length})
            </button>
            {(['A', 'B', 'C', 'D'] as SyllabusCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setQuestionFilter(cat)}
                className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
                  questionFilter === cat
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Section {cat}: {SYLLABUS_SECTIONS[cat].name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const catInfo = SYLLABUS_SECTIONS[q.category];
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Q{q.id}
                      </span>
                      <span
                        className="w-5 h-5 rounded-sm flex items-center justify-center font-bold text-white text-[10px]"
                        style={{ backgroundColor: catInfo.color }}
                      >
                        {q.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        Section {q.category} · {q.topic}
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingNewQuestion(false);
                        setEditingQuestion(q);
                      }}
                      className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Question</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                    {q.stem}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded border flex items-center gap-2 ${
                          opt.key === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono font-bold w-4">{opt.key}.</span>
                        <span className="truncate">{opt.text}</span>
                        {opt.key === q.correctAnswer && (
                          <span className="ml-auto text-[10px] text-emerald-700 font-bold uppercase">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-700">Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question Editor Modal */}
          {editingQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {isAddingNewQuestion ? 'Add New Olympiad Question' : `Edit Question #${editingQuestion.id}`}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsAddingNewQuestion(false);
                    }}
                    className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Syllabus Section</label>
                      <select
                        value={editingQuestion.category}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            category: e.target.value as SyllabusCategory,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                      >
                        <option value="A">Section A (Words & Structure)</option>
                        <option value="B">Section B (Reading)</option>
                        <option value="C">Section C (Spoken & Written)</option>
                        <option value="D">Section D (HOTS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Topic</label>
                      <input
                        type="text"
                        value={editingQuestion.topic}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, topic: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                        placeholder="e.g. Relative Clauses"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
                      <select
                        value={editingQuestion.difficulty}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            difficulty: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                      >
                        <option value="Medium">Medium</option>
                        <option value="Challenging">Challenging</option>
                        <option value="Olympiad Master">Olympiad Master</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Optional Reading Passage</label>
                    <textarea
                      value={editingQuestion.passage || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, passage: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                      placeholder="Leave blank if not applicable to this question"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Question Stem</label>
                    <textarea
                      value={editingQuestion.stem}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, stem: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 block">Answer Choices</label>
                    {editingQuestion.options.map((opt, i) => (
                      <div key={opt.key} className="flex items-center gap-2">
                        <span className="font-mono font-bold w-6">{opt.key}.</span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...editingQuestion.options];
                            newOpts[i] = { ...newOpts[i], text: e.target.value };
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                          placeholder={`Option ${opt.key}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Correct Answer</label>
                      <select
                        value={editingQuestion.correctAnswer}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            correctAnswer: e.target.value as 'A' | 'B' | 'C' | 'D',
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pedagogical Explanation</label>
                    <textarea
                      value={editingQuestion.explanation}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsAddingNewQuestion(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveQuestion(editingQuestion)}
                    className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Save to Question Bank
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Exam Rules & Safe Browser Configuration */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Safe Exam Browser & Exam Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure lockdown strictness, cheating violation penalties, and exam time limits for Grade 7–8 students.
            </p>
          </div>

          <div className="space-y-4">
            {/* Strict Safe Exam Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Strict Safe Exam Browser Mode
                </span>
                <p className="text-xs text-slate-600">
                  Enforces full-screen requirement, detects tab switching & window blur, and blocks copy/paste/shortcuts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={strictSafeBrowser}
                onChange={(e) => setStrictSafeBrowser(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer mt-1"
              />
            </div>

            {/* Max Violations before Auto-submission */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Maximum Allowed Tab Violations Before Auto-Submission
              </label>
              <select
                value={maxViolations}
                onChange={(e) => setMaxViolations(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>1 Warning (Ultra Strict)</option>
                <option value={2}>2 Warnings</option>
                <option value={3}>3 Warnings (Standard Olympiad)</option>
                <option value={5}>5 Warnings (Lenient Practice)</option>
                <option value={999}>Unlimited Warnings (No Auto-Lock)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                If student switches tabs or minimizes screen this many times, their exam locks and auto-submits.
              </span>
            </div>

            {/* Test Duration */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Test Duration (Minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>15 Minutes (Speed Drill)</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes (Standard 20-Q Exam)</option>
                <option value={45}>45 Minutes (Extended Time)</option>
                <option value={60}>60 Minutes (Deep Analysis)</option>
              </select>
            </div>

            {/* Passing Score */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Passing Score Threshold (0 - 100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Shuffle Questions */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="shuffle"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="shuffle" className="text-xs text-slate-700 cursor-pointer">
                Randomize Question Order for each student test
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {settingsSavedMessage && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="cursor-pointer px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                Save Exam Configuration
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
