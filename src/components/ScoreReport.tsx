import React, { useState } from 'react';
import { ExamSubmission, Question, SyllabusCategory } from '../types/olympiad';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  BarChart2,
  Printer,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

interface ScoreReportProps {
  submission: ExamSubmission;
  questions: Question[];
  onRetakeExam: () => void;
  onViewProgress: () => void;
}

export const ScoreReport: React.FC<ScoreReportProps> = ({
  submission,
  questions,
  onRetakeExam,
  onViewProgress,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | SyllabusCategory>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    questions.forEach((q) => (all[q.id] = true));
    setExpandedQuestions(all);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  // Filter questions based on filterMode
  const filteredQuestions = questions.filter((q) => {
    const studentAnswer = submission.answers[q.id];
    const isCorrect = studentAnswer === q.correctAnswer;

    if (filterMode === 'incorrect') return !isCorrect;
    if (['A', 'B', 'C', 'D'].includes(filterMode)) return q.category === filterMode;
    return true;
  });

  const durationMin = Math.floor(submission.durationSeconds / 60);
  const durationSec = submission.durationSeconds % 60;
  const timeFormatted = `${durationMin}m ${durationSec}s`;

  // Award styling
  const awardConfig = {
    'Gold Honor': {
      title: 'Gold Honor Award',
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      badge: 'bg-amber-500 text-white',
      desc: 'Outstanding performance! Demonstrates exceptional mastery of English Olympiad competencies.',
    },
    'Silver Honor': {
      title: 'Silver Honor Award',
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      badge: 'bg-slate-400 text-white',
      desc: 'Commendable score! Solid command of vocabulary, reading analysis, and higher-order skills.',
    },
    'Bronze Honor': {
      title: 'Bronze Honor Award',
      color: 'text-amber-800 bg-orange-50 border-orange-200',
      badge: 'bg-amber-700 text-white',
      desc: 'Good effort! Targeted practice on complex grammar and HOTS will elevate you to Silver.',
    },
    'Honorable Mention': {
      title: 'Honorable Mention',
      color: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      badge: 'bg-indigo-600 text-white',
      desc: 'Passed the baseline threshold. Focus on strengthening Section D (HOTS) and syntactic parsing.',
    },
    Developing: {
      title: 'Developing Tier',
      color: 'text-rose-800 bg-rose-50 border-rose-200',
      badge: 'bg-rose-600 text-white',
      desc: 'Continuous training required. Review the syllabus modules and practice question rationale below.',
    },
  }[submission.award];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Top Controls & Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
            <span>Official Examination Result</span>
            <span aria-hidden="true">·</span>
            <span>Grade 7–8 English Olympiad</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Performance Scorecard & Solutions
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Scorecard</span>
          </button>
          <button
            onClick={onRetakeExam}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Practice Test</span>
          </button>
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Candidate & Mark */}
          <div className="space-y-1">
            <div className="text-xs text-slate-500">
              Candidate: <strong className="text-slate-800">{submission.studentName}</strong> ({submission.studentGrade})
              <span className="mx-2">·</span> {submission.school}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-display tabular-nums">
                {submission.score}
              </span>
              <span className="text-xl sm:text-2xl font-medium text-slate-400">
                / 100
              </span>
              <span className="ml-2 text-sm font-semibold text-slate-600">
                ({submission.correctCount} of {submission.totalQuestions} questions correct)
              </span>
            </div>
          </div>

          {/* Award Pill/Card */}
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${awardConfig.color}`}>
            <Award className="w-8 h-8 shrink-0" />
            <div>
              <span className="text-xs uppercase tracking-wider font-bold block opacity-75">
                Olympiad Designation
              </span>
              <span className="text-base font-bold">
                {awardConfig.title}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Time Elapsed</span>
            <div className="flex items-center gap-1.5 text-sm font-bold font-mono text-slate-800">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{timeFormatted}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Accuracy Rate</span>
            <div className="flex items-center gap-1.5 text-sm font-bold font-mono text-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{Math.round((submission.correctCount / submission.totalQuestions) * 100)}%</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Safe Exam Audit</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
              {submission.violations.length === 0 ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">0 Violations (Clean)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700">{submission.violations.length} Incident(s)</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Submitted On</span>
            <div className="text-xs font-semibold text-slate-700 pt-1">
              {new Date(submission.submittedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <strong className="text-slate-800">Evaluator Note:</strong> {awardConfig.desc}
        </p>
      </div>

      {/* Category Breakdown by Syllabus (A, B, C, D) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <h2 className="text-base font-bold text-slate-900">
          Syllabus Competency Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(SYLLABUS_SECTIONS) as SyllabusCategory[]).map((cat) => {
            const info = SYLLABUS_SECTIONS[cat];
            const stats = submission.categoryScores[cat] || { correct: 0, total: 5, percentage: 0 };

            return (
              <div
                key={cat}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-xs"
                      style={{ backgroundColor: info.color }}
                    >
                      {cat}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {info.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {stats.correct} / {stats.total} ({stats.percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.percentage}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {info.indonesianTitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-by-Question Solution Review */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Detailed Question Solutions & Rationales
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review every question with step-by-step grammatical explanations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="cursor-pointer text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              Expand All
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={collapseAll}
              className="cursor-pointer text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter Bar (Segmented control) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterMode('all')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'incorrect'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Review ({questions.length - submission.correctCount})
          </button>
          <button
            onClick={() => setFilterMode('A')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'A'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sec A: Words & Structure
          </button>
          <button
            onClick={() => setFilterMode('B')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'B'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sec B: Reading
          </button>
          <button
            onClick={() => setFilterMode('C')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'C'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sec C: Spoken & Written
          </button>
          <button
            onClick={() => setFilterMode('D')}
            className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${
              filterMode === 'D'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sec D: HOTS
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const studentAns = submission.answers[q.id];
            const isCorrect = studentAns === q.correctAnswer;
            const isExpanded = expandedQuestions[q.id] ?? false;
            const catInfo = SYLLABUS_SECTIONS[q.category];

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="cursor-pointer p-4 flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}

                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Q{q.id}
                    </span>

                    <span
                      className="w-5 h-5 rounded-sm flex items-center justify-center font-bold text-white text-[10px]"
                      style={{ backgroundColor: catInfo.color }}
                    >
                      {q.category}
                    </span>

                    <span className="text-sm font-medium text-slate-800 line-clamp-1">
                      {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">
                      Your choice: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>{studentAns || 'Unanswered'}</strong> · Correct: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 text-sm text-slate-700">
                    {/* Optional Passage */}
                    {q.passage && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed italic text-slate-600">
                        <span className="font-semibold not-italic block text-slate-800 mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Reading Passage:
                        </span>
                        {q.passage}
                      </div>
                    )}

                    {/* Question Stem */}
                    <div className="font-medium text-slate-900 whitespace-pre-line leading-relaxed">
                      {q.stem}
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isThisCorrect = opt.key === q.correctAnswer;
                        const isThisStudentChoice = opt.key === studentAns;

                        let optClass = 'border-slate-200 bg-white text-slate-700';
                        if (isThisCorrect) {
                          optClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-300';
                        } else if (isThisStudentChoice && !isThisCorrect) {
                          optClass = 'border-rose-300 bg-rose-50 text-rose-900';
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${optClass}`}
                          >
                            <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 bg-white/80 border border-slate-200">
                              {opt.key}
                            </span>
                            <span className="pt-0.5">{opt.text}</span>
                            {isThisCorrect && (
                              <span className="ml-auto text-xs text-emerald-700 font-bold shrink-0">
                                Correct Answer
                              </span>
                            )}
                            {isThisStudentChoice && !isThisCorrect && (
                              <span className="ml-auto text-xs text-rose-600 font-medium shrink-0">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation */}
                    <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950 leading-relaxed">
                      <strong className="block mb-1 text-indigo-900">Grammar & Concept Rationale:</strong>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-display">
            Continue Your Olympiad Journey
          </h3>
          <p className="text-xs text-slate-400">
            Review past scores, category radar, and track improvement over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewProgress}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>View Progress Dashboard</span>
          </button>
          <button
            onClick={onRetakeExam}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Practice Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
