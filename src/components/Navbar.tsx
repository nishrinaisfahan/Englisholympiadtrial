import React from 'react';
import { ShieldAlert, BookOpen, BarChart3, GraduationCap, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: 'test' | 'progress' | 'syllabus' | 'teacher';
  setActiveTab: (tab: 'test' | 'progress' | 'syllabus' | 'teacher') => void;
  isExamRunning: boolean;
  onStartExam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isExamRunning,
  onStartExam,
}) => {
  // If exam is currently running in strict lockdown mode, we minimize nav to keep students focused
  if (isExamRunning) {
    return (
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold tracking-tight text-white font-display">
              English Olympiad Arena
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              SAFE EXAM LOCKDOWN ACTIVE
            </span>
          </div>
          <div className="text-xs text-slate-300">
            Grade 7–8 Olympiad Evaluation
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('test')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          English Olympiad Arena
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('test')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Practice Tests
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Progress Tracking
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Syllabus Blueprint
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'teacher'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Teacher Mode
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartExam}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Safe Exam
          </button>
        </div>
      </div>
    </header>
  );
};
