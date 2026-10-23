import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Question,
  ExamSettings,
  ExamSubmission,
  SyllabusCategory,
  ViolationRecord,
} from '../types/olympiad';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import { useSafeExamBrowser } from '../hooks/useSafeExamBrowser';
import { SecurityAlertModal } from './SecurityAlertModal';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Maximize,
  BookOpen,
  Send,
  HelpCircle,
} from 'lucide-react';

interface ExamEngineProps {
  questions: Question[];
  settings: ExamSettings;
  studentName: string;
  studentGrade: string;
  school: string;
  onExamComplete: (submission: ExamSubmission) => void;
  onCancelExam: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  questions,
  settings,
  studentName,
  studentGrade,
  school,
  onExamComplete,
  onCancelExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  // Prepare ordered questions (optionally shuffled if enabled)
  const activeQuestions = useMemo(() => {
    if (!settings.shuffleQuestions) return questions;
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions, settings.shuffleQuestions]);

  const currentQuestion = activeQuestions[currentIndex];

  // Calculate scores and build submission record
  const finalizeSubmission = useCallback(
    (violationRecords: ViolationRecord[], isLocked: boolean = false) => {
      let correctCount = 0;
      const categoryScores: Record<
        SyllabusCategory,
        { correct: number; total: number; percentage: number }
      > = {
        A: { correct: 0, total: 0, percentage: 0 },
        B: { correct: 0, total: 0, percentage: 0 },
        C: { correct: 0, total: 0, percentage: 0 },
        D: { correct: 0, total: 0, percentage: 0 },
      };

      activeQuestions.forEach((q) => {
        categoryScores[q.category].total += 1;
        const studentChoice = answers[q.id];
        if (studentChoice === q.correctAnswer) {
          correctCount += 1;
          categoryScores[q.category].correct += 1;
        }
      });

      // Calculate category percentages
      (Object.keys(categoryScores) as SyllabusCategory[]).forEach((cat) => {
        const item = categoryScores[cat];
        item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      });

      const totalQuestions = activeQuestions.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // Determine Olympiad Award
      let award: ExamSubmission['award'] = 'Developing';
      if (score >= 90) award = 'Gold Honor';
      else if (score >= 80) award = 'Silver Honor';
      else if (score >= 70) award = 'Bronze Honor';
      else if (score >= 55) award = 'Honorable Mention';

      const submission: ExamSubmission = {
        id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        studentName: studentName || 'Olympiad Candidate',
        studentGrade: studentGrade || 'Grade 8',
        school: school || 'Junior High School',
        submittedAt: Date.now(),
        durationSeconds: Math.round((Date.now() - startTime) / 1000),
        score,
        correctCount,
        totalQuestions,
        answers,
        categoryScores,
        violations: violationRecords,
        isLockedDueToViolations: isLocked,
        award,
      };

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      onExamComplete(submission);
    },
    [activeQuestions, answers, studentName, studentGrade, school, startTime, onExamComplete]
  );

  // Hook for Safe Exam Browser enforcement
  const {
    violations,
    violationCount,
    isFullscreen,
    showSecurityAlert,
    alertReason,
    isExamLocked,
    enterFullscreen,
    dismissAlert,
  } = useSafeExamBrowser({
    enabled: settings.strictSafeBrowser,
    maxViolations: settings.maxAllowedViolations,
    onAutoSubmit: (viols) => finalizeSubmission(viols, true),
  });

  // Attempt initial fullscreen on mount
  useEffect(() => {
    if (settings.strictSafeBrowser) {
      enterFullscreen();
    }
  }, [settings.strictSafeBrowser, enterFullscreen]);

  // Countdown Timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      finalizeSubmission(violations, false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizeSubmission(violations, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, finalizeSubmission, violations]);

