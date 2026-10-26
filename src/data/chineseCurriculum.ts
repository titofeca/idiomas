import { SrsCard, ToneLabExercise, HanziWritingCard, PinyinImeExercise } from '../types';

// HSK 3.0 Curriculum with 4-Phase Pedagogical Resequencing
// Never teach grammar in raw official numerical order (Standard GF0025-2021)
export const CHINESE_SRS_CARDS: SrsCard[] = [
  // FASE 1: Identificación y Preguntas Básicas (Lecciones 1 a 20)
  {
    id: 'zh-1',
    lang: 'zh',
    front: '你好',
    pinyin: 'nǐ hǎo',
    back: 'Hola (saludo cordial)',
    example: '你好！很高兴认识你。',
    exampleTranslation: '¡Hola! Encantado de conocerte.',
    category: 'Saludos y Cortesía',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-2',
    lang: 'zh',
    front: '我',
    pinyin: 'wǒ',
    back: 'Yo / Me / Mí',
    example: '我是学生。',
    exampleTranslation: 'Yo soy estudiante.',
    category: 'Pronombres',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-3',
    lang: 'zh',
    front: '是',
    pinyin: 'shì',
    back: 'Ser / Sí (verbo copulativo esencial)',
    example: '他是我的老师。',
    exampleTranslation: 'Él es mi profesor.',
    category: 'Verbos Copulativos',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-4',
    lang: 'zh',
    front: '不',
    pinyin: 'bù',
    back: 'No (negación)',
    example: '我不是中国人，我是西班牙人。',
    exampleTranslation: 'No soy chino, soy español.',
    category: 'Adverbios de Negación',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-5',
    lang: 'zh',
    front: '吗',
    pinyin: 'ma',
    back: '¿? (partícula interrogativa de sí/no)',
    example: '你好吗？',
    exampleTranslation: '¿Cómo estás? / ¿Estás bien?',
    category: 'Partículas Interrogativas',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: false,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-6',
    lang: 'zh',
    front: '什么',
    pinyin: 'shénme',
    back: '¿Qué? / ¿Cuál?',
    example: '你叫什么名字？',
    exampleTranslation: '¿Cómo te llamas? (lit: ¿Te llamas qué nombre?)',
    category: 'Pronombres Interrogativos',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: false,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-7',
    lang: 'zh',
    front: '这 / 那',
    pinyin: 'zhè / nà',
    back: 'Esto / Aquello (demostrativos)',
    example: '这是我的书，那是他的。',
    exampleTranslation: 'Este es mi libro, aquel es el suyo.',
    category: 'Demostrativos',
    level: 'HSK 3.0 Nivel 1',
    phase: 1,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },

  // FASE 2: Cuantificación, Pertenencia y Clasificadores (Lecciones 21 a 40)
  {
    id: 'zh-8',
    lang: 'zh',
    front: '个',
    pinyin: 'gè',
    back: 'Clasificador general para personas y cosas',
    example: '一个人，三个苹果。',
    exampleTranslation: 'Una persona, tres manzanas.',
    category: 'Clasificadores',
    level: 'HSK 3.0 Nivel 1',
    phase: 2,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-9',
    lang: 'zh',
    front: '的',
    pinyin: 'de',
    back: 'Partícula de posesión y modificación (de)',
    example: '我的手机在哪儿？',
    exampleTranslation: '¿Dónde está mi teléfono móvil?',
    category: 'Partículas Estructurales',
    level: 'HSK 3.0 Nivel 1',
    phase: 2,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-10',
    lang: 'zh',
    front: '有 / 没有',
    pinyin: 'yǒu / méiyǒu',
    back: 'Tener / Haber (y su negación)',
    example: '我有一个弟弟，没有妹妹。',
    exampleTranslation: 'Tengo un hermano menor, no tengo hermana menor.',
    category: 'Verbos de Existencia',
    level: 'HSK 3.0 Nivel 1',
    phase: 2,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-11',
    lang: 'zh',
    front: '本',
    pinyin: 'běn',
    back: 'Clasificador para libros y cuadernos',
    example: '两本书',
    exampleTranslation: 'Dos libros',
    category: 'Clasificadores',
    level: 'HSK 3.0 Nivel 1',
    phase: 2,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },

  // FASE 3: Capacidades, Deseos y Modales (Lecciones 41 a 60)
  {
    id: 'zh-12',
    lang: 'zh',
    front: '会',
    pinyin: 'huì',
    back: 'Saber hacer (habilidad adquirida) / Ir a (futuro)',
    example: '我会说汉语和英语。',
    exampleTranslation: 'Sé hablar chino e inglés.',
    category: 'Verbos Modales',
    level: 'HSK 3.0 Nivel 1',
    phase: 3,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-13',
    lang: 'zh',
    front: '想 / 要',
    pinyin: 'xiǎng / yào',
    back: 'Desear, tener ganas de / Querer, necesitar',
    example: '我想喝茶，我要买一个杯子。',
    exampleTranslation: 'Tengo ganas de beber té, quiero comprar una taza.',
    category: 'Verbos Modales',
    level: 'HSK 3.0 Nivel 1',
    phase: 3,
    isHandwritingCandidate: false,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-14',
    lang: 'zh',
    front: '很 / 都 / 也',
    pinyin: 'hěn / dōu / yě',
    back: 'Muy / Todos, ambos / También',
    example: '我们都很好，他也很好。',
    exampleTranslation: 'Todos nosotros estamos muy bien, él también está muy bien.',
    category: 'Adverbios de Grado y Alcance',
    level: 'HSK 3.0 Nivel 1',
    phase: 3,
    isHandwritingCandidate: false,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },

  // FASE 4: Localización, Tiempo y Aspecto Cambiante (Lecciones 61 a 81)
  {
    id: 'zh-15',
    lang: 'zh',
    front: '在',
    pinyin: 'zài',
    back: 'Estar en / En (localizador espacial)',
    example: '他在学校学习。',
    exampleTranslation: 'Él está en la escuela estudiando.',
    category: 'Preposiciones de Lugar',
    level: 'HSK 3.0 Nivel 1',
    phase: 4,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-16',
    lang: 'zh',
    front: '了',
    pinyin: 'le',
    back: 'Partícula de aspecto: cambio de estado o acción consumada',
    example: '太好了！我吃饱了。',
    exampleTranslation: '¡Qué bien! / Ya me he llenado.',
    category: 'Partículas de Aspecto',
    level: 'HSK 3.0 Nivel 1',
    phase: 4,
    isHandwritingCandidate: true,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  },
  {
    id: 'zh-17',
    lang: 'zh',
    front: '现在',
    pinyin: 'xiànzài',
    back: 'Ahora / En este momento',
    example: '现在几点？',
    exampleTranslation: '¿Qué hora es ahora?',
    category: 'Tiempo',
    level: 'HSK 3.0 Nivel 1',
    phase: 4,
    isHandwritingCandidate: false,
    srsInterval: 1,
    nextReviewDate: Date.now(),
    consecutiveSuccess: 0,
    easeFactor: 2.5
  }
];

