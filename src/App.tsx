import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { ExamEngine } from './components/ExamEngine';
import { ScoreReport } from './components/ScoreReport';
import { ProgressTracker } from './components/ProgressTracker';
import { SyllabusView } from './components/SyllabusView';
import { TeacherDashboard } from './components/TeacherDashboard';
import {
  ExamSettings,
  ExamSubmission,
  Question,
  StudentProfile,
} from './types/olympiad';
import {
  getExamSettings,
  getExamSubmissions,
  getQuestionsBank,
  getStudentProfile,
  getTeacherPin,
  resetQuestionsBank,
  saveExamSettings,
  saveExamSubmission,
  saveQuestionsBank,
  saveStudentProfile,
  clearExamSubmissions,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'test' | 'progress' | 'syllabus' | 'teacher'>('test');
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(getStudentProfile());
  const [questions, setQuestions] = useState<Question[]>(getQuestionsBank());
  const [examSettings, setExamSettings] = useState<ExamSettings>(getExamSettings());
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(getExamSubmissions());
  const [teacherPin] = useState<string>(getTeacherPin());
  const [currentScorecard, setCurrentScorecard] = useState<ExamSubmission | null>(null);

  // Sync state with storage changes
  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    saveStudentProfile(newProfile);
  };

  const handleUpdateSettings = (newSettings: ExamSettings) => {
    setExamSettings(newSettings);
    saveExamSettings(newSettings);
  };

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    saveQuestionsBank(newQuestions);
  };

  const handleResetQuestions = () => {
    const defaults = resetQuestionsBank();
    setQuestions(defaults);
  };

  const handleClearSubmissions = () => {
    clearExamSubmissions();
    setSubmissions([]);
    setCurrentScorecard(null);
  };

  // Start exam flow
  const handleStartExam = () => {
    setCurrentScorecard(null);
    setIsExamRunning(true);
  };

  // Cancel exam flow
  const handleCancelExam = () => {
    setIsExamRunning(false);
  };

  // Exam submitted flow
  const handleExamComplete = (submission: ExamSubmission) => {
    saveExamSubmission(submission);
    setSubmissions((prev) => [submission, ...prev]);
    setIsExamRunning(false);
    setCurrentScorecard(submission);
    setActiveTab('test');
  };

  // Review a specific submission
  const handleReviewSubmission = (submission: ExamSubmission) => {
    setCurrentScorecard(submission);
    setActiveTab('test');
  };

  // If live exam is underway, render fullscreen lockdown ExamEngine
  if (isExamRunning) {
    return (
      <ExamEngine
        questions={questions}
        settings={examSettings}
        studentName={studentProfile.name}
        studentGrade={studentProfile.grade}
        school={studentProfile.school}
        onExamComplete={handleExamComplete}
        onCancelExam={handleCancelExam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'test') {
            setCurrentScorecard(null);
          }
        }}
        isExamRunning={isExamRunning}
        onStartExam={handleStartExam}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'test' && (
          <>
            {currentScorecard ? (
              <ScoreReport
                submission={currentScorecard}
                questions={questions}
                onRetakeExam={handleStartExam}
                onViewProgress={() => {
                  setCurrentScorecard(null);
                  setActiveTab('progress');
                }}
              />
            ) : (
              <StudentHome
                studentProfile={studentProfile}
                examSettings={examSettings}
                submissions={submissions}
                onStartExam={handleStartExam}
                onViewProgress={() => setActiveTab('progress')}
                onViewSyllabus={() => setActiveTab('syllabus')}
              />
            )}
          </>
        )}

        {activeTab === 'progress' && (
          <ProgressTracker
            submissions={submissions}
            studentProfile={studentProfile}
            onUpdateProfile={handleUpdateProfile}
            onReviewSubmission={handleReviewSubmission}
            onStartExam={handleStartExam}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusView onStartExam={handleStartExam} />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            submissions={submissions}
            questions={questions}
            settings={examSettings}
            teacherPin={teacherPin}
            onUpdateSettings={handleUpdateSettings}
            onUpdateQuestions={handleUpdateQuestions}
            onResetQuestions={handleResetQuestions}
            onClearSubmissions={handleClearSubmissions}
            onReviewSubmission={handleReviewSubmission}
          />
        )}
      </main>

      {/* Clean, quiet footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">English Olympiad Arena</span>
            <span aria-hidden="true">·</span>
            <span>Grade 7–8 Curriculum Framework</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentScorecard(null);
                setActiveTab('syllabus');
              }}
              className="cursor-pointer hover:text-slate-900 transition-colors"
            >
              Curriculum Scope
            </button>
            <button
              onClick={() => {
                setCurrentScorecard(null);
                setActiveTab('teacher');
              }}
              className="cursor-pointer hover:text-slate-900 transition-colors"
            >
              Instructor Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
