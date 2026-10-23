import { ExamSettings, ExamSubmission, Question, StudentProfile } from '../types/olympiad';
import { DEFAULT_QUESTIONS } from '../data/olympiadQuestions';

const PROFILE_KEY = 'olympiad_student_profile';
const QUESTIONS_KEY = 'olympiad_questions_bank';
const SUBMISSIONS_KEY = 'olympiad_submissions_history';
const SETTINGS_KEY = 'olympiad_exam_settings';
const TEACHER_PIN_KEY = 'olympiad_teacher_pin';

export const DEFAULT_EXAM_SETTINGS: ExamSettings = {
  durationMinutes: 30,
  strictSafeBrowser: true,
  maxAllowedViolations: 3,
  shuffleQuestions: false,
  passingScore: 70,
};

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Alya Ramadhani',
  grade: 'Grade 8',
  school: 'SMP Ar-Rohmah International',
};

// Seed sample test attempts for initial progress tracking visualization
const SEED_SUBMISSIONS: ExamSubmission[] = [
  {
    id: 'sub_seed_01',
    studentName: 'Alya Ramadhani',
    studentGrade: 'Grade 8',
    school: 'SMP Ar-Rohmah International',
    submittedAt: Date.now() - 6 * 24 * 3600 * 1000,
    durationSeconds: 1540,
    score: 65,
    correctCount: 13,
    totalQuestions: 20,
    answers: {
      1: 'A', 2: 'B', 3: 'A', 4: 'C', 5: 'A',
      6: 'A', 7: 'A', 8: 'B', 9: 'A', 10: 'A',
      11: 'A', 12: 'A', 13: 'B', 14: 'A', 15: 'A',
      16: 'A', 17: 'A', 18: 'B', 19: 'A', 20: 'B'
    },
    categoryScores: {
      A: { correct: 3, total: 5, percentage: 60 },
      B: { correct: 4, total: 5, percentage: 80 },
      C: { correct: 4, total: 5, percentage: 80 },
      D: { correct: 2, total: 5, percentage: 40 },
    },
    violations: [
      { timestamp: Date.now() - 6 * 24 * 3600 * 1000 + 400000, type: 'tab_switch', details: 'Navigated away from exam tab.' }
    ],
    award: 'Honorable Mention',
  },
  {
    id: 'sub_seed_02',
    studentName: 'Alya Ramadhani',
    studentGrade: 'Grade 8',
    school: 'SMP Ar-Rohmah International',
    submittedAt: Date.now() - 2 * 24 * 3600 * 1000,
    durationSeconds: 1380,
    score: 85,
    correctCount: 17,
    totalQuestions: 20,
    answers: {
      1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A',
      6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A',
      11: 'A', 12: 'A', 13: 'A', 14: 'A', 15: 'A',
      16: 'B', 17: 'A', 18: 'C', 19: 'A', 20: 'A'
    },
    categoryScores: {
      A: { correct: 5, total: 5, percentage: 100 },
      B: { correct: 5, total: 5, percentage: 100 },
      C: { correct: 5, total: 5, percentage: 100 },
      D: { correct: 2, total: 5, percentage: 40 },
    },
    violations: [],
    award: 'Silver Honor',
  },
  {
    id: 'sub_seed_03',
    studentName: 'Rafi Pratama',
    studentGrade: 'Grade 7',
    school: 'SMP Ar-Rohmah International',
    submittedAt: Date.now() - 1 * 24 * 3600 * 1000,
    durationSeconds: 1650,
    score: 75,
    correctCount: 15,
    totalQuestions: 20,
    answers: {},
    categoryScores: {
      A: { correct: 4, total: 5, percentage: 80 },
      B: { correct: 4, total: 5, percentage: 80 },
      C: { correct: 4, total: 5, percentage: 80 },
      D: { correct: 3, total: 5, percentage: 60 },
    },
    violations: [],
    award: 'Bronze Honor',
  },
];

export const getStudentProfile = (): StudentProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_STUDENT_PROFILE;
  } catch {
    return DEFAULT_STUDENT_PROFILE;
  }
};

export const saveStudentProfile = (profile: StudentProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getQuestionsBank = (): Question[] => {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(DEFAULT_QUESTIONS));
      return DEFAULT_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUESTIONS;
  }
};

export const saveQuestionsBank = (questions: Question[]): void => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const resetQuestionsBank = (): Question[] => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
};

export const getExamSubmissions = (): ExamSubmission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
      return SEED_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_SUBMISSIONS;
  }
};

export const saveExamSubmission = (submission: ExamSubmission): void => {
  const existing = getExamSubmissions();
  const updated = [submission, ...existing];
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
};

export const clearExamSubmissions = (): void => {
  localStorage.removeItem(SUBMISSIONS_KEY);
};

export const getExamSettings = (): ExamSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_EXAM_SETTINGS, ...JSON.parse(raw) } : DEFAULT_EXAM_SETTINGS;
  } catch {
    return DEFAULT_EXAM_SETTINGS;
  }
};

export const saveExamSettings = (settings: ExamSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getTeacherPin = (): string => {
  return localStorage.getItem(TEACHER_PIN_KEY) || '1234';
};

export const saveTeacherPin = (pin: string): void => {
  localStorage.setItem(TEACHER_PIN_KEY, pin);
};