// Módulo de Discriminación Tonal (FastPitch pitch contour training)
export const TONE_LAB_EXERCISES: ToneLabExercise[] = [
  {
    id: 'tone-ma',
    syllable: 'ma',
    targetTone: 1,
    pinyin: 'mā',
    hanzi: '妈',
    meaning: 'Madre (Tono 1: Alto y plano 55)',
    options: [
      { tone: 1, pinyin: 'mā', hanzi: '妈', meaning: 'Madre (1º: Plano alto)' },
      { tone: 2, pinyin: 'má', hanzi: '麻', meaning: 'Cáñamo (2º: Ascendente)' },
      { tone: 3, pinyin: 'mǎ', hanzi: '马', meaning: 'Caballo (3º: Cóncavo/Baja y sube)' },
      { tone: 4, pinyin: 'mà', hanzi: '骂', meaning: 'Regañar/Insultar (4º: Brusco descendente)' }
    ]
  },
  {
    id: 'tone-shi',
    syllable: 'shi',
    targetTone: 4,
    pinyin: 'shì',
    hanzi: '是',
    meaning: 'Ser / Sí (Tono 4: Caída firme 51)',
    options: [
      { tone: 1, pinyin: 'shī', hanzi: '师', meaning: 'Maestro (1º: Alto continuo)' },
      { tone: 2, pinyin: 'shí', hanzi: '十', meaning: 'Diez (2º: Ascendente)' },
      { tone: 3, pinyin: 'shǐ', hanzi: '史', meaning: 'Historia (3º: Profundo)' },
      { tone: 4, pinyin: 'shì', hanzi: '是', meaning: 'Ser (4º: Firme descendente)' }
    ]
  },
  {
    id: 'tone-tang',
    syllable: 'tang',
    targetTone: 2,
    pinyin: 'táng',
    hanzi: '糖',
    meaning: 'Caramelo / Azúcar (Tono 2: Ascendente 35)',
    options: [
      { tone: 1, pinyin: 'tāng', hanzi: '汤', meaning: 'Sopa (1º: Alto y sostenido)' },
      { tone: 2, pinyin: 'táng', hanzi: '糖', meaning: 'Caramelo (2º: Subiendo la voz)' },
      { tone: 3, pinyin: 'tǎng', hanzi: '躺', meaning: 'Tumbarse (3º: Fondo y sube)' },
      { tone: 4, pinyin: 'tàng', hanzi: '烫', meaning: 'Muy caliente (4º: Golpe abajo)' }
    ]
  },
  {
    id: 'tone-hao',
    syllable: 'hao',
    targetTone: 3,
    pinyin: 'hǎo',
    hanzi: '好',
    meaning: 'Bueno / Bien (Tono 3: Curva cóncava 214)',
    options: [
      { tone: 1, pinyin: 'hāo', hanzi: '蒿', meaning: 'Artemisa (1º: Alto recto)' },
      { tone: 2, pinyin: 'háo', hanzi: '毫', meaning: 'Milímetro/Pelo (2º: Subida)' },
      { tone: 3, pinyin: 'hǎo', hanzi: '好', meaning: 'Bien/Bueno (3º: Bajada profunda y repunte)' },
      { tone: 4, pinyin: 'hào', hanzi: '号', meaning: 'Número/Fecha (4º: Caída rápida)' }
    ]
  }
];

