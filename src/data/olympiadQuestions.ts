import { Question } from '../types/olympiad';

export const PASSAGE_1 = `Underneath the damp moss and fallen leaves of an ancient forest lies a vast, microscopic subterranean highway. Known as the mycorrhizal network—often colloquially dubbed the "Wood Wide Web"—this intricate labyrinth of fungal filaments links individual trees across kilometers of terrain. Through these fungal threads, older and deeply rooted "mother trees" do not merely survive in competition with their offspring; rather, they nourish neighboring saplings by channeling surplus sugars, nitrogen, and phosphorus. When an aggressive insect infestation attacks a pine tree, it discharges rapid biochemical distress signals through the fungal network, alerting nearby trees to synthesize defensive resins before the pests arrive. What biologists once dismissed as a simple root byproduct has proven to be an astonishing subterranean collective, proving that competition is only the tip of the iceberg in the true life of forests.`;

export const PASSAGE_2 = `In the oceanic twilight zone—between two hundred and one thousand meters beneath the sunlit surface—darkness is not an empty void, but a canvas illuminated by living light. Here, firefly squids and lanternfishes wield bioluminescence not merely as a decorative flare, but as an indispensable survival mechanism. Counterillumination allows these cephalopods to emit a gentle blue glow from photophores lining their bellies, matching the exact spectral intensity of downwelling celestial light. To an apex predator swimming below, the squid's silhouette vanishes into the shimmering surface sheen like a ghost in the fog. While surface dwellers rely on sunlight to shape their senses, these deep-sea creatures forge their own daylight, turning an abyss of peril into an orchestrated sanctuary of survival.`;