  // Keyboard shortcut listener for question navigation & answer selection
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      // Don't trigger if inside input or modal
      if (showSubmitModal || showSecurityAlert || showExitConfirm) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && currentQuestion) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: key as 'A' | 'B' | 'C' | 'D',
        }));
      } else if (e.key === 'ArrowRight' && currentIndex < activeQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key.toLowerCase() === 'f' && currentQuestion) {
        setFlagged((prev) => ({
          ...prev,
          [currentQuestion.id]: !prev[currentQuestion.id],
        }));
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [currentQuestion, currentIndex, activeQuestions.length, showSubmitModal, showSecurityAlert, showExitConfirm]);

  const selectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;
  const unansweredCount = activeQuestions.length - answeredCount;

  // Format time remaining MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timeRemaining < 300; // Less than 5 mins
  const isTimeSevere = timeRemaining < 60; // Less than 1 min

  const currentCategoryInfo = SYLLABUS_SECTIONS[currentQuestion?.category || 'A'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col select-none lockdown-active">
      {/* Security Alert Modal */}
      <SecurityAlertModal
        isOpen={showSecurityAlert}
        reason={alertReason}
        violationCount={violationCount}
        maxViolations={settings.maxAllowedViolations}
        isExamLocked={isExamLocked}
        onDismiss={dismissAlert}
      />

      {/* Top Safe Exam HUD */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left: Safe Exam Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 border border-emerald-800 text-emerald-400 rounded-md text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SAFE EXAM ACTIVE</span>
          </div>

          {!isFullscreen && settings.strictSafeBrowser && (
            <button
              onClick={enterFullscreen}
              className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950 border border-indigo-700 text-indigo-300 hover:text-white rounded-md text-xs font-medium transition-colors"
            >
              <Maximize className="w-3 h-3" />
              <span>Full Screen</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Violations:</span>
            <span
              className={`font-mono font-bold tabular-nums px-1.5 py-0.5 rounded ${
                violationCount > 0 ? 'bg-red-950 text-red-400 border border-red-800' : 'text-slate-300'
              }`}
            >
              {violationCount} / {settings.maxAllowedViolations}
            </span>
          </div>
        </div>

        {/* Center: Live Timer */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-md font-mono text-sm font-bold tabular-nums border transition-colors ${
              isTimeSevere
                ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                : isTimeCritical
                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="cursor-pointer text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded transition-colors"
          >
            Exit Practice
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* Main Exam Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left/Main Column: Question Pane (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Question Metadata Header */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: currentCategoryInfo.color }}
              >
                {currentQuestion.category}
              </span>
              <div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Section {currentQuestion.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentCategoryInfo.name}</span>
                </div>
                <div className="text-sm font-medium text-slate-200">
                  {currentQuestion.topic}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                {currentQuestion.difficulty}
              </span>
              <button
                onClick={toggleFlag}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  flagged[currentQuestion.id]
                    ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? 'fill-current' : ''}`} />
                <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Reading Passage if present (especially Section B) */}
          {currentQuestion.passage && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Reading Passage Reference:</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-2 scrollbar-thin border-l-2 border-teal-500/60 pl-3 italic">
                {currentQuestion.passage}
              </div>
            </div>
          )}

          {/* Question Stem */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-2 py-0.5 rounded">
                Q{currentIndex + 1}
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-100 whitespace-pre-line leading-relaxed">
                {currentQuestion.stem}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => selectAnswer(opt.key)}
                    className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/50 ring-2 ring-indigo-500/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-sm sm:text-base leading-snug pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              Press keys A, B, C, D to select · ← → to navigate
            </span>

            {currentIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
              >
                <span>Review & Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Palette & Overview */}
        <div className="space-y-5">
          {/* Question Grid Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Question Palette
              </h3>
              <span className="text-xs font-mono text-indigo-400">
                {answeredCount} / {activeQuestions.length} Done
              </span>
            </div>

            {/* 20 Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
                const isFlag = flagged[q.id];

                let buttonClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600';
                if (isCurrent) {
                  buttonClass = 'ring-2 ring-indigo-400 bg-indigo-900/60 border-indigo-400 text-white font-bold';
                } else if (isFlag) {
                  buttonClass = 'bg-amber-950/70 border-amber-600 text-amber-300 font-medium';
                } else if (isAnswered) {
                  buttonClass = 'bg-emerald-950/70 border-emerald-700 text-emerald-300 font-medium';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`cursor-pointer h-9 rounded-lg border text-xs font-mono flex items-center justify-center relative transition-all ${buttonClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-700" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-950 border border-amber-600" />
                <span>Flagged ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded ring-2 ring-indigo-400 bg-indigo-900" />
                <span>Current Q</span>
              </div>
            </div>
          </div>

          {/* Candidate Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <span className="text-slate-500 font-medium block">Candidate Details</span>
            <div className="text-slate-200 font-semibold">{studentName}</div>
            <div className="text-slate-400">
              {studentGrade} · {school}
            </div>
          </div>

          {/* Quick Submit Card */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="cursor-pointer w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Finish & View Marks</span>
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to Submit Exam?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Once submitted, your responses will be evaluated instantly and your Olympiad mark will be displayed.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-600">Answered Questions:</span>
                  <span className="font-bold text-emerald-600 tabular-nums">
                    {answeredCount} / {activeQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Unanswered Questions:</span>
                  <span className={`font-bold tabular-nums ${unansweredCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {unansweredCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Safe Exam Violations:</span>
                  <span className="font-bold text-slate-700 tabular-nums">
                    {violationCount}
                  </span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>You still have {unansweredCount} unanswered questions.</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Continue Answering
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  finalizeSubmission(violations, false);
                }}
                className="cursor-pointer px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Yes, Submit My Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Early Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Exit Practice Test?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your current progress in this test session will be cancelled without saving marks.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  onCancelExam();
                }}
                className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
