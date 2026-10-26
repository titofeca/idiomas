import { SrsCard, MediationCard } from '../types';

export const ENGLISH_SRS_CARDS: SrsCard[] = [
  // Nivel B2 - C1 Expresiones Avanzadas y Phrasal Verbs de Alto Rendimiento
  {
    id: 'en-1',
    lang: 'en',
    front: 'Pull off',
    phonetic: '/pʊl ɒf/',
    back: 'Lograr / Llevar a cabo con éxito (algo difícil o inesperado)',
    example: 'No one thought our team could win the final, but we pulled it off!',
    exampleTranslation: '¡Nadie pensaba que nuestro equipo pudiera ganar la final, pero lo conseguimos!',
    category: 'Phrasal Verbs Clave',
    level: 'B2 Upper-Intermediate',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-2',
    lang: 'en',
    front: 'Hit the nail on the head',
    phonetic: '/hɪt ðə neɪl ɒn ðə hed/',
    back: 'Dar en el clavo / Acertar de lleno',
    example: 'You hit the nail on the head with that explanation of the problem.',
    exampleTranslation: 'Diste en el clavo con esa explicación del problema.',
    category: 'Idioms y Expresiones Nativas',
    level: 'B2 Upper-Intermediate',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-3',
    lang: 'en',
    front: 'Figure out',
    phonetic: '/ˈfɪɡ.ər aʊt/',
    back: 'Descifrar / Encontrar la solución / Entender cómo funciona',
    example: 'It took me twenty minutes to figure out how to solve that coding puzzle.',
    exampleTranslation: 'Me llevó veinte minutos descifrar cómo resolver ese acertijo de código.',
    category: 'Phrasal Verbs Clave',
    level: 'B1+ Competencia ESO',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-4',
    lang: 'en',
    front: 'By and large',
    phonetic: '/baɪ ənd lɑːdʒ/',
    back: 'En términos generales / Por regla general',
    example: 'By and large, the tournament was a huge success for everyone involved.',
    exampleTranslation: 'En términos generales, el torneo fue un gran éxito para todos los participantes.',
    category: 'Conectores C1 Avanzados',
    level: 'C1 Advanced',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-5',
    lang: 'en',
    front: 'Bring up',
    phonetic: '/brɪŋ ʌp/',
    back: 'Sacar un tema a relucir / Mencionar',
    example: 'I was hoping nobody would bring up the test results today.',
    exampleTranslation: 'Esperaba que nadie sacara a colación las notas del examen hoy.',
    category: 'Phrasal Verbs Clave',
    level: 'B2 Upper-Intermediate',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-6',
    lang: 'en',
    front: 'Call it a day',
    phonetic: '/kɔːl ɪt ə deɪ/',
    back: 'Dar por terminado el trabajo por hoy / Terminar la jornada',
    example: 'We have finished four complete lessons. Let’s call it a day and celebrate!',
    exampleTranslation: 'Hemos terminado cuatro lecciones completas. ¡Démoslo por terminado por hoy y celebremos!',
    category: 'Idioms y Expresiones Nativas',
    level: 'B2 Upper-Intermediate',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-7',
    lang: 'en',
    front: 'Catch up on',
    phonetic: '/kætʃ ʌp ɒn/',
    back: 'Ponerse al día con (series, noticias, tareas pendientes)',
    example: 'This weekend I need to catch up on my reading for literature class.',
    exampleTranslation: 'Este fin de semana necesito ponerme al día con mis lecturas de literatura.',
    category: 'Phrasal Verbs Clave',
    level: 'B1+ Competencia ESO',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-8',
    lang: 'en',
    front: 'Cut corners',
    phonetic: '/kʌt ˈkɔːnəz/',
    back: 'Hacer las cosas a medias / Tomar atajos sacrificando calidad',
    example: 'If you cut corners on the project, the final presentation won’t look professional.',
    exampleTranslation: 'Si tomas atajos chapuceros en el proyecto, la presentación no parecerá profesional.',
    category: 'Idioms y Expresiones Nativas',
    level: 'B2 Upper-Intermediate',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'en-9',
    lang: 'en',
    front: 'On the spur of the moment',
    phonetic: '/ɒn ðə spɜːr əv ðə ˈməʊmənt/',
    back: 'De forma espontánea / Por impulso sin planificar',
    example: 'We decided to go to the cinema on the spur of the moment.',
    exampleTranslation: 'Decidimos ir al cine de manera totalmente espontánea.',
    category: 'C1 Expresiones de Fluidez',
    level: 'C1 Advanced',
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  }
];

