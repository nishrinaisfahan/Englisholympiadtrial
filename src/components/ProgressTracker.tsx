import React, { useState } from 'react';
import { ExamSubmission, Question, StudentProfile, SyllabusCategory } from '../types/olympiad';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import {
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  User,
  School,
  GraduationCap,
} from 'lucide-react';

interface ProgressTrackerProps {
  submissions: ExamSubmission[];
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onReviewSubmission: (submission: ExamSubmission) => void;
  onStartExam: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  submissions,
  studentProfile,
  onUpdateProfile,
  onReviewSubmission,
  onStartExam,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(studentProfile.name);
  const [editGrade, setEditGrade] = useState<'Grade 7' | 'Grade 8'>(studentProfile.grade);
  const [editSchool, setEditSchool] = useState<string>(studentProfile.school);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName.trim() || 'Olympiad Candidate',
      grade: editGrade,
      school: editSchool.trim() || 'Junior High School',
    });
    setIsEditingProfile(false);
  };

  // Metrics calculations
  const totalTests = submissions.length;
  const highestScore = totalTests > 0 ? Math.max(...submissions.map((s) => s.score)) : 0;
  const averageScore =
    totalTests > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / totalTests) : 0;
  const cleanTests = submissions.filter((s) => s.violations.length === 0).length;
  const cleanRate = totalTests > 0 ? Math.round((cleanTests / totalTests) * 100) : 100;

  // Category average percentages
  const categoryStats: Record<SyllabusCategory, { sumPercent: number; count: number }> = {
    A: { sumPercent: 0, count: 0 },
    B: { sumPercent: 0, count: 0 },
    C: { sumPercent: 0, count: 0 },
    D: { sumPercent: 0, count: 0 },
  };

  submissions.forEach((sub) => {
    (Object.keys(categoryStats) as SyllabusCategory[]).forEach((cat) => {
      if (sub.categoryScores && sub.categoryScores[cat]) {
        categoryStats[cat].sumPercent += sub.categoryScores[cat].percentage;
        categoryStats[cat].count += 1;
      }
    });
  });

  const categoryAverages: Record<SyllabusCategory, number> = {
    A: categoryStats.A.count ? Math.round(categoryStats.A.sumPercent / categoryStats.A.count) : 0,
    B: categoryStats.B.count ? Math.round(categoryStats.B.sumPercent / categoryStats.B.count) : 0,
    C: categoryStats.C.count ? Math.round(categoryStats.C.sumPercent / categoryStats.C.count) : 0,
    D: categoryStats.D.count ? Math.round(categoryStats.D.sumPercent / categoryStats.D.count) : 0,
  };

  // Identify highest and lowest mastery
  const sortedCategories = (Object.keys(categoryAverages) as SyllabusCategory[]).sort(
    (a, b) => categoryAverages[b] - categoryAverages[a]
  );
  const strongestCategory = sortedCategories[0];
  const weakestCategory = sortedCategories[sortedCategories.length - 1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header & Candidate Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
              <span>Candidate Analytics</span>
              <span aria-hidden="true">·</span>
              <span>English Olympiad Readiness</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Student Progress Tracker
            </h1>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 self-start sm:self-auto"
          >
            {isEditingProfile ? 'Cancel Edit' : 'Edit Candidate Details'}
          </button>
        </div>

        {/* Profile info or Edit Form */}
        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Update Student Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Grade Level</label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value as 'Grade 7' | 'Grade 8')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Grade 7">Grade 7 (SMP Kelas 7)</option>
                  <option value="Grade 8">Grade 8 (SMP Kelas 8)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">School Name</label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="cursor-pointer px-3.5 py-1.5 text-xs text-slate-600 font-medium hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Save Details
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Candidate Name</span>
                <span className="text-sm font-bold text-slate-800">{studentProfile.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Division</span>
                <span className="text-sm font-bold text-slate-800">{studentProfile.grade}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">School / Institution</span>
                <span className="text-sm font-bold text-slate-800">{studentProfile.school}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Practice Tests Completed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums mt-1">
              {totalTests}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">20 questions each</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Highest Scaled Mark</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-display tabular-nums mt-1">
              {highestScore}
              <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Best performance</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Average Test Mark</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums mt-1">
              {averageScore}
              <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Across all sessions</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Safe Exam Compliance</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display tabular-nums mt-1">
              {cleanRate}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Zero violation audits</span>
          </div>
        </div>
      </div>

      {/* Category Mastery Radar/Bar Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Syllabus Mastery Diagnostics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Average accuracy broken down by the 4 official Olympiad syllabus domains from the curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(Object.keys(SYLLABUS_SECTIONS) as SyllabusCategory[]).map((cat) => {
            const info = SYLLABUS_SECTIONS[cat];
            const avg = categoryAverages[cat];

            return (
              <div key={cat} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                      style={{ backgroundColor: info.color }}
                    >
                      {cat}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{info.name}</h4>
                      <span className="text-xs text-slate-500">{info.indonesianTitle}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-800 tabular-nums">
                    {avg}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${avg}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Tested Topics: {info.focusTopics.length} areas</span>
                  <span className="font-medium text-slate-700">
                    {avg >= 80 ? 'Mastered' : avg >= 60 ? 'Competent' : 'Needs Reinforcement'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Insight Callout */}
        <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <span className="font-bold block">Personalized Olympiad Recommendation:</span>
            <p>
              Your strongest domain is{' '}
              <strong>Section {strongestCategory} ({SYLLABUS_SECTIONS[strongestCategory].name})</strong> with an average of{' '}
              {categoryAverages[strongestCategory]}%. To qualify for Gold in national competitions, dedicate focused
              study to{' '}
              <strong>Section {weakestCategory} ({SYLLABUS_SECTIONS[weakestCategory].name})</strong> ({categoryAverages[weakestCategory]}%),
              specifically drilling complex sentence unscrambling and idiomatic prepositions.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Attempts Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Historical Test Attempts
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of previous practice tests taken under Safe Exam Browser monitoring.
            </p>
          </div>

          <button
            onClick={onStartExam}
            className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Take New Practice Test
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No practice test attempts recorded yet. Click "Take New Practice Test" to begin!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Scaled Score</th>
                  <th className="py-3 px-4">Award Tier</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Safe Exam Audit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const durationMin = Math.floor(sub.durationSeconds / 60);
                  const durationSec = sub.durationSeconds % 60;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        {sub.studentName}
                        <span className="text-[11px] text-slate-400 block font-normal">
                          {sub.studentGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="text-base text-indigo-700">{sub.score}</span> / 100
                        <span className="text-[11px] text-slate-500 font-normal ml-1">
                          ({sub.correctCount}/20)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">
                          {sub.award}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {durationMin}m {durationSec}s
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {sub.violations.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Clean (0)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {sub.violations.length} Violation(s)
                          </span>
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