// Lista Oficial de Escritura Manual (书写字 - 100 caracteres de Nivel 1 y 2)
export const HANZI_WRITING_CARDS: HanziWritingCard[] = [
  {
    char: '一',
    pinyin: 'yī',
    meaning: 'Uno',
    radical: '一',
    radicalMeaning: 'Uno',
    strokesCount: 1,
    hintStrokes: ['Héng (Trazo horizontal de izquierda a derecha)']
  },
  {
    char: '人',
    pinyin: 'rén',
    meaning: 'Persona',
    radical: '人',
    radicalMeaning: 'Ser humano',
    strokesCount: 2,
    hintStrokes: ['Piě (Caída izquierda)', 'Nà (Caída derecha)']
  },
  {
    char: '口',
    pinyin: 'kǒu',
    meaning: 'Boca',
    radical: '口',
    radicalMeaning: 'Boca / Hablar / Abertura',
    strokesCount: 3,
    hintStrokes: ['Shù (Vertical izquierda)', 'Héngzhé (Horizontal con quiebro)', 'Héng (Cierre horizontal)']
  },
  {
    char: '日',
    pinyin: 'rì',
    meaning: 'Sol / Día',
    radical: '日',
    radicalMeaning: 'Sol / Tiempo',
    strokesCount: 4,
    hintStrokes: ['Shù (Vertical)', 'Héngzhé (Quiebro)', 'Héng (Horizontal interior)', 'Héng (Cierre)']
  },
  {
    char: '月',
    pinyin: 'yuè',
    meaning: 'Luna / Mes',
    radical: '月',
    radicalMeaning: 'Luna / Carne',
    strokesCount: 4,
    hintStrokes: ['Shùpiě (Vertical curvada)', 'Héngzhégōu (Horizontal con gancho)', 'Héng (Interior 1)', 'Héng (Interior 2)']
  },
  {
    char: '大',
    pinyin: 'dà',
    meaning: 'Grande',
    radical: '大',
    radicalMeaning: 'Grande (persona con brazos abiertos)',
    strokesCount: 3,
    hintStrokes: ['Héng (Horizontal)', 'Piě (Caída izquierda atravesando)', 'Nà (Caída derecha)']
  },
  {
    char: '女',
    pinyin: 'nǚ',
    meaning: 'Mujer / Femenino',
    radical: '女',
    radicalMeaning: 'Mujer',
    strokesCount: 3,
    hintStrokes: ['Piězhé (Caída con ángulo)', 'Piě (Caída atravesada)', 'Héng (Horizontal central)']
  },
  {
    char: '子',
    pinyin: 'zǐ',
    meaning: 'Hijo / Niño',
    radical: '子',
    radicalMeaning: 'Descendencia',
    strokesCount: 3,
    hintStrokes: ['Héngpiě (Horizontal con quiebro)', 'Wāngōu (Curva con gancho)', 'Héng (Horizontal larga cruzando)']
  }
];

