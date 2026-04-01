import { randomItem, sample, shuffle } from '../utils/random';

const vocabGroups = {
  colors: [
    ['red', 'rojo'],
    ['blue', 'azul'],
    ['green', 'verde'],
    ['yellow', 'amarillo'],
    ['purple', 'morado'],
    ['orange', 'naranja'],
    ['white', 'blanco'],
    ['black', 'negro'],
    ['pink', 'rosado'],
    ['brown', 'marron'],
  ],
  numbers: [
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
    ['ten', '10'],
  ],
  fruits: [
    ['apple', 'manzana'],
    ['banana', 'banana'],
    ['grape', 'uva'],
    ['orange', 'naranja'],
    ['pear', 'pera'],
    ['watermelon', 'sandia'],
    ['pineapple', 'pina'],
    ['strawberry', 'fresa'],
    ['mango', 'mango'],
    ['peach', 'durazno'],
  ],
  animals: [
    ['dog', 'perro'],
    ['cat', 'gato'],
    ['lion', 'leon'],
    ['elephant', 'elefante'],
    ['monkey', 'mono'],
    ['dolphin', 'delfin'],
    ['rabbit', 'conejo'],
    ['bird', 'pajaro'],
    ['tiger', 'tigre'],
    ['bear', 'oso'],
  ],
  schoolObjects: [
    ['pencil', 'lapiz'],
    ['eraser', 'borrador'],
    ['notebook', 'cuaderno'],
    ['backpack', 'mochila'],
    ['ruler', 'regla'],
    ['scissors', 'tijeras'],
    ['marker', 'marcador'],
    ['desk', 'escritorio'],
    ['chair', 'silla'],
    ['book', 'libro'],
  ],
};

const subjects = ['I', 'You', 'He', 'She', 'We', 'They'];
const names = ['Lucas', 'Mia', 'Sofia', 'Daniel', 'Emma', 'Leo', 'Nora', 'Eva'];
const verbsBase = [
  ['play', 'plays', 'played', 'playing', 'played'],
  ['study', 'studies', 'studied', 'studying', 'studied'],
  ['watch', 'watches', 'watched', 'watching', 'watched'],
  ['visit', 'visits', 'visited', 'visiting', 'visited'],
  ['cook', 'cooks', 'cooked', 'cooking', 'cooked'],
  ['clean', 'cleans', 'cleaned', 'cleaning', 'cleaned'],
  ['dance', 'dances', 'danced', 'dancing', 'danced'],
  ['paint', 'paints', 'painted', 'painting', 'painted'],
];
const places = ['at school', 'in the park', 'at home', 'in class', 'after lunch'];
const adjectives = ['happy', 'tired', 'ready', 'hungry', 'excited', 'late'];

function buildQuestion({
  prompt,
  answer,
  distractors,
  explanation,
  hint,
  voiceText,
  difficulty = 'medium',
}) {
  return {
    prompt,
    // Mezclamos la opción correcta con distractores para evitar memorización visual.
    options: shuffle([answer, ...sample(distractors, 3)]),
    answer,
    explanation,
    hint,
    voiceText: voiceText || prompt,
    difficulty,
  };
}

function createVocabQuestion(levelKey, label) {
  const entries = vocabGroups[levelKey];
  const [english, spanish] = randomItem(entries);
  const distractors = entries
    .filter(([word]) => word !== english)
    .map(([word]) => word);

  const modes = [
    () =>
      buildQuestion({
        prompt: `Choose the correct English word: ${spanish}`,
        answer: english,
        distractors,
        explanation: `${english} means "${spanish}" in Spanish.`,
        hint: `It is a ${label.toLowerCase()} word.`,
        difficulty: 'easy',
      }),
    () =>
      buildQuestion({
        prompt: `Which option matches the word "${english}"?`,
        answer: english,
        distractors,
        explanation: `The correct answer is ${english}.`,
        hint: `Read the word carefully.`,
        difficulty: 'easy',
      }),
  ];

  return randomItem(modes)();
}

function createToBeQuestion() {
  const subject = randomItem(subjects);
  const adjective = randomItem(adjectives);
  const answer =
    subject === 'I' ? 'am' : ['He', 'She'].includes(subject) ? 'is' : 'are';

  return buildQuestion({
    prompt: `${subject} ___ ${adjective} today.`,
    answer,
    distractors: ['is', 'are', 'am', 'be'].filter((item) => item !== answer),
    explanation: `We use "${answer}" with ${subject}.`,
    hint: `Think about the subject pronoun.`,
  });
}

