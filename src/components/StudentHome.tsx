import React from 'react';
import { ExamSettings, ExamSubmission, StudentProfile, SyllabusCategory } from '../types/olympiad';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import {
  ShieldCheck,
  Clock,
  Award,
  Play,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  BarChart2,
  Lock,
} from 'lucide-react';

interface StudentHomeProps {
  studentProfile: StudentProfile;
  examSettings: ExamSettings;
  submissions: ExamSubmission[];
  onStartExam: () => void;
  onViewProgress: () => void;
  onViewSyllabus: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  studentProfile,
  examSettings,
  submissions,
  onStartExam,
  onViewProgress,
  onViewSyllabus,
}) => {
  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const bestScore = submissions.length > 0 ? Math.max(...submissions.map((s) => s.score)) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner Split */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative gradient background in corner */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Grade 7–8 Junior High Division</span>
            <span aria-hidden="true">·</span>
            <span>National & International Standards</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Safe Exam Browser Enabled
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display text-balance">
            English Olympiad Mastery & Safe Exam Practice
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Welcome, <strong className="text-slate-900">{studentProfile.name}</strong> ({studentProfile.grade} · {studentProfile.school}).
            Train for prestigious English competitions through rigorous 20-question practice tests structured exactly across the official 4 syllabus domains.
          </p>

          {/* Key Test Parameters Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Total Questions</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                20 Items
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Exam Duration</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {examSettings.durationMinutes} Minutes
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Syllabus Scope</span>
              <span className="text-base font-bold text-indigo-600">
                4 Sections (A–D)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Lockdown Anti-Cheat</span>
              <span className="text-base font-bold text-emerald-700">
                Strict Active
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartExam}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 20-Question Safe Exam</span>
            </button>

            <button
              onClick={onViewSyllabus}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Curriculum Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safe Exam Browser Security Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                Safe Exam Browser Integrity Protocols
              </h3>
              <p className="text-xs text-slate-400">
                Simulated lockdown environment to guarantee fair, tamper-resistant examination conditions.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-1 rounded">
            Security Status: Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block font-medium">1. Fullscreen Lockdown</strong>
            <p className="text-slate-400 leading-relaxed">
              Exiting fullscreen triggers an immediate integrity warning. Maximum {examSettings.maxAllowedViolations} warnings before auto-lock.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block font-medium">2. Zero Tab Switching</strong>
            <p className="text-slate-400 leading-relaxed">
              Navigating to other tabs, search engines, or external windows is logged instantly in the student scorecard.
            </p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block font-medium">3. Copy & DevTools Prevention</strong>
            <p className="text-slate-400 leading-relaxed">
              Right-click context menu, clipboard copying, and inspect shortcuts (F12, Ctrl+U) are permanently intercepted.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Syllabus Modules (Directly from uploaded reference image) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Test Structure: The 4 Syllabus Pillars
            </h2>
            <p className="text-xs text-slate-500">
              The 20 practice questions are balanced proportionally with 5 questions per pillar.
            </p>
          </div>
          <button
            onClick={onViewSyllabus}
            className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(SYLLABUS_SECTIONS) as SyllabusCategory[]).map((catKey) => {
            const sec = SYLLABUS_SECTIONS[catKey];
            return (
              <div
                key={catKey}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: sec.color }}
                    >
                      {sec.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      5 Questions
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {sec.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-700">
                  {sec.indonesianTitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Performance Snapshot (if student has previous tests) */}
      {latestSubmission && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Last Test Attempt
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
                {latestSubmission.score} / 100
              </span>
              <span className="text-xs font-semibold text-slate-600">
                ({latestSubmission.award})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Completed on {new Date(latestSubmission.submittedAt).toLocaleDateString()} with{' '}
              {latestSubmission.violations.length === 0 ? 'zero security violations' : `${latestSubmission.violations.length} logged violations`}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewProgress}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>View Progress Charts</span>
            </button>
            <button
              onClick={onStartExam}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
