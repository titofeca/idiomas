import { PlacementQuestion } from '../types';

export const ENGLISH_PLACEMENT_TEST: PlacementQuestion[] = [
  {
    id: 'en-q1',
    lang: 'en',
    targetLevel: 'A2-B1',
    instruction: 'Completa la frase con la forma correcta:',
    promptText: 'Last night, my friends and I _____ to a new pizza place downtown.',
    options: [
      { id: '1', text: 'went', isCorrect: true, points: 20 },
      { id: '2', text: 'go', isCorrect: false, points: 0 },
      { id: '3', text: 'have gone', isCorrect: false, points: 5 },
      { id: '4', text: 'was going', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'en-q2',
    lang: 'en',
    targetLevel: 'B1',
    instruction: '¿Qué opción expresa mejor la intención de esta frase?',
    promptText: 'If you want to get better at speaking, you should try practicing every day with short dialogues.',
    options: [
      { id: '1', text: 'Es una orden obligatoria por ley.', isCorrect: false, points: 0 },
      { id: '2', text: 'Es una recomendación y consejo útil para mejorar.', isCorrect: true, points: 20 },
      { id: '3', text: 'Dice que es imposible mejorar hablando poco.', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'en-q3',
    lang: 'en',
    targetLevel: 'B2',
    instruction: 'Identifica el phrasal verb que mejor encaja:',
    promptText: 'It was a really tough project, but our team managed to _____ and win first prize!',
    audioText: 'It was a really tough project, but our team managed to pull it off and win first prize!',
    options: [
      { id: '1', text: 'pull it off (conseguirlo con éxito)', isCorrect: true, points: 20 },
      { id: '2', text: 'give it up (rendirse)', isCorrect: false, points: 0 },
      { id: '3', text: 'look it after (cuidarlo)', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'en-q4',
    lang: 'en',
    targetLevel: 'B2+',
    instruction: 'Comprensión de audio y mediación rápida:',
    promptText: 'Escucha o lee: "The cinema screening starts at 7:30 PM, but ticket holders can enter from 7:00 PM."',
    options: [
      { id: '1', text: 'Las puertas abren a las 7:00, aunque la película empiece a las 7:30.', isCorrect: true, points: 20 },
      { id: '2', text: 'La película termina a las 7:30 y no dejan entrar antes.', isCorrect: false, points: 0 },
      { id: '3', text: 'El pase está retrasado media hora.', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'en-q5',
    lang: 'en',
    targetLevel: 'C1',
    instruction: 'Fluidez y conectores de nivel avanzado:',
    promptText: 'Choose the most natural expression: "We had no prior plan; we booked the flights _____."',
    options: [
      { id: '1', text: 'on the spur of the moment (de forma espontánea)', isCorrect: true, points: 20 },
      { id: '2', text: 'by hook or by book', isCorrect: false, points: 0 },
      { id: '3', text: 'out of the blue moon', isCorrect: false, points: 0 },
    ],
  },
];

export const CHINESE_PLACEMENT_TEST: PlacementQuestion[] = [
  {
    id: 'zh-q1',
    lang: 'zh',
    targetLevel: 'HSK 1',
    instruction: '¿Qué significa esta expresión cotidiana?',
    promptText: '你好，我是学生。 (Nǐ hǎo, wǒ shì xuésheng.)',
    audioText: '你好，我是学生。',
    options: [
      { id: '1', text: 'Hola, soy profesor.', isCorrect: false, points: 0 },
      { id: '2', text: 'Hola, soy estudiante.', isCorrect: true, points: 20 },
      { id: '3', text: 'Hola, tengo dos libros.', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'zh-q2',
    lang: 'zh',
    targetLevel: 'HSK 1',
    instruction: 'Identifica el tono correcto para "bueno/bien" (好):',
    promptText: 'El carácter 好 (hǎo) tiene tono:',
    options: [
      { id: '1', text: 'Tono 1 (Plano alto: hāo)', isCorrect: false, points: 0 },
      { id: '2', text: 'Tono 2 (Ascendente: háo)', isCorrect: false, points: 0 },
      { id: '3', text: 'Tono 3 (Cóncavo: baja y sube hǎo)', isCorrect: true, points: 20 },
      { id: '4', text: 'Tono 4 (Golpe descendente: hào)', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'zh-q3',
    lang: 'zh',
    targetLevel: 'HSK 2',
    instruction: 'Completa con el clasificador adecuado:',
    promptText: '我买了一_____书。 (Wǒ mǎile yì _____ shū.)',
    options: [
      { id: '1', text: '本 (běn - clasificador de libros y cuadernos)', isCorrect: true, points: 20 },
      { id: '2', text: '个 (gè - clasificador general)', isCorrect: false, points: 5 },
      { id: '3', text: '只 (zhī - clasificador de animales)', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'zh-q4',
    lang: 'zh',
    targetLevel: 'HSK 2-3',
    instruction: '¿Qué expresa la partícula "了" (le) en esta oración?',
    promptText: '我已经吃饱了！ (Wǒ yǐjīng chī bǎo le!)',
    options: [
      { id: '1', text: 'Una pregunta de sí o no.', isCorrect: false, points: 0 },
      { id: '2', text: 'Cambio de estado y acción completada (ya me he llenado).', isCorrect: true, points: 20 },
      { id: '3', text: 'Una comparación negativa.', isCorrect: false, points: 0 },
    ],
  },
  {
    id: 'zh-q5',
    lang: 'zh',
    targetLevel: 'HSK 3',
    instruction: 'Estructura modal y comunicativa:',
    promptText: '虽然汉语有点难，但是我想学好它。',
    audioText: '虽然汉语有点难，但是我想学好它。',
    options: [
      { id: '1', text: 'Aunque el chino es un poco difícil, quiero aprenderlo bien.', isCorrect: true, points: 20 },
      { id: '2', text: 'El chino no es difícil pero no quiero estudiarlo.', isCorrect: false, points: 0 },
      { id: '3', text: 'Porque el chino es fácil, ya lo hablo perfecto.', isCorrect: false, points: 0 },
    ],
  },
];