function createPronounQuestion() {
  const pairs = [
    ['Maria', 'She'],
    ['Tom and I', 'We'],
    ['The boys', 'They'],
    ['My teacher', 'She'],
    ['The dog', 'It'],
    ['Pedro', 'He'],
  ];
  const [noun, answer] = randomItem(pairs);
  return buildQuestion({
    prompt: `Choose the correct pronoun for: ${noun}`,
    answer,
    distractors: ['He', 'She', 'It', 'We', 'They', 'You'].filter(
      (item) => item !== answer,
    ),
    explanation: `${noun} is replaced by "${answer}".`,
    hint: 'Look at whether it is one person, many people, or an object.',
    difficulty: 'easy',
  });
}

function createSimplePresentQuestion() {
  const [base, thirdPerson] = randomItem(verbsBase);
  const subject = randomItem(['I', 'You', 'We', 'They', 'He', 'She']);
  const verb = ['He', 'She'].includes(subject) ? thirdPerson : base;

  return buildQuestion({
    prompt: `${subject} ${randomItem(['always', 'often', 'usually'])} ___ English after class.`,
    answer: verb,
    distractors: [base, thirdPerson, `${base}ing`, `did ${base}`].filter(
      (item) => item !== verb,
    ),
    explanation: `In the simple present, ${subject} uses "${verb}".`,
    hint: 'Check if the subject is third person singular.',
  });
}

function createPresentContinuousQuestion() {
  const subject = randomItem(['I', 'You', 'He', 'She', 'We', 'They']);
  const [, , , ing] = randomItem(verbsBase);
  const be =
    subject === 'I' ? 'am' : ['He', 'She'].includes(subject) ? 'is' : 'are';

  return buildQuestion({
    prompt: `Right now, ${subject} ___ ${ing}.`,
    answer: be,
    distractors: ['am', 'is', 'are', 'do'].filter((item) => item !== be),
    explanation: `${subject} uses "${be}" in the present continuous.`,
    hint: 'Present continuous needs the verb to be.',
  });
}

function createPastSimpleQuestion() {
  const [base, , past] = randomItem(verbsBase);
  const subject = randomItem([...subjects, randomItem(names)]);
  return buildQuestion({
    prompt: `Yesterday ${subject} ___ ${randomItem(places)}.`,
    answer: past,
    distractors: [base, `${base}s`, `did ${base}`, `${base}ing`].filter(
      (item) => item !== past,
    ),
    explanation: `Past simple commonly uses "${past}".`,
    hint: 'The clue is "Yesterday".',
  });
}

function createPastContinuousQuestion() {
  const subject = randomItem(['I', 'He', 'She', 'We', 'They']);
  const [, , , ing] = randomItem(verbsBase);
  const be = ['He', 'She', 'I'].includes(subject) ? 'was' : 'were';
  return buildQuestion({
    prompt: `At 8 p.m., ${subject} ___ ${ing}.`,
    answer: be,
    distractors: ['was', 'were', 'is', 'are'].filter((item) => item !== be),
    explanation: `Past continuous uses "${be} + verb-ing".`,
    hint: 'Think about the subject and the time in the past.',
  });
}

function createPastParticipleQuestion() {
  const [base, , past, , participle] = randomItem(verbsBase);
  return buildQuestion({
    prompt: `Choose the past participle of "${base}".`,
    answer: participle,
    distractors: [base, past, `${base}ing`, `${base}s`].filter(
      (item) => item !== participle,
    ),
    explanation: `The past participle of "${base}" is "${participle}".`,
    hint: 'It is often used with have/has/had.',
  });
}

function createPresentPerfectQuestion() {
  const subject = randomItem(['I', 'You', 'We', 'They', 'He', 'She']);
  const [, , , , participle] = randomItem(verbsBase);
  const helper = ['He', 'She'].includes(subject) ? 'has' : 'have';

  return buildQuestion({
    prompt: `${subject} ___ ${participle} the homework already.`,
    answer: helper,
    distractors: ['have', 'has', 'had', 'did'].filter((item) => item !== helper),
    explanation: `Present perfect uses "${helper} + past participle".`,
    hint: 'Check the subject first.',
  });
}

function createPastPerfectQuestion() {
  const [, , , , participle] = randomItem(verbsBase);
  const subject = randomItem(['I', 'She', 'They', randomItem(names)]);
  return buildQuestion({
    prompt: `Before the test started, ${subject} ___ ${participle} the review guide.`,
    answer: 'had',
    distractors: ['has', 'have', 'was', 'did'],
    explanation: 'Past perfect uses "had + past participle".',
    hint: 'The action happened before another past action.',
    difficulty: 'hard',
  });
}

function createMixedReviewQuestion() {
  const pool = [
    createSimplePresentQuestion,
    createPresentContinuousQuestion,
    createPastSimpleQuestion,
    createPresentPerfectQuestion,
    createPastPerfectQuestion,
  ];
  return randomItem(pool)();
}

