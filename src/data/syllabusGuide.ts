import { CategoryInfo, SyllabusCategory } from '../types/olympiad';

export const SYLLABUS_SECTIONS: Record<SyllabusCategory, CategoryInfo> = {
  A: {
    id: 'A',
    name: 'Words & Structure Knowledge',
    indonesianTitle: 'Pengetahuan Kata & Struktur',
    description:
      'Pengetahuan dasar tentang kosakata bahasa Inggris (vocabulary), bentuk kalimat (tenses), kata hubung (conjunction), tata bahasa (grammar), sinonim-antonim, dan relative clauses.',
    focusTopics: [
      'Advanced Academic Vocabulary (contextual meaning)',
      'Complex Tense Sequences (Past Perfect, Future Continuous)',
      'Subordinating & Correlative Conjunctions',
      'Grammar Agreement & Inversion',
      'Nuanced Synonyms & Antonyms',
      'Restrictive vs. Non-Restrictive Relative Clauses',
    ],
    color: '#4F46E5', // Indigo
  },
  B: {
    id: 'B',
    name: 'Reading',
    indonesianTitle: 'Pemahaman Membaca',
    description:
      'Kemampuan memahami teks bacaan dalam menentukan ide pembahasan, idiomatic phrases, sebab akibat, hingga figurative language.',
    focusTopics: [
      'Main Idea & Core Thesis Identification',
      'Contextual Idiomatic Expressions in Texts',
      'Cause and Effect Logical Links',
      'Figurative Language (Metaphors, Similes, Personification)',
      'Implicit Authorial Tone & Reader Inferences',
    ],
    color: '#0D9488', // Teal
  },
  C: {
    id: 'C',
    name: 'Spoken & Written Expression',
    indonesianTitle: 'Ekspresi Lisan & Tulisan',
    description:
      'Kemampuan memahami teks bacaan dalam bentuk percakapan singkat dalam bentuk dialog kontekstual, hingga pragmatic & tone distinction.',
    focusTopics: [
      'Contextual Academic Dialogues & Social Etiquette',
      'Pragmatic Intent & Communicative Function',
      'Tone Distinction (Sympathetic, Skeptical, Sarcastic, Encouraging)',
      'Diplomatic Disagreement & Polite Refusals',
      'Register Modulation (Formal Academic vs. Informal Peer)',
    ],
    color: '#D97706', // Amber
  },
  D: {
    id: 'D',
    name: 'Higher-Order Thinking Skills (HOTS)',
    indonesianTitle: 'Keterampilan Berpikir Tingkat Tinggi',
    description:
      'Kemampuan menganalisis bacaan secara logis dalam bentuk kalimat terurai (sentence unscrambling), preposisi idiomatik, hingga analisis multi-kesalahan.',
    focusTopics: [
      'Complex Sentence Unscrambling & Syntax Reordering',
      'Dependent & Idiomatic Prepositions (e.g. prone to, abstain from)',
      'Multi-Error Detection & Grammatical Inconsistency Spotting',
      'Logical Syllogisms & Textual Deductions',
      'Syntactic Parallelism & Clause Harmonization',
    ],
    color: '#9333EA', // Purple
  },
};
