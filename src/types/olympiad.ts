/**
 * Types for English Olympiad Training Platform (Grade 7-8)
 * Aligned with the official Olympiad syllabus (Sections A, B, C, D)
 */

export type SyllabusCategory = 'A' | 'B' | 'C' | 'D';

export interface CategoryInfo {
  id: SyllabusCategory;
  name: string;
  indonesianTitle: string;
  description: string;
  focusTopics: string[];
  color: string;
}

export interface Question {
  id: number;
  category: SyllabusCategory;
  topic: string;
  stem: string;
  passage?: string; // Optional reading passage
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Medium' | 'Challenging' | 'Olympiad Master';
}

export interface StudentProfile {
  name: string;
  grade: 'Grade 7' | 'Grade 8';
  school: string;
}

export interface ViolationRecord {
  timestamp: number;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'shortcut_attempt';
  details: string;
}

export interface ExamSettings {
  durationMinutes: number;
  strictSafeBrowser: boolean;
  maxAllowedViolations: number;
  shuffleQuestions: boolean;
  passingScore: number;
}

export interface StudentAnswer {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isFlagged?: boolean;
}

export interface ExamSubmission {
  id: string;
  studentName: string;
  studentGrade: string;
  school: string;
  submittedAt: number;
  durationSeconds: number;
  score: number; // 0 - 100
  correctCount: number;
  totalQuestions: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  categoryScores: Record<SyllabusCategory, { correct: number; total: number; percentage: number }>;
  violations: ViolationRecord[];
  isLockedDueToViolations?: boolean;
  award: 'Gold Honor' | 'Silver Honor' | 'Bronze Honor' | 'Honorable Mention' | 'Developing';
}