// Tarjetas de Mediación LOMLOE (Competencia Específica 4: RD 217/2022)
export const MEDIATION_CARDS: MediationCard[] = [
  {
    id: 'med-1',
    title: 'Horario del Concierto y Acceso',
    cefrLevel: 'ESO 2.º-3.º (B1)',
    realWorldScenario: 'Estás con tu familia en Londres. Un altavoz del recinto anuncia la apertura en inglés. Tu hermano menor no entiende y te pregunta a qué hora hay que llegar.',
    audioPromptEn: 'Ladies and gentlemen, the main event is scheduled to kick off promptly at 8:00 PM, although the venue doors will be open from 7:00 PM for ticket checks.',
    taskInstruction: 'Selecciona la mediación más precisa y útil en castellano para tu hermano:',
    options: [
      {
        id: 'opt-a',
        text: 'Dicen que el concierto se termina a las 8 en punto y que a las 7 echan a la gente.',
        isCorrect: false,
        feedback: 'Incorrecto: "Kick off" significa empezar, no terminar. Y las puertas se abren a las 7, no se echa a nadie.'
      },
      {
        id: 'opt-b',
        text: 'Empieza a las 8:00 en punto, pero podemos entrar desde las 7:00 para la revisión de entradas y coger buen sitio.',
        isCorrect: true,
        feedback: '¡Perfecto! Has mediado sintetizando con exactitud el horario de apertura vs inicio del show.'
      },
      {
        id: 'opt-c',
        text: 'El evento está cancelado hasta las 7 de la tarde de mañana.',
        isCorrect: false,
        feedback: 'Incorrecto: El anuncio no menciona ninguna cancelación.'
      }
    ]
  },
  {
    id: 'med-2',
    title: 'Aviso de Alergias en un Menú',
    cefrLevel: 'ESO 4.º (B1+)',
    realWorldScenario: 'Estás en una cafetería internacional. Tu padre es alérgico a los frutos secos y el camarero le entrega esta nota en inglés sobre la tarta del día.',
    audioPromptEn: 'Please note that while this pastry contains no direct nuts in the filling, it is produced in a facility where peanuts and tree nuts are frequently handled.',
    taskInstruction: '¿Cómo le medias esta advertencia a tu padre para proteger su salud?',
    options: [
      {
        id: 'opt-a',
        text: 'La tarta no lleva nueces en el relleno, pero avisan de que puede tener trazas porque en el mismo obrador manejan cacahuetes y frutos secos.',
        isCorrect: true,
        feedback: '¡Brillante mediación! Has captado el matiz crítico de la contaminación cruzada ("facility where nuts are handled").'
      },
      {
        id: 'opt-b',
        text: 'Dice que está hecha 100% de cacahuetes y que es peligrosa.',
        isCorrect: false,
        feedback: 'Incorrecto: El relleno en sí no lleva frutos secos, el riesgo son las trazas.'
      },
      {
        id: 'opt-c',
        text: 'Dice que no hay ningún problema de alergias y que es totalmente segura sin excepción.',
        isCorrect: false,
        feedback: 'Peligroso: Ignora la advertencia explícita sobre manipulación en la misma fábrica.'
      }
    ]
  },
  {
    id: 'med-3',
    title: 'Retraso de Vuelo y Puerta de Embarque',
    cefrLevel: 'Bachillerato (B2)',
    realWorldScenario: 'En el aeropuerto, megafonía emite este aviso de última hora. Tus compañeros de viaje están despistados.',
    audioPromptEn: 'Attention passengers on Flight 402 to Madrid. Due to severe turbulence on inbound aircraft, boarding will be postponed by forty-five minutes. Additionally, please proceed to Gate 14 instead of Gate 8.',
    taskInstruction: 'Resume el mensaje en un grupo de WhatsApp de forma clara y directa:',
    options: [
      {
        id: 'opt-a',
        text: 'El vuelo va puntual, nos vemos en la puerta 8 ya.',
        isCorrect: false,
        feedback: 'Incorrecto: Han cambiado de puerta y se retrasa el embarque.'
      },
      {
        id: 'opt-b',
        text: 'Chicos, el vuelo se retrasa 45 minutos por mal tiempo en el avión que venía, y tenemos que ir a la Puerta 14 (ya no es la 8).',
        isCorrect: true,
        feedback: '¡Impecable! Resumes la causa, el tiempo exacto del retraso y la nueva puerta asignada.'
      },
      {
        id: 'opt-c',
        text: 'Dicen que compremos billetes para el vuelo de las 14:00.',
        isCorrect: false,
        feedback: 'Incorrecto: "Gate 14" es la puerta de embarque, no la hora del vuelo.'
      }
    ]
  }
];