// Simulador IME de Pinyin con Corrección Semántica de Radicales (Sección 3.1 del Doc)
export const PINYIN_IME_EXERCISES: PinyinImeExercise[] = [
  {
    id: 'ime-1',
    pinyinInput: 'jiao',
    contextSentence: '你好，你_____什么名字？',
    targetChar: '叫',
    targetMeaning: 'Llamarse / Gritar (asociado a la voz)',
    targetRadical: '口',
    targetRadicalMeaning: 'Radical Boca (口): Se usa para actos orales y sonidos.',
    candidates: [
      {
        char: '叫',
        meaning: 'Llamarse',
        radical: '口',
        radicalMeaning: 'Boca (oral)',
        isCorrect: true
      },
      {
        char: '较',
        meaning: 'Comparar / Más bien',
        radical: '车',
        radicalMeaning: 'Vehículo / Coche (车): Se relaciona con carros o transportes, no con nombres.',
        isCorrect: false
      },
      {
        char: '焦',
        meaning: 'Quemado / Ansioso',
        radical: '灬',
        radicalMeaning: 'Fuego (灬): Relacionado con calor o quemarse.',
        isCorrect: false
      },
      {
        char: '教',
        meaning: 'Enseñar',
        radical: '攵',
        radicalMeaning: 'Acción / Golpear levemente.',
        isCorrect: false
      }
    ]
  },
  {
    id: 'ime-2',
    pinyinInput: 'ta',
    contextSentence: '_____是我的妈妈，她是医生。',
    targetChar: '她',
    targetMeaning: 'Ella (pronombre femenino)',
    targetRadical: '女',
    targetRadicalMeaning: 'Radical Mujer (女): Indica género femenino.',
    candidates: [
      {
        char: '他',
        meaning: 'Él (masculino)',
        radical: '亻',
        radicalMeaning: 'Radical Persona (亻): Se usa para pronombres masculinos o neutros.',
        isCorrect: false
      },
      {
        char: '她',
        meaning: 'Ella (femenino)',
        radical: '女',
        radicalMeaning: 'Radical Mujer (女): Imprescindible para referirse a la madre.',
        isCorrect: true
      },
      {
        char: '它',
        meaning: 'Ello / Animal u objeto',
        radical: '宀',
        radicalMeaning: 'Techo (宀): Utilizado para animales y cosas inanimadas.',
        isCorrect: false
      },
      {
        char: '踏',
        meaning: 'Pisar',
        radical: '⻊',
        radicalMeaning: 'Pie (⻊): Acción física de dar un paso.',
        isCorrect: false
      }
    ]
  },
  {
    id: 'ime-3',
    pinyinInput: 'zuo',
    contextSentence: '你在_____什么工作？',
    targetChar: '做',
    targetMeaning: 'Hacer / Elaborar / Realizar un trabajo',
    targetRadical: '亻',
    targetRadicalMeaning: 'Radical Persona (亻): Acción realizada activamente por un humano.',
    candidates: [
      {
        char: '坐',
        meaning: 'Sentarse',
        radical: '土',
        radicalMeaning: 'Tierra (土): Dos personas sentadas sobre la tierra.',
        isCorrect: false
      },
      {
        char: '座',
        meaning: 'Asiento / Lugar',
        radical: '广',
        radicalMeaning: 'Edificio / Refugio (广): Un asiento bajo un techo.',
        isCorrect: false
      },
      {
        char: '做',
        meaning: 'Hacer / Ejercer',
        radical: '亻',
        radicalMeaning: 'Persona (亻): Hacer una tarea, comida o profesión.',
        isCorrect: true
      },
      {
        char: '昨',
        meaning: 'Ayer',
        radical: '日',
        radicalMeaning: 'Sol / Día (日): Relacionado con fechas pasadas.',
        isCorrect: false
      }
    ]
  }
];