function createFinalChallengeQuestion() {
  const templates = [
    () =>
      buildQuestion({
        prompt: `By the time we arrived, the class ___ already started.`,
        answer: 'had',
        distractors: ['has', 'have', 'was', 'is'],
        explanation: 'Past perfect fits because one past action happened before another.',
        hint: 'Look for the earlier past action.',
        difficulty: 'hard',
      }),
    () =>
      buildQuestion({
        prompt: `She ___ English every day, so her speaking is improving quickly.`,
        answer: 'practices',
        distractors: ['practice', 'practiced', 'is practicing'],
        explanation: 'A routine action in simple present uses "practices".',
        hint: 'This sentence describes a habit.',
        difficulty: 'medium',
      }),
    () =>
      buildQuestion({
        prompt: `They ___ dinner when the lights went out.`,
        answer: 'were cooking',
        distractors: ['cooked', 'are cooking', 'have cooked'],
        explanation: 'Past continuous shows an action in progress in the past.',
        hint: 'One action interrupted another in the past.',
        difficulty: 'hard',
      }),
  ];

  return randomItem(templates)();
}

export const levelDefinitions = [
  { id: 1, slug: 'colors', title: 'Colors', theme: 'Vocabulario', bossName: 'Color Comet' },
  { id: 2, slug: 'numbers', title: 'Numbers', theme: 'Vocabulario', bossName: 'Number Nova' },
  { id: 3, slug: 'fruits', title: 'Fruits', theme: 'Vocabulario', bossName: 'Fruit Rocket' },
  { id: 4, slug: 'animals', title: 'Animals', theme: 'Vocabulario', bossName: 'Wild Grammar Bot' },
  { id: 5, slug: 'schoolObjects', title: 'School Objects', theme: 'Classroom', bossName: 'Campus Crusher' },
  { id: 6, slug: 'toBe', title: 'Verb To Be', theme: 'Grammar', bossName: 'To Be Titan' },
  { id: 7, slug: 'pronouns', title: 'Personal Pronouns', theme: 'Grammar', bossName: 'Pronoun Phantom' },
  { id: 8, slug: 'simplePresent', title: 'Simple Present', theme: 'Grammar', bossName: 'Routine Rex' },
  { id: 9, slug: 'presentContinuous', title: 'Present Continuous', theme: 'Grammar', bossName: 'Action Storm' },
  { id: 10, slug: 'pastSimple', title: 'Past Simple', theme: 'Grammar', bossName: 'Yesterday Yeti' },
  { id: 11, slug: 'pastContinuous', title: 'Past Continuous', theme: 'Grammar', bossName: 'Timeline Troll' },
  { id: 12, slug: 'pastParticiple', title: 'Past Participle', theme: 'Grammar', bossName: 'Participle Pulse' },
  { id: 13, slug: 'presentPerfect', title: 'Present Perfect', theme: 'Grammar', bossName: 'Perfect Portal' },
  { id: 14, slug: 'pastPerfect', title: 'Past Perfect', theme: 'Grammar', bossName: 'History Hydra' },
  { id: 15, slug: 'mixedReview', title: 'Mixed Review', theme: 'Challenge', bossName: 'Academy Mixer' },
  { id: 16, slug: 'finalChallenge', title: 'Final Academy Challenge', theme: 'Pro', bossName: 'Master Grammar Core' },
];

const generators = {
  colors: () => createVocabQuestion('colors', 'color'),
  numbers: () => createVocabQuestion('numbers', 'number'),
  fruits: () => createVocabQuestion('fruits', 'fruit'),
  animals: () => createVocabQuestion('animals', 'animal'),
  schoolObjects: () => createVocabQuestion('schoolObjects', 'school object'),
  toBe: createToBeQuestion,
  pronouns: createPronounQuestion,
  simplePresent: createSimplePresentQuestion,
  presentContinuous: createPresentContinuousQuestion,
  pastSimple: createPastSimpleQuestion,
  pastContinuous: createPastContinuousQuestion,
  pastParticiple: createPastParticipleQuestion,
  presentPerfect: createPresentPerfectQuestion,
  pastPerfect: createPastPerfectQuestion,
  mixedReview: createMixedReviewQuestion,
  finalChallenge: createFinalChallengeQuestion,
};

export function createQuestionForLevel(level, adaptiveState) {
  const question = generators[level.slug]();
  return {
    ...question,
    // La dificultad adaptable controla cuánto tiempo y ayuda recibe el estudiante.
    timeLimit: adaptiveState.timeLimit,
    aidMode: adaptiveState.aidMode,
  };
}

export function getLevelById(levelId) {
  return levelDefinitions.find((level) => level.id === levelId) ?? levelDefinitions[0];
}