export const DEFAULT_QUESTIONS: Question[] = [
  // SECTION A: Words & Structure Knowledge (Q1 - Q5)
  {
    id: 1,
    category: 'A',
    topic: 'Vocabulary in Context (Academic Nuance)',
    stem: 'Select the word that best completes the sentence with the intended academic nuance:\n"Despite facing relentless administrative hurdles, the young scientist remained __________ in her pursuit of the vaccine formula, refusing to let repeated trial failures derail her research."',
    options: [
      { key: 'A', text: 'tenacious' },
      { key: 'B', text: 'complacent' },
      { key: 'C', text: 'ambivalent' },
      { key: 'D', text: 'ephemeral' },
    ],
    correctAnswer: 'A',
    explanation:
      '"Tenacious" means persistent, determined, and holding firmly to a purpose despite difficulties. "Complacent" means smugly unconcerned, "ambivalent" means having mixed or contradictory feelings, and "ephemeral" means lasting for a very short time.',
    difficulty: 'Medium',
  },
  {
    id: 2,
    category: 'A',
    topic: 'Complex Tense Sequences (Past Perfect & Temporal Clauses)',
    stem: 'Choose the grammatically correct sequence of verb tenses to fill the blanks:\n"By the time the symposium jury __________ their final deliberative session, the delegates __________ in the auditorium for nearly four hours."',
    options: [
      { key: 'A', text: 'concluded / had been waiting' },
      { key: 'B', text: 'had concluded / were waiting' },
      { key: 'C', text: 'was concluding / waited' },
      { key: 'D', text: 'concludes / have been waiting' },
    ],
    correctAnswer: 'A',
    explanation:
      'The time expression "By the time" introduces a past reference point ("concluded", simple past). The action that began earlier and was still ongoing up to that past point requires the Past Perfect Continuous ("had been waiting").',
    difficulty: 'Challenging',
  },
  {
    id: 3,
    category: 'A',
    topic: 'Correlative Conjunctions & Inversion',
    stem: 'Identify the sentence that correctly employs correlative conjunctions and negative inversion:',
    options: [
      { key: 'A', text: 'Not only did the debate captain articulate his rebuttal clearly, but he also anticipated every counterargument.' },
      { key: 'B', text: 'Not only the debate captain articulated his rebuttal clearly, but also he anticipated every counterargument.' },
      { key: 'C', text: 'Not only did the debate captain articulate his rebuttal clearly, but also anticipated every counterargument he.' },
      { key: 'D', text: 'Not only the debate captain did articulate his rebuttal clearly, but he also anticipated every counterargument.' },
    ],
    correctAnswer: 'A',
    explanation:
      'When "Not only" initiates a sentence, subject-auxiliary inversion is mandatory in the first clause ("did the debate captain articulate"). The second coordinate clause retains standard subject-verb order with "but he also anticipated".',
    difficulty: 'Olympiad Master',
  },
  {
    id: 4,
    category: 'A',
    topic: 'Relative Clauses (Restrictive vs. Non-Restrictive)',
    stem: 'Which sentence correctly applies punctuation and pronoun agreement in a non-defining relative clause?',
    options: [
      { key: 'A', text: 'Professor Aris Thorne, whose groundbreaking monograph on endangered mangrove ecosystems won the UNESCO medal, will deliver the keynote address.' },
      { key: 'B', text: 'Professor Aris Thorne that groundbreaking monograph on endangered mangrove ecosystems won the UNESCO medal will deliver the keynote address.' },
      { key: 'C', text: 'Professor Aris Thorne which groundbreaking monograph on endangered mangrove ecosystems won the UNESCO medal, will deliver the keynote address.' },
      { key: 'D', text: 'Professor Aris Thorne, whom groundbreaking monograph on endangered mangrove ecosystems won the UNESCO medal will deliver the keynote address.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Non-defining relative clauses must be set off by commas and refer back to a proper noun. The possessive relative pronoun "whose" is required to modify "groundbreaking monograph". "That" cannot be used in non-defining clauses, and "whom" is objective, not possessive.',
    difficulty: 'Medium',
  },
  {
    id: 5,
    category: 'A',
    topic: 'Synonyms & Antonyms (Academic Pairs)',
    stem: 'In the sentence "The community demonstrated extraordinary fortitude in the aftermath of the torrential flooding," what is the most precise ANTONYM for "fortitude"?',
    options: [
      { key: 'A', text: 'pusillanimity' },
      { key: 'B', text: 'solidarity' },
      { key: 'C', text: 'tenacity' },
      { key: 'D', text: 'altruism' },
    ],
    correctAnswer: 'A',
    explanation:
      '"Fortitude" means courage in pain or adversity. Its exact formal antonym is "pusillanimity" (timidity, lack of courage or cowardice). "Solidarity" is unity, "tenacity" is perseverance (a synonym), and "altruism" is selfless concern for others.',
    difficulty: 'Olympiad Master',
  },

  // SECTION B: Reading Comprehension (Q6 - Q10)
  {
    id: 6,
    category: 'B',
    topic: 'Main Idea & Core Thesis',
    passage: PASSAGE_1,
    stem: 'What is the primary thesis of the passage regarding the mycorrhizal network in forest ecosystems?',
    options: [
      { key: 'A', text: 'Forest ecosystems are fundamentally collaborative networks rather than purely cutthroat competitive arenas.' },
      { key: 'B', text: 'Fungal parasites ultimately deplete tree vitality by siphoning off vital nitrogen and phosphorus reserves.' },
      { key: 'C', text: 'Mother trees prioritize their own genetic offspring to ensure that non-related tree species perish.' },
      { key: 'D', text: 'Subterranean fungi prevent insects from ever initiating infestations on pine needle canopies.' },
    ],
    correctAnswer: 'A',
    explanation:
      'The passage emphasizes how the fungal network links trees, channels vital nutrients from mother trees to saplings, and spreads warning signals. The concluding sentence confirms that "competition is only the tip of the iceberg," illustrating a cooperative ecological community.',
    difficulty: 'Medium',
  },
  {
    id: 7,
    category: 'B',
    topic: 'Idiomatic Phrases in Context',
    passage: PASSAGE_1,
    stem: 'In the final sentence of Passage 1, what does the idiom "only the tip of the iceberg" imply about competition among trees?',
    options: [
      { key: 'A', text: 'Competition is merely a minor, visible fraction of a far larger, multifaceted ecological dynamic.' },
      { key: 'B', text: 'Competition takes place primarily in sub-zero alpine and arctic forest environments.' },
      { key: 'C', text: 'Competition will gradually cause all terrestrial tree root systems to freeze and deteriorate.' },
      { key: 'D', text: 'Competition is completely non-existent and invented by early marine biologists.' },
    ],
    correctAnswer: 'A',
    explanation:
      'The idiom "tip of the iceberg" denotes a small, noticeable part of a problem or situation, the total size of which is much greater and largely hidden. Here, visible competition is just a fraction of the deep, cooperative underground mechanisms.',
    difficulty: 'Medium',
  },
  {
    id: 8,
    category: 'B',
    topic: 'Cause and Effect Analysis',
    passage: PASSAGE_1,
    stem: 'According to Passage 1, how do unattacked pine trees benefit when a neighboring pine experiences an insect infestation?',
    options: [
      { key: 'A', text: 'They receive biochemical distress messages through fungal filaments, enabling proactive synthesis of protective resin.' },
      { key: 'B', text: 'They absorb the dead bark of the infested tree as compost through their top canopy needles.' },
      { key: 'C', text: 'They instantly cease photosynthesizing to starve airborne insects of canopy nectar.' },
      { key: 'D', text: 'They disconnect their root systems from the network to avoid fungal contagion.' },
    ],
    correctAnswer: 'A',
    explanation:
      'The passage explicitly states: "When an aggressive insect infestation attacks a pine tree, it discharges rapid biochemical distress signals through the fungal network, alerting nearby trees to synthesize defensive resins before the pests arrive."',
    difficulty: 'Challenging',
  },
  {
    id: 9,
    category: 'B',
    topic: 'Figurative Language Identification',
    passage: PASSAGE_2,
    stem: 'Consider the sentence: "To an apex predator swimming below, the squid\'s silhouette vanishes into the shimmering surface sheen like a ghost in the fog." Which figurative device is primarily demonstrated?',
    options: [
      { key: 'A', text: 'Simile' },
      { key: 'B', text: 'Oxymoron' },
      { key: 'C', text: 'Hyperbole' },
      { key: 'D', text: 'Synecdoche' },
    ],
    correctAnswer: 'A',
    explanation:
      'The phrase compares the squid\'s disappearance to "a ghost in the fog" using the explicit comparative word "like", which defines a simile. An oxymoron pairs contradictory words, hyperbole is intentional extreme exaggeration, and synecdoche uses a part to represent the whole.',
    difficulty: 'Medium',
  },
  {
    id: 10,
    category: 'B',
    topic: 'Authorial Tone & Inference',
    passage: PASSAGE_2,
    stem: 'What is the author\'s tone toward deep-sea organisms and their adaptations in Passage 2?',
    options: [
      { key: 'A', text: 'Awestruck and admiring of evolutionary ingenuity' },
      { key: 'B', text: 'Cynical and skeptical of marine research credibility' },
      { key: 'C', text: 'Alarmist regarding the perils of deep sea acidification' },
      { key: 'D', text: 'Indifferent and strictly dismissive of biological marvels' },
    ],
    correctAnswer: 'A',
    explanation:
      'The author\'s vocabulary ("canvas illuminated by living light", "indispensable survival mechanism", "orchestrated sanctuary of survival") displays profound admiration and wonder at the sophisticated adaptations of deep-sea creatures.',
    difficulty: 'Challenging',
  },

  // SECTION C: Spoken & Written Expression (Q11 - Q15)
  {
    id: 11,
    category: 'C',
    topic: 'Pragmatic Dialogue & Diplomatic Communication',
    stem: 'Read the dialogue below:\nElena: "We have only twenty-four hours left before the science fair submission portal closes, and our data tables are still missing statistical variance calculations!"\nLiam: "____________________________________."\n\nWhich response demonstrates the most constructive pragmatic stance for collaborative problem-solving?',
    options: [
      { key: 'A', text: '"Panicking won\'t generate the figures; let\'s divide the remaining datasets so you compute the mean while I run the standard deviations."' },
      { key: 'B', text: '"It was your responsibility from day one, so you should stay up all night to resolve it."' },
      { key: 'C', text: '"Let\'s just submit the raw numbers without calculations; nobody on the jury ever reads standard deviations anyway."' },
      { key: 'D', text: '"I guess our chances of placing in the Olympiad are officially ruined, so why bother trying?"' },
    ],
    correctAnswer: 'A',
    explanation:
      'Pragmatic competence in English Olympiad assesses effective, solution-oriented collaborative discourse. Option A validates the urgency, de-escalates panic, and proposes an actionable division of labor.',
    difficulty: 'Medium',
  },
  {
    id: 12,
    category: 'C',
    topic: 'Tone Distinction (Sarcasm vs. Skepticism vs. Empathy)',
    stem: 'Read the response below:\nJulian: "I skimmed the two-hundred-page economics anthology during my fifteen-minute bus ride, and I am certain I will score full marks on tomorrow\'s Olympiad paper."\nDr. Maya: "Oh, absolutely. And I suppose you also memorized the index of historical trade tariffs between bus stops?"\n\nWhat tone is Dr. Maya employing?',
    options: [
      { key: 'A', text: 'Facetious and mildly sarcastic' },
      { key: 'B', text: 'Genuinely impressed and encouraging' },
      { key: 'C', text: 'Solemn and apologetic' },
      { key: 'D', text: 'Indifferent and detached' },
    ],
    correctAnswer: 'A',
    explanation:
      'Dr. Maya makes an absurd rhetorical exaggeration ("memorized the index of trade tariffs between bus stops") to mock Julian\'s unrealistic boast, which is the hallmark of a facetious, sarcastic tone.',
    difficulty: 'Medium',
  },
  {
    id: 13,
    category: 'C',
    topic: 'Register & Sociolinguistic Adjustment',
    stem: 'A Grade 8 student is writing an official email requesting mentorship from a university professor for an upcoming Olympiad research paper. Which salutation and opening sentence maintains the most appropriate formal academic register?',
    options: [
      { key: 'A', text: 'Dear Professor Harrington, I hope this email finds you well. I am writing to respectfully inquire whether you might have thirty minutes this semester to offer guidance on my youth Olympiad biology project.' },
      { key: 'B', text: 'Hey Harrington! Hope things are chill on campus. I need a hand with my biology project, so ping me when you\'re free.' },
      { key: 'C', text: 'To whomsoever reads this message, I command your prompt intervention in reviewing my scientific research without unnecessary delay.' },
      { key: 'D', text: 'Dear sir/madam Harrington, yo I am writing because my teacher said you know a bunch about trees and stuff.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Option A adheres to formal sociolinguistic norms: appropriate honorific ("Professor Harrington"), courteous opening, deferential phrasing ("respectfully inquire"), and concise communicative purpose.',
    difficulty: 'Medium',
  },
  {
    id: 14,
    category: 'C',
    topic: 'Indirect Speech Acts & Polite Hesitation',
    stem: 'During an Olympiad mock debate, speaker Tara wishes to challenge her teammate\'s assertion without causing friction. Which phrase best embodies polite diplomatic disagreement?',
    options: [
      { key: 'A', text: 'While I see the merits of your proposal regarding urban zoning, might we also consider the potential displacement of low-income tenants?' },
      { key: 'B', text: 'Your premise on urban zoning makes zero sense and contradicts basic municipal geography.' },
      { key: 'C', text: 'I will pretend I didn\'t hear your suggestion, because everyone knows that zoning laws are irrelevant.' },
      { key: 'D', text: 'You are completely wrong, so allow me to replace your entire slide deck with facts.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Option A uses hedging ("While I see the merits...", "might we also consider...") which softens the counter-position and invites collective reflection while maintaining collegiality.',
    difficulty: 'Challenging',
  },
  {
    id: 15,
    category: 'C',
    topic: 'Conversational Implicature & Contextual Inference',
    stem: 'Read the exchange:\nTeacher: "Are you ready to deliver your five-minute impromptu presentation on renewable geothermal technology?"\nKenji: "Well, I spent the last three nights reading Wikipedia articles and drinking cold espresso."\n\nWhat does Kenji\'s reply IMPLY?',
    options: [
      { key: 'A', text: 'He has worked frantically to prepare under intense pressure, but may feel sleep-deprived and uncertain.' },
      { key: 'B', text: 'He has completed an official master\'s degree in geothermal energy engineering.' },
      { key: 'C', text: 'He refuses to give the presentation because he dislikes espresso drinks.' },
      { key: 'D', text: 'He believes geothermal technology is an entirely fictional concept.' },
    ],
    correctAnswer: 'A',
    explanation:
      'Gricean conversational implicature: Kenji does not give a simple "yes" or "no", but his mention of three sleepless nights of emergency reading implies exhausting, last-minute preparation and nervous fatigue.',
    difficulty: 'Challenging',
  },

  // SECTION D: Higher-Order Thinking Skills (HOTS) (Q16 - Q20)
  {
    id: 16,
    category: 'D',
    topic: 'Sentence Unscrambling & Complex Syntax',
    stem: 'Rearrange the following numbered clauses into the most syntactically cohesive and grammatically coherent sentence:\n(1) although centuries of industrial deforestation had severely fractured the canopy,\n(2) the resilient biodiversity of the lowland reserve\n(3) thanks to localized reforestation corridors initiated by village elders\n(4) staged an extraordinary revival\n(5) that astonished international conservationists',
    options: [
      { key: 'A', text: '(1) - (2) - (4) - (5) - (3)' },
      { key: 'B', text: '(1) - (3) - (2) - (4) - (5)' },
      { key: 'C', text: '(3) - (1) - (5) - (2) - (4)' },
      { key: 'D', text: '(2) - (5) - (1) - (3) - (4)' },
    ],
    correctAnswer: 'B',
    explanation:
      'The optimal sequence is: "(1) Although centuries of industrial deforestation had severely fractured the canopy, (3) thanks to localized reforestation corridors initiated by village elders, (2) the resilient biodiversity of the lowland reserve (4) staged an extraordinary revival (5) that astonished international conservationists." This places the concession clause first, followed by the causal modifier, followed smoothly by subject-verb-relative clause.',
    difficulty: 'Olympiad Master',
  },
  {
    id: 17,
    category: 'D',
    topic: 'Idiomatic & Dependent Prepositions',
    stem: 'Select the preposition pair that accurately completes both idiomatic collocations:\n"The archaeological council was reluctant to acquiesce __________ the developer\'s request, as the ancient excavation site was exceptionally vulnerable __________ irreparable structural damage."',
    options: [
      { key: 'A', text: 'to / to' },
      { key: 'B', text: 'in / with' },
      { key: 'C', text: 'with / against' },
      { key: 'D', text: 'for / toward' },
    ],
    correctAnswer: 'A',
    explanation:
      'The verb "acquiesce" takes the dependent preposition "to" (or less frequently "in", but never with "vulnerable"). The adjective "vulnerable" obligatorily governs the preposition "to" ("vulnerable to damage"). Thus, "to / to" is the correct pair.',
    difficulty: 'Challenging',
  },
  {
    id: 18,
    category: 'D',
    topic: 'Multi-Error Identification & Analysis',
    stem: 'Analyze the sentence below and identify which numbered parts contain grammatical or syntactic errors:\n"The council of student delegates [1] have voted unanimously [2] to reject the proposed amendment, which [3] they believed infringes on the rights of [4] whomever is enrolled in the extracurricular honors program."',
    options: [
      { key: 'A', text: '[1] and [4]' },
      { key: 'B', text: '[2] and [3]' },
      { key: 'C', text: '[1] and [3]' },
      { key: 'D', text: '[3] and [4]' },
    ],
    correctAnswer: 'A',
    explanation:
      'Error in [1]: "The council" is a singular collective noun functioning as a single unit, requiring the singular verb "has voted" (not "have voted"). Error in [4]: The pronoun functions as the subject of the predicate clause "is enrolled", requiring the subjective case "whoever", not the objective "whomever". Thus, parts [1] and [4] are erroneous.',
    difficulty: 'Olympiad Master',
  },
  {
    id: 19,
    category: 'D',
    topic: 'Logical Syllogism & Textual Deduction',
    stem: 'Read the premises below:\nPremise 1: All participants who qualify for the National Linguistics Olympiad have mastered grammatical syntactic parsing.\nPremise 2: Some students who have mastered grammatical syntactic parsing cannot speak fluent German.\nPremise 3: Farah qualified for the National Linguistics Olympiad.\n\nWhich statement MUST logically follow with absolute certainty?',
    options: [
      { key: 'A', text: 'Farah has mastered grammatical syntactic parsing.' },
      { key: 'B', text: 'Farah cannot speak fluent German.' },
      { key: 'C', text: 'Farah speaks fluent German with native proficiency.' },
      { key: 'D', text: 'Everyone who speaks fluent German qualifies for the National Linguistics Olympiad.' },
    ],
    correctAnswer: 'A',
    explanation:
      'By Premise 1, every qualifier has mastered grammatical syntactic parsing. By Premise 3, Farah qualified. Therefore, Farah definitively has mastered grammatical syntactic parsing (Modus Ponens). Whether Farah speaks German or not cannot be established from "some".',
    difficulty: 'Medium',
  },
  {
    id: 20,
    category: 'D',
    topic: 'Structural Parallelism & Dangling Modifiers',
    stem: 'Identify the sentence that achieves impeccable grammatical parallelism and avoids dangling modifiers:',
    options: [
      { key: 'A', text: 'Having scrutinized the archival manuscripts, the young archivist discovered not only lost sonnets but also uncataloged royal decrees.' },
      { key: 'B', text: 'Having scrutinized the archival manuscripts, lost sonnets were discovered by the young archivist as well as uncataloged royal decrees.' },
      { key: 'C', text: 'Scrutinizing the archival manuscripts, the discovery of lost sonnets and uncataloged royal decrees pleased the archivist.' },
      { key: 'D', text: 'Having scrutinized the archival manuscripts, the library was delighted to announce both lost sonnets and royal decrees were found.' },
    ],
    correctAnswer: 'A',
    explanation:
      'In sentence A, the introductory participial phrase "Having scrutinized the archival manuscripts" correctly modifies the immediate subject "the young archivist" (who performed the action). The correlative conjunction "not only [noun phrase] but also [noun phrase]" maintains strict syntactic balance. In B, C, and D, the modifier dangles because "lost sonnets", "the discovery", or "the library" did not scrutinize the manuscripts.',
    difficulty: 'Olympiad Master',
  },
];
