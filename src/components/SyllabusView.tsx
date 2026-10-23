import React, { useState } from 'react';
import { SYLLABUS_SECTIONS } from '../data/syllabusGuide';
import { SyllabusCategory } from '../types/olympiad';
import { BookOpen, CheckCircle2, Lightbulb, FileText, ArrowRight } from 'lucide-react';

interface SyllabusViewProps {
  onStartExam: () => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ onStartExam }) => {
  const [selectedSection, setSelectedSection] = useState<SyllabusCategory>('A');

  const activeData = SYLLABUS_SECTIONS[selectedSection];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
          <span>Official Syllabus Reference</span>
          <span aria-hidden="true">·</span>
          <span>Grade 7–8 Junior High Division</span>
          <span aria-hidden="true">·</span>
          <span>20 Evaluation Questions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
          Kisi-kisi Materi English Olympiad
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Standardized curriculum guidelines for junior high English competitions.
          Mastering these 4 core modules ensures rigorous preparation for national and international Olympiad tests.
        </p>
      </div>

      {/* 4 Interactive Category Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(SYLLABUS_SECTIONS) as SyllabusCategory[]).map((catKey) => {
          const item = SYLLABUS_SECTIONS[catKey];
          const isSelected = selectedSection === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setSelectedSection(catKey)}
              className={`cursor-pointer p-5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.id}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  5 Questions
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {item.indonesianTitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Category Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl shrink-0"
              style={{ backgroundColor: activeData.color }}
            >
              {activeData.id}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Section {activeData.id}</span>
                <span aria-hidden="true">·</span>
                <span>{activeData.indonesianTitle}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeData.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onStartExam}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            <span>Practice This Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Indonesian Syllabus description (Direct from uploaded reference picture) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Deskripsi Kisi-kisi Resmi:</span>
          </div>
          <p className="text-sm text-slate-700 italic leading-relaxed">
            "{activeData.description}"
          </p>
        </div>

        {/* Detailed Focus Areas */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Competencies Tested in Grade 7–8 Olympiad:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeData.focusTopics.map((topic, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs text-slate-700"
              >
                <span className="font-mono text-slate-400 font-medium">0{i + 1}.</span>
                <span className="font-medium text-slate-800">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Olympiad High-Score Strategy Tip */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Olympiad Strategy Tip:</span>
            {selectedSection === 'A' &&
              'Watch out for subtle subject-auxiliary inversions ("Not only did he...") and distinguish restrictive relative clauses (no commas) from non-restrictive clauses (set off with commas).'}
            {selectedSection === 'B' &&
              'Always confirm whether the question asks for a direct stated fact or an inference. Pay attention to how idiomatic phrases shift meaning from literal interpretations.'}
            {selectedSection === 'C' &&
              'Consider the social distance and hierarchy between speakers. Olympiad questions frequently test pragmatic hedging, polite disagreement, and discerning facetious/sarcastic subtext.'}
            {selectedSection === 'D' &&
              'In sentence unscrambling, locate the main independent clause first before attaching subordinate and participial modifiers. Always check noun-pronoun agreement in complex relative pronouns (whoever vs. whomever).'}
          </div>
        </div>
      </div>

      {/* Image Reference Card */}
      <div className="p-6 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold font-display">
            20-Question Standardized Olympiad Exam
          </h3>
          <p className="text-xs text-slate-400">
            Each practice test contains 5 balanced questions from Sections A, B, C, and D with Safe Exam Browser anti-cheat protection.
          </p>
        </div>
        <button
          onClick={onStartExam}
          className="cursor-pointer px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Launch 20-Question Exam Now
        </button>
      </div>
    </div>
  );
};
