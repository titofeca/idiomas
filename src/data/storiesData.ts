import { GraduatedStory } from '../types';

export const GRADUATED_STORIES: GraduatedStory[] = [
  // Historia Chino HSK 3.0 Nivel 1 (Fase 1 y 2 integrada)
  {
    id: 'story-zh-1',
    lang: 'zh',
    title: '我的小猫叫“米粒” (Mi gatito se llama “Granito de Arroz”)',
    level: 'HSK 3.0 Nivel 1 (Elemental)',
    targetNewWords: ['米粒 (Mǐlì)', '喜欢 (Xǐhuan)', '水 (Shuǐ)'],
    paragraphs: [
      {
        text: '你好！我是李明。我是学生。',
        pinyin: 'Nǐ hǎo! Wǒ shì Lǐ Míng. Wǒ shì xuésheng.',
        translation: '¡Hola! Soy Li Ming. Soy estudiante.'
      },
      {
        text: '我有一只小猫。它叫“米粒”。',
        pinyin: 'Wǒ yǒu yì zhī xiǎomāo. Tā jiào "Mǐlì".',
        translation: 'Tengo un gatito. Se llama "Granito de Arroz".'
      },
      {
        text: '它很小，也很可爱。米粒喜欢喝水，也喜欢吃鱼。',
        pinyin: 'Tā hěn xiǎo, yě hěn kě’ài. Mǐlì xǐhuan hē shuǐ, yě xǐhuan chī yú.',
        translation: 'Es muy pequeño y también muy adorable. A Mǐlì le gusta beber agua y también comer pescado.'
      },
      {
        text: '这是我的好朋友！今天我们都很高兴。',
        pinyin: 'Zhè shì wǒ de hǎo péngyou! Jīntiān wǒmen dōu hěn gāoxìng.',
        translation: '¡Este es mi buen amigo! Hoy todos estamos muy felices.'
      }
    ],
    comprehensionQuiz: [
      {
        question: '¿Cómo se llama el gato de Li Ming?',
        options: ['大山 (Dàshān)', '米粒 (Mǐlì)', '小鱼 (Xiǎoyú)'],
        correctIndex: 1,
        explanation: 'En el texto dice: 它叫“米粒” (Se llama Mili).'
      },
      {
        question: '¿Qué le gusta beber al gatito?',
        options: ['茶 (Té)', '牛奶 (Leche)', '水 (Agua)'],
        correctIndex: 2,
        explanation: 'El texto indica: 米粒喜欢喝水 (A Mili le gusta beber agua).'
      }
    ]
  },
  // Historia Inglés B1+/B2 (Aventuras y retos adolescentes)
  {
    id: 'story-en-1',
    lang: 'en',
    title: 'The Secret Room in the Old Lighthouse',
    level: 'B1+/B2 ESO & Teen Adventure',
    targetNewWords: ['Figure out', 'Pull off', 'Spur of the moment'],
    paragraphs: [
      {
        text: 'Last Saturday, Lucas and his father decided to explore the coastal trails on the spur of the moment. The storm from the previous night had cleared up, leaving behind a crisp ocean breeze.',
        translation: 'El sábado pasado, Lucas y su padre decidieron explorar los senderos de la costa de forma espontánea. La tormenta de la noche anterior había escampado, dejando tras de sí una fresca brisa marina.'
      },
      {
        text: 'Near the rocky cliff stood the Victorian lighthouse. While taking photos, Lucas spotted an iron door half-hidden under wild ivy. There was an ancient lock with a four-symbol combination code.',
        translation: 'Cerca del acantilado rocoso se alzaba el faro victoriano. Mientras hacía fotos, Lucas divisó una puerta de hierro semioculta bajo hiedra silvestre. Había una cerradura antigua con una clave de cuatro símbolos.'
      },
      {
        text: '“Dad, give me five minutes to figure out the sequence,” Lucas whispered. He noticed the engraved numbers matched the compass bearings on the lighthouse wall.',
        translation: '“Papá, dame cinco minutos para descifrar la secuencia”, susurró Lucas. Se dio cuenta de que los números grabados coincidían con las orientaciones de la brújula en la pared del faro.'
      },
      {
        text: 'With a heavy click, the lock gave way! They had actually pulled off opening the forgotten archive room, uncovering maps drawn over a century ago.',
        translation: '¡Con un chasquido rotundo, la cerradura cedió! Realmente habían conseguido abrir la sala de archivos olvidada, descubriendo mapas dibujados hace más de un siglo.'
      }
    ],
    comprehensionQuiz: [
      {
        question: 'How did Lucas and his father decide to go on the trip?',
        options: ['They planned it for months', 'On the spur of the moment', 'Their school teacher organized it'],
        correctIndex: 1,
        explanation: '"On the spur of the moment" means spontaneously without prior planning.'
      },
      {
        question: 'What clue helped Lucas open the combination lock?',
        options: ['A key in his backpack', 'Compass bearings on the lighthouse wall', 'A password on his phone'],
        correctIndex: 1,
        explanation: 'He noticed the numbers corresponded to the compass bearings on the lighthouse wall.'
      }
    ]
  }
];
