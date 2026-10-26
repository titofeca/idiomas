import { DailyTopic } from '../types';

export const DAILY_TOPICS: DailyTopic[] = [
  // ==========================================
  // --- TEMAS EN INGLÉS (LOMLOE & B1/B2/C1) ---
  // ==========================================
  {
    id: 'en-gaming',
    lang: 'en',
    level: 'B1 - B2 (Adolescentes y Nativos)',
    category: 'Cultura & Videojuegos',
    title: 'Gaming, Streaming & Discord Talk',
    subtitle: 'Comunícate como un jugador nativo sin sonar a libro de texto',
    emoji: '🎮',
    description: 'Aprende a coordinar partidas cooperativas, dar avisos rápidos, quejarte del lag con gracia y usar expresiones reales de Discord.',
    estimatedMinutes: 45,
    vocabulary: [
      {
        term: 'Carry the team',
        pinyinOrIpa: '/ˈkæri ðə tiːm/',
        translation: 'Echarse el equipo a las espaldas / Ganar la partida tú solo',
        example: 'You totally carried our team in that last round, nice clutch!',
        exampleTranslation: 'Te echaste el equipo a las espaldas en la última ronda, ¡qué buena jugada!'
      },
      {
        term: 'Lag out',
        pinyinOrIpa: '/læɡ aʊt/',
        translation: 'Tener una caída brutal de conexión',
        example: 'Wait for me, I’m lagging out so bad right now.',
        exampleTranslation: 'Espérame, se me está lagueando muchísimo ahora mismo.'
      },
      {
        term: 'Call it a day',
        pinyinOrIpa: '/kɔːl ɪt ə deɪ/',
        translation: 'Dar por terminada la sesión por hoy',
        example: 'We’ve won three matches in a row, let’s call it a day on a high note!',
        exampleTranslation: 'Hemos ganado tres seguidas, ¡vamos a dejarlo por hoy por todo lo alto!'
      },
      {
        term: 'Figure out',
        pinyinOrIpa: '/ˈfɪɡjər aʊt/',
        translation: 'Descifrar la estrategia / Encontrar la solución',
        example: 'Give me a minute to figure out their boss strategy.',
        exampleTranslation: 'Dame un minuto para descifrar la estrategia del jefe.'
      },
      {
        term: 'Pull off',
        pinyinOrIpa: '/pʊl ɒf/',
        translation: 'Conseguir algo épico e inesperado',
        example: 'How on earth did you pull off that shot?',
        exampleTranslation: '¿Cómo demonios lograste ese tiro?'
      }
    ],
    keyGrammarRule: {
      title: 'Imperativos cortos y phrasal verbs en tiempo real',
      explanation: 'En situaciones dinámicas, los angloparlantes casi nunca usan frases largas. Prefieren Phrasal Verbs de 2 palabras: "Back up" (retrocede), "Watch out" (cuidado), "Push now" (avancemos ya).',
      sample: 'Don’t push yet, wait until my cooldown is ready!'
    },
    botRoleplay: {
      botPersona: 'Alex (Gamer británico en Discord)',
      scenarioContext: 'Estás conectado en Discord con Alex jugando en cooperativo. Te está pidiendo coordinar la siguiente partida.',
      openingMessage: {
        text: 'Hey mate! Ready for the next round? What role do you want to play today?',
        translation: '¡Ey amigo! ¿Listo para la siguiente ronda? ¿Qué rol quieres jugar hoy?',
        suggestedResponses: [
          'I can carry on attack, you cover my back.',
          'Let’s play defensively, I was lagging a bit earlier.',
          'Ready! Let’s figure out a good strategy first.'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['carry', 'attack', 'cover'],
          botResponse: 'Awesome! I’ll pick support and heal you. Just let me know if you need backup near the bridge.',
          translation: '¡Genial! Yo elijo soporte y te curo. Solo avísame si necesitas refuerzos cerca del puente.',
          feedbackNote: '¡Bien usado "carry"! Demuestra dominio del vocabulario nativo de juego.',
          nextSuggestions: [
            'Sounds like a plan. Watch out for snipers!',
            'If we pull this off, it will be epic.',
            'Let’s push together when you are ready.'
          ]
        },
        {
          triggerUserContains: ['lag', 'defensive', 'earlier'],
          botResponse: 'No worries at all! Let’s take it slow and hold the base. Tell me if the ping gets worse.',
          translation: '¡Sin problema! Vamos con calma y defendemos la base. Dime si el ping empeora.',
          feedbackNote: 'Excelente respuesta natural. "No worries at all" es la réplica más habitual en UK.',
          nextSuggestions: [
            'Thanks mate. Ping is looking stable now.',
            'Let’s hold here and wait for them to make a mistake.',
            'Good call. I see an enemy coming!'
          ]
        }
      ]
    }
  },
  {
    id: 'en-travel-coffee',
    lang: 'en',
    level: 'B1 - B2 (Vida Cotidiana)',
    category: 'Viajes & Vida Real',
    title: 'Ordering in a London Café & Local Chat',
    subtitle: 'Pide café y comida con naturalidad y cortesía británica',
    emoji: '☕',
    description: 'Aprende a pedir en una cafetería internacional, preguntar por ingredientes, pedir la cuenta y manejar pequeñas charlas de cortesía.',
    estimatedMinutes: 40,
    vocabulary: [
      {
        term: 'Could I have...',
        pinyinOrIpa: '/kʊd aɪ hæv/',
        translation: '¿Me pondría...? (fórmula educada para pedir)',
        example: 'Could I have a flat white and a warm croissant, please?',
        exampleTranslation: '¿Me pondría un café flat white y un croissant caliente, por favor?'
      },
      {
        term: 'For here or to go?',
        pinyinOrIpa: '/fɔː hɪər ɔː tuː ɡəʊ/',
        translation: '¿Para tomar aquí o para llevar?',
        example: 'Are you having that to go, or eating in today?',
        exampleTranslation: '¿Lo va a tomar para llevar o aquí hoy?'
      },
      {
        term: 'Keep the change',
        pinyinOrIpa: '/kiːp ðə tʃeɪndʒ/',
        translation: 'Quédese con el cambio',
        example: 'Here is twenty pounds, please keep the change.',
        exampleTranslation: 'Aquí tiene veinte libras, quédese con el cambio por favor.'
      }
    ],
    keyGrammarRule: {
      title: 'Suavizadores de cortesía británicos',
      explanation: 'Nunca uses "I want coffee". Usa "Could I please get..." o "I’d love to have...". Añadir "please" al pedir y "cheers/thanks" al recibir es básico.',
      sample: 'Could I please get a hot chocolate with oat milk?'
    },
    botRoleplay: {
      botPersona: 'Oliver (Barista en Covent Garden)',
      scenarioContext: 'Acabas de entrar en una animada cafetería londinense. Es tu turno en la barra.',
      openingMessage: {
        text: 'Morning! Welcome in. What can I get started for you today?',
        translation: '¡Buenos días! Bienvenido. ¿Qué te voy preparando hoy?',
        suggestedResponses: [
          'Good morning! Could I please have a cappuccino and a muffin?',
          'Hi! Just an iced tea for takeaway, please.',
          'Hello! Do you have any plant-based milk options?'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['cappuccino', 'muffin', 'could i'],
          botResponse: 'Spot on! Would you like the muffin warmed up, and is that to have here or takeaway?',
          translation: '¡Perfecto! ¿Te gustaría que te caliente el muffin, y es para tomar aquí o para llevar?',
          feedbackNote: 'Muy buena educación usando "Could I please have". "Spot on" significa "exacto/perfecto".',
          nextSuggestions: [
            'To have here, please, and yes, warm it up!',
            'Takeaway, please. I am in a bit of a hurry.',
            'Can I pay by card?'
          ]
        }
      ]
    }
  },
  {
    id: 'en-series-movies',
    lang: 'en',
    level: 'B2 (Fluidez & Ocio)',
    category: 'Entretenimiento & Cine',
    title: 'Series, Spoilers & Plot Twists',
    subtitle: 'Debate tus series y pelis favoritas sin destripar el final',
    emoji: '🎬',
    description: 'Aprende a recomendar series, expresar si un final te decepcionó o te voló la cabeza, y advertir de spoilers.',
    estimatedMinutes: 45,
    vocabulary: [
      {
        term: 'Plot twist',
        pinyinOrIpa: '/plɒt twɪst/',
        translation: 'Giro de guión inesperado',
        example: 'The plot twist at the end of episode five blew my mind!',
        exampleTranslation: '¡El giro de guión al final del quinto capítulo me voló la cabeza!'
      },
      {
        term: 'Spoiler alert',
        pinyinOrIpa: '/ˈspɔɪ.lər əˈlɜːt/',
        translation: 'Aviso de spoiler (revelación de trama)',
        example: 'Spoiler alert! Don’t read the comments if you haven’t seen the season finale.',
        exampleTranslation: '¡Alerta de spoiler! No leas los comentarios si no viste el final de temporada.'
      },
      {
        term: 'Binge-watch',
        pinyinOrIpa: '/bɪndʒ wɒtʃ/',
        translation: 'Hacerse un maratón de capítulos seguidos',
        example: 'I binge-watched the whole season in just one weekend.',
        exampleTranslation: 'Me vi la temporada entera del tirón en solo un fin de semana.'
      },
      {
        term: 'Cliffhanger',
        pinyinOrIpa: '/ˈklɪfˌhæŋ.ər/',
        translation: 'Final abierto de máxima intriga',
        example: 'Leaving the show on such a massive cliffhanger is torture!',
        exampleTranslation: '¡Dejar la serie con un final tan intrigante es una tortura!'
      }
    ],
    keyGrammarRule: {
      title: 'Condicionales mixtos para opinar sobre tramas',
      explanation: 'Para opinar sobre finales de pelis usamos: "If they had done X, it would have been much better" (Si hubieran hecho X, habría sido mucho mejor).',
      sample: 'If the writers hadn’t rushed the ending, the show would be a masterpiece.'
    },
    botRoleplay: {
      botPersona: 'Emma (Crítica juvenil de cine)',
      scenarioContext: 'Estás charlando sobre la serie de moda con Emma a la salida del instituto.',
      openingMessage: {
        text: 'Did you finish watching that new sci-fi mystery series yet? I need to talk about that crazy ending!',
        translation: '¿Te terminaste ya la nueva serie de misterio y ciencia ficción? ¡Necesito hablar de ese final loco!',
        suggestedResponses: [
          'Yes! That plot twist in the final scene completely blew my mind.',
          'No spoilers please! I am still on episode four.',
          'I watched it, but honestly I thought the ending was a bit rushed.'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['plot twist', 'blew my mind', 'final'],
          botResponse: 'Right?! Nobody saw that coming! Who was your favorite character through all the chaos?',
          translation: '¡¿Verdad?! ¡Nadie lo vio venir! ¿Quién fue tu personaje favorito entre todo ese caos?',
          feedbackNote: '¡Excelente uso de "blew my mind"! Suena 100% nativo.',
          nextSuggestions: [
            'The detective was the best, he figured everything out.',
            'The villain had a really compelling backstory.',
            'I cannot wait for season two!'
          ]
        }
      ]
    }
  },
  {
    id: 'en-ai-tech',
    lang: 'en',
    level: 'B2 - C1 (Tecnología & Debate)',
    category: 'Innovación & Futuro',
    title: 'AI, Robots & The Future of Jobs',
    subtitle: 'Debate sobre inteligencia artificial y ética tecnológica',
    emoji: '🤖',
    description: 'Aprende a estructurar argumentos de alto nivel sobre inteligencia artificial, automatización y el impacto de la tecnología en nuestras vidas.',
    estimatedMinutes: 50,
    vocabulary: [
      {
        term: 'Double-edged sword',
        pinyinOrIpa: '/ˌdʌb.əl.edʒd ˈsɔːd/',
        translation: 'Arma de doble filo (ventajas con riesgos)',
        example: 'Generative AI is a double-edged sword: huge productivity, but ethical risks.',
        exampleTranslation: 'La IA generativa es un arma de doble filo: gran productividad, pero riesgos éticos.'
      },
      {
        term: 'Outperform',
        pinyinOrIpa: '/ˌaʊt.pəˈfɔːm/',
        translation: 'Superar en rendimiento o capacidad',
        example: 'In certain pattern recognition tasks, neural networks outperform humans.',
        exampleTranslation: 'En ciertas tareas de reconocimiento de patrones, las redes neuronales superan a los humanos.'
      },
      {
        term: 'By and large',
        pinyinOrIpa: '/baɪ ənd lɑːdʒ/',
        translation: 'En términos generales / A grandes rasgos',
        example: 'By and large, technology has automated repetitive tasks.',
        exampleTranslation: 'A grandes rasgos, la tecnología ha automatizado las tareas repetitivas.'
      }
    ],
    keyGrammarRule: {
      title: 'Conectores formales de contraste en debates C1',
      explanation: 'Para sonar maduro y avanzado, sustituye "but" por conectores como: "Whereas" (mientras que), "Nevertheless" (no obstante), "On the flip side" (por otra parte).',
      sample: 'AI accelerates medicine; nevertheless, ethical regulation remains crucial.'
    },
    botRoleplay: {
      botPersona: 'Dr. Evelyn Vance (Investigadora de IA en Cambridge)',
      scenarioContext: 'Participas en un panel juvenil sobre el futuro de la tecnología y te preguntan tu opinión sobre la IA en la escuela.',
      openingMessage: {
        text: 'Welcome to our panel discussion. Do you think schools should encourage AI tutors, or will they make students lazier?',
        translation: 'Bienvenidos al debate. ¿Crees que las escuelas deberían fomentar los tutores de IA, o harán a los alumnos más perezosos?',
        suggestedResponses: [
          'In my opinion, AI is a double-edged sword: it helps personalize study if used responsibly.',
          'I believe human teachers are irreplaceable, but AI can automate routine tasks.',
          'By and large, it depends on whether students use it to think or just copy answers.'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['double-edged', 'responsibly', 'personalize'],
          botResponse: 'Precisely articulated! Personalization allows each student to learn at their own pace without frustration. How would you prevent cheating?',
          translation: '¡Exactamente articulado! La personalización permite a cada alumno aprender a su ritmo sin frustración. ¿Cómo evitarías las trampas?',
          feedbackNote: 'Nivel C1 brillante usando "double-edged sword" y "responsibly".',
          nextSuggestions: [
            'By testing oral understanding and critical reasoning instead of memorization.',
            'Teachers should focus on projects where process matters more than the final text.',
            'Ethics should be taught in school from an early age.'
          ]
        }
      ]
    }
  },
  {
    id: 'en-airport-survival',
    lang: 'en',
    level: 'B1+ (Viajes & Emergencias)',
    category: 'Viajes & Situaciones Reales',
    title: 'Heathrow Airport: Lost Luggage & Boarding',
    subtitle: 'Resuelve imprevistos, retrasos y trámites en el aeropuerto',
    emoji: '✈️',
    description: 'Aprende a preguntar por tu puerta de embarque, reclamar una maleta extraviada y pedir ayuda al personal de aduanas con calma y precisión.',
    estimatedMinutes: 40,
    vocabulary: [
      {
        term: 'Baggage claim',
        pinyinOrIpa: '/ˈbæɡ.ɪdʒ kleɪm/',
        translation: 'Recogida de equipajes / Cinta de maletas',
        example: 'Our flight landed, let’s head over to baggage claim carousel four.',
        exampleTranslation: 'Nuestro vuelo ha aterrizado, vamos a la recogida de equipajes, cinta cuatro.'
      },
      {
        term: 'Connecting flight',
        pinyinOrIpa: '/kəˈnek.tɪŋ flaɪt/',
        translation: 'Vuelo de conexión / Enlace',
        example: 'I have a connecting flight to New York in fifty minutes.',
        exampleTranslation: 'Tengo un vuelo de conexión a Nueva York en cincuenta minutos.'
      },
      {
        term: 'Delayed / Postponed',
        pinyinOrIpa: '/dɪˈleɪd / pəʊstˈpəʊnd/',
        translation: 'Retrasado / Pospuesto',
        example: 'Due to severe fog over the runway, boarding has been postponed.',
        exampleTranslation: 'Debido a la densa niebla sobre la pista, el embarque ha sido pospuesto.'
      }
    ],
    keyGrammarRule: {
      title: 'Voz pasiva en avisos públicos formales',
      explanation: 'En aeropuertos y trenes siempre escucharás la voz pasiva: "Passengers are requested to...", "Flight 402 has been delayed", en vez de formas activas.',
      sample: 'All passengers for Gate 14 are required to show photo identification.'
    },
    botRoleplay: {
      botPersona: 'Sarah (Agente de atención al pasajero en Heathrow)',
      scenarioContext: 'Tu maleta no ha salido en la cinta de equipajes y tienes que poner una reclamación antes de salir de la terminal.',
      openingMessage: {
        text: 'Good afternoon. How can I assist you with your flight today?',
        translation: 'Buenas tardes. ¿En qué puedo ayudarle hoy con su vuelo?',
        suggestedResponses: [
          'Hello. My suitcase hasn’t appeared on carousel 3, could you help me track it?',
          'Excuse me, I have a tight connecting flight to catch in 40 minutes.',
          'Hi, my flight was delayed and I missed my coach to central London.'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['suitcase', 'carousel', 'track', 'baggage'],
          botResponse: 'I am so sorry to hear that. Could you please show me your luggage tag receipt and describe the color of the bag?',
          translation: 'Siento mucho oír eso. ¿Podría mostrarme el resguardo de facturación y describir el color de la maleta?',
          feedbackNote: 'Muy buena educación al formular la petición sin perder la calma.',
          nextSuggestions: [
            'Here is my ticket receipt. It is a medium dark blue hard-shell suitcase.',
            'It has a bright yellow luggage strap around it.',
            'Will it be delivered to my hotel once found?'
          ]
        }
      ]
    }
  },
  {
    id: 'en-football-champions',
    lang: 'en',
    level: 'B1 - B2 (Deportes & Pique)',
    category: 'Deportes & Pique Sano',
    title: 'Premier League & Champions Debate',
    subtitle: 'Comenta partidos, goles y polémicas arbitrales con fluidez',
    emoji: '⚽',
    description: 'Aprende a discutir jugadas, celebrar golazos, debatir decisiones del VAR y comparar jugadores como los comentaristas de la BBC o Sky Sports.',
    estimatedMinutes: 40,
    vocabulary: [
      {
        term: 'Top corner / Top bins',
        pinyinOrIpa: '/tɒp ˈkɔː.nər/',
        translation: 'Por toda la escuadra',
        example: 'What a strike from outside the box! Right into the top corner!',
        exampleTranslation: '¡Vaya trallazo desde fuera del área! ¡Directo a la escuadra!'
      },
      {
        term: 'Clean sheet',
        pinyinOrIpa: '/kliːn ʃiːt/',
        translation: 'Portería a cero / Sin encajar gol',
        example: 'Our goalkeeper made five crucial saves to keep a clean sheet.',
        exampleTranslation: 'Nuestro portero hizo cinco paradas cruciales para mantener la portería a cero.'
      },
      {
        term: 'Underdog',
        pinyinOrIpa: '/ˈʌn.də.dɒɡ/',
        translation: 'Equipo no favorito que da la sorpresa',
        example: 'Everyone loves seeing an underdog team knock out the defending champions.',
        exampleTranslation: 'A todo el mundo le gusta ver al equipo humilde eliminar a los vigentes campeones.'
      }
    ],
    keyGrammarRule: {
      title: 'Exclamaciones enfáticas nativas con "What a..." y "How..."',
      explanation: 'Para enfatizar emociones en deportes usamos: "What a strike!" (¡Menudo golazo!), "How unlucky!" (¡Qué mala pata!), en vez de frases neutras.',
      sample: 'What an unbelievable save in the 92nd minute!'
    },
    botRoleplay: {
      botPersona: 'Jack (Aficionado británico de fútbol)',
      scenarioContext: 'Acaba de terminar la final de la Champions y estás debatiendo el resultado con Jack en una terraza.',
      openingMessage: {
        text: 'Did you see that 90th-minute goal?! Unbelievable match! Do you think the referee made the right call on that penalty?',
        translation: '¡¿Viste ese gol en el minuto 90?! ¡Partido increíble! ¿Crees que el árbitro acertó con ese penalti?',
        suggestedResponses: [
          'What a strike! It went straight into the top corner!',
          'Honestly, it was never a penalty. The defender barely touched him.',
          'The underdog played with much more heart and deserved to win.'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['top corner', 'strike', 'goal'],
          botResponse: 'Absolute worldie of a goal! The keeper didn’t even stand a chance. Who was your Man of the Match?',
          translation: '¡Un auténtico golazo de otro planeta! El portero no tuvo ni la más mínima opción. ¿Quién fue para ti el mejor del partido?',
          feedbackNote: '"Absolute worldie" es slang futbolístico británico de élite para definir un gol de antología.',
          nextSuggestions: [
            'The midfield playmaker controlled the entire tempo.',
            'The goalkeeper kept them in the game with three miracle saves.',
            'Both teams gave everything, what a final!'
          ]
        }
      ]
    }
  },

  // ==========================================
  // --- TEMAS EN CHINO MANDARÍN (HSK 3.0) ---
  // ==========================================
  {
    id: 'zh-zero-survival',
    lang: 'zh',
    level: 'Principiante Absoluto (Nivel 0)',
    category: 'Desde Cero & Tonos',
    title: '🇨🇳 Chino desde Cero: Primeras 5 Palabras y Tonos',
    subtitle: 'Aprende a decir ¡Hola!, Gracias, Adiós y a dominar los 4 tonos cantados',
    emoji: '🌱',
    description: 'Perfecto para empezar hoy sin saber nada. Domina las 5 expresiones esenciales que usan 1.400 millones de personas y descubre cómo suenan los 4 tonos como notas musicales.',
    estimatedMinutes: 20,
    vocabulary: [
      {
        term: '你好 (Nǐ hǎo)',
        pinyinOrIpa: 'Nǐ hǎo (pronunciado: ni jao)',
        translation: '¡Hola! (Nǐ = tú, Hǎo = bien/bueno)',
        example: '你好！我是学生。',
        exampleTranslation: '¡Hola! Soy estudiante.'
      },
      {
        term: '谢谢 (Xièxie)',
        pinyinOrIpa: 'Xièxie (pronunciado: sié-sie)',
        translation: '¡Muchas gracias!',
        example: '太好了，谢谢你！',
        exampleTranslation: '¡Qué bien, muchas gracias!'
      },
      {
        term: '不客气 (Bú kèqi)',
        pinyinOrIpa: 'Bú kèqi (pronunciado: bu ke-chi)',
        translation: 'De nada / No hay de qué',
        example: '不客气，我们是朋友！',
        exampleTranslation: '¡De nada, somos amigos!'
      },
      {
        term: '再见 (Zàijiàn)',
        pinyinOrIpa: 'Zàijiàn (pronunciado: tsai-tien)',
        translation: '¡Adiós / Hasta la vista!',
        example: '明天见，再见！',
        exampleTranslation: '¡Hasta mañana, adiós!'
      },
      {
        term: '好的 (Hǎo de)',
        pinyinOrIpa: 'Hǎo de (pronunciado: jao de)',
        translation: 'De acuerdo / Vale / Está bien',
        example: '好的，没问题！',
        exampleTranslation: '¡De acuerdo, sin problema!'
      }
    ],
    keyGrammarRule: {
      title: 'Los 4 tonos como notas musicales',
      explanation: 'En chino la melodía cambia el significado: 1º Tono (ˉ) agudo sostenido como cantar "aaa". 2º Tono (ˊ) sube como preguntar "¿¿qué??". 3º Tono (ˇ) baja y sube como un bostezo. 4º Tono (ˋ) baja tajante como un "¡NO!".',
      sample: 'Mā (mamá ˉ), Má (cáñamo ˊ), Mǎ (caballo ˇ), Mà (reñir ˋ).'
    },
    botRoleplay: {
      botPersona: 'Maestro Long (Tutor de Chino desde Cero)',
      scenarioContext: 'El Maestro Long te da la bienvenida a tu primerísimo día de chino mandarín con una sonrisa.',
      openingMessage: {
        text: '你好！(Nǐ hǎo!) ¡Bienvenido a tu primer día de chino! Para empezar, repite conmigo: "Nǐ hǎo".',
        pinyin: 'Nǐ hǎo! Wǒ shì Lóng Lǎoshī.',
        translation: '¡Hola! Soy el Maestro Long. Para empezar, repite conmigo: "Nǐ hǎo".',
        suggestedResponses: [
          '你好！ (Nǐ hǎo! - ¡Hola!)',
          '你好，老师！ (Nǐ hǎo, lǎoshī! - ¡Hola profesor!)',
          '好的！ (Hǎo de! - ¡Vale!)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['ni hao', 'nǐ hǎo', '你好', 'hola', 'nihao'],
          botResponse: '太棒了！(Tài bàng le!) ¡Tu pronunciación de "Nǐ hǎo" ha sido impecable! Ahora prueba a decir "Xièxie" (gracias).',
          pinyin: 'Tài bàng le! Xiànzài shìshì "Xièxie".',
          translation: '¡Fantástico! Tu pronunciación de "Nǐ hǎo" ha sido impecable. Ahora prueba a decir "Xièxie" (gracias).',
          feedbackNote: '¡Excelente control del 3er tono! Al juntar dos terceros tonos, el primero sube ligeramente a 2º tono de forma natural.',
          nextSuggestions: [
            '谢谢！ (Xièxie! - ¡Gracias!)',
            '谢谢老师！ (Xièxie lǎoshī! - ¡Gracias profesor!)',
            '不客气 (Bú kèqi - De nada)'
          ]
        },
        {
          triggerUserContains: ['xie', 'xièxie', 'xiexie', '谢谢', 'gracias'],
          botResponse: '很好！(Hěn hǎo!) "Xièxie" perfecto. Y si alguien te da las gracias, puedes responder "Bú kèqi" (de nada).',
          pinyin: 'Hěn hǎo! Nǐ kěyǐ shuō "Bú kèqi".',
          translation: '¡Muy bien! "Xièxie" perfecto. Y si alguien te da las gracias, puedes responder "Bú kèqi" (de nada).',
          feedbackNote: 'Tono 4º descendente firme muy bien marcado.',
          nextSuggestions: [
            '不客气 (Bú kèqi - De nada)',
            '再见！ (Zàijiàn! - ¡Adiós!)',
            '好的！ (Hǎo de! - ¡Vale!)'
          ]
        },
        {
          triggerUserContains: ['zaijian', 'zàijiàn', '再见', 'adios', 'adiós'],
          botResponse: '再见！(Zàijiàn!) ¡Has completado tus primeras expresiones básicas de chino! ¡Qué gran comienzo!',
          pinyin: 'Zàijiàn! Míngtiān jiàn!',
          translation: '¡Adiós! ¡Hasta mañana! Has completado tus primeras expresiones básicas de chino.',
          feedbackNote: '¡Lección 0 completada con éxito!',
          nextSuggestions: [
            '再见！ (Zàijiàn!)',
            '明天见！ (Míngtiān jiàn! - ¡Hasta mañana!)'
          ]
        }
      ]
    }
  },
  {
    id: 'zh-meeting-friends',
    lang: 'zh',
    level: 'HSK 3.0 Nivel 1 (Fase 1 y 2)',
    category: 'Conversación Diaria',
    title: 'Conociendo a un nuevo amigo en Pekín',
    subtitle: 'Preséntate, pregunta nombres y habla de lo que estudias',
    emoji: '👋',
    description: 'Aprende a romper el hielo, decir tu nombre, de qué país vienes y entablar tu primera amistad natural en chino mandarín.',
    estimatedMinutes: 40,
    vocabulary: [
      {
        term: '你好！很高兴认识你',
        pinyinOrIpa: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
        translation: '¡Hola! Encantado de conocerte.',
        example: '我是李明，很高兴认识你！',
        exampleTranslation: 'Soy Li Ming, ¡encantado de conocerte!'
      },
      {
        term: '你叫什么名字？',
        pinyinOrIpa: 'Nǐ jiào shénme míngzi?',
        translation: '¿Cómo te llamas?',
        example: '请问，你叫什么名字？',
        exampleTranslation: 'Disculpa, ¿cómo te llamas?'
      },
      {
        term: '我是西班牙人',
        pinyinOrIpa: 'Wǒ shì Xībānyárén.',
        translation: 'Soy español / española.',
        example: '我不是中国人，我是西班牙人。',
        exampleTranslation: 'No soy chino, soy español.'
      },
      {
        term: '你学习什么？',
        pinyinOrIpa: 'Nǐ xuéxí shénme?',
        translation: '¿Qué estudias?',
        example: '我学习汉语和英语。',
        exampleTranslation: 'Estudio chino e inglés.'
      }
    ],
    keyGrammarRule: {
      title: 'Estructura Sujeto + 是 (shì) + Sustantivo',
      explanation: 'El verbo 是 (shì) equivale a "ser". Nunca cambia de forma según la persona: 我是 (yo soy), 你是 (tú eres), 他是 (él es). Para nacionalidades solo añades 人 (rén, persona) detrás del país.',
      sample: '我是学生，他也是学生。 (Yo soy estudiante, él también es estudiante).'
    },
    botRoleplay: {
      botPersona: 'Wang Mei (Estudiante en Pekín)',
      scenarioContext: 'Estás en una sala de intercambio de idiomas y Wang Mei se acerca con una sonrisa para saludarte.',
      openingMessage: {
        text: '你好！很高兴认识你。我叫王美。你叫什么名字？',
        pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ. Wǒ jiào Wáng Měi. Nǐ jiào shénme míngzi?',
        translation: '¡Hola! Encantado de conocerte. Me llamo Wang Mei. ¿Cómo te llamas tú?',
        suggestedResponses: [
          '你好！我叫卢卡斯，我是西班牙人。 (Nǐ hǎo! Wǒ jiào Lúkǎsī, wǒ shì Xībānyárén.)',
          '你好王美！我也很高兴认识你。 (Nǐ hǎo Wáng Měi! Wǒ yě hěn gāoxìng rènshi nǐ.)',
          '你好，我是学生，我学习汉语。 (Nǐ hǎo, wǒ shì xuésheng, wǒ xuéxí hànyǔ.)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['西班牙', '叫', '卢卡斯', '我是'],
          botResponse: '哇，你是西班牙人！你的汉语说得很好！你喜欢中国菜吗？',
          pinyin: 'Wā, nǐ shì Xībānyárén! Nǐ de hànyǔ shuō de hěn hǎo! Nǐ xǐhuan Zhōngguó cài ma?',
          translation: '¡Guau, eres español! ¡Tu chino suena muy bien! ¿Te gusta la comida china?',
          feedbackNote: '¡Excelente uso de la estructura 我叫 y 我是! El interlocutor nativo elogia tu pronunciación.',
          nextSuggestions: [
            '我很喜欢中国菜，很好吃！ (Wǒ hěn xǐhuan Zhōngguó cài, hěn hǎochī!)',
            '我喜欢吃饺子和米饭。 (Wǒ xǐhuan chī jiǎozi hé mǐfàn.)',
            '太好了，我们一起去喝茶吧！ (Tài hǎo le, wǒmen yìqǐ qù hē chá ba!)'
          ]
        }
      ]
    }
  },
  {
    id: 'zh-restaurant-food',
    lang: 'zh',
    level: 'HSK 3.0 Nivel 1 - 2',
    category: 'Comida & Transacciones',
    title: 'Pidiendo comida en un restaurante tradicional',
    subtitle: 'Aprende a pedir platos, bebidas y preguntar si pica',
    emoji: '🥢',
    description: 'Aprende a llamar al camarero con respeto (服务员), pedir platos populares, pedir agua o té y pedir la cuenta.',
    estimatedMinutes: 45,
    vocabulary: [
      {
        term: '服务员，请点菜',
        pinyinOrIpa: 'Fúwùyuán, qǐng diǎncài.',
        translation: '¡Camarero, por favor para pedir!',
        example: '服务员，我们要两杯水。',
        exampleTranslation: 'Camarero, queremos dos vasos de agua.'
      },
      {
        term: '这个辣不辣？',
        pinyinOrIpa: 'Zhège là bú là?',
        translation: '¿Esto pica o no pica? (Pregunta A-not-A)',
        example: '我不吃辣，这个菜辣吗？',
        exampleTranslation: 'No como picante, ¿este plato pica?'
      },
      {
        term: '买单 / 结账',
        pinyinOrIpa: 'Mǎidān / Jiézhàng',
        translation: 'La cuenta, por favor',
        example: '服务员，买单，可以微信支付吗？',
        exampleTranslation: 'Camarero, la cuenta, ¿se puede pagar con WeChat?'
      }
    ],
    keyGrammarRule: {
      title: 'Preguntas con estructura A-not-A (ej. 辣不辣)',
      explanation: 'En chino mandarín oral, en vez de usar 吗 (ma), es súper común y natural repetir el adjetivo o verbo en positivo y negativo: 好不好 (¿bueno o no?), 去不去 (¿vas o no vas?), 辣不辣 (¿pica o no pica?).',
      sample: '你饿不饿？我们去吃面条吧。 (¿Tienes hambre o no? Vamos a comer tallarines).'
    },
    botRoleplay: {
      botPersona: 'Camarero Li en Pekín',
      scenarioContext: 'Estás sentado en un restaurante de tallarines y el camarero se acerca con el menú en la mano.',
      openingMessage: {
        text: '欢迎光临！两位吗？请问想吃点什么？',
        pinyin: 'Huānyíng guānglín! Liǎng wèi ma? Qǐngwèn xiǎng chī diǎn shénme?',
        translation: '¡Bienvenidos! ¿Mesa para dos? Disculpe, ¿qué les apetece comer?',
        suggestedResponses: [
          '服务员，我们要一碗牛肉面。 (Fúwùyuán, wǒmen yào yì wǎn niúròumiàn.)',
          '请问，这个牛肉面辣不辣？ (Qǐngwèn, zhège niúròumiàn là bú là?)',
          '请给我们两杯热茶，谢谢！ (Qǐng gěi wǒmen liǎng bēi rè chá, xièxie!)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['辣', '牛肉面', '吃'],
          botResponse: '这个牛肉面有一点点辣，如果不吃辣，我可以让师傅不放辣椒。还要别的吗？',
          pinyin: 'Zhège niúròumiàn yǒu yìdiǎndiǎn là, rúguǒ bù chī là, wǒ kěyǐ ràng shīfu bú fàng làjiāo. Hái yào bié de ma?',
          translation: 'Este plato pica un poquito. Si no come picante, puedo pedirle al cocinero que no le ponga guindilla. ¿Desean algo más?',
          feedbackNote: '¡Genial! Usar "辣不辣" suena 100% natural y nativo.',
          nextSuggestions: [
            '太好了，请不要放辣椒！ (Tài hǎo le, qǐng bú yào fàng làjiāo!)',
            '再要一个拍黄瓜，谢谢！ (Zài yào yí gè pāi huángguā, xièxie!)',
            '没有了，就这些，谢谢！ (Méiyǒu le, jiù zhèxiē, xièxie!)'
          ]
        }
      ]
    }
  },
  {
    id: 'zh-shopping-bargaining',
    lang: 'zh',
    level: 'HSK 3.0 Nivel 2',
    category: 'Compras & Dinero',
    title: 'De compras y el arte del regateo en el mercado',
    subtitle: 'Pregunta precios, pide descuentos y paga con el móvil',
    emoji: '🛍️',
    description: 'Aprende a negociar con vendedores en mercados callejeros de Pekín o Shanghái usando expresiones reales de compra y descuento.',
    estimatedMinutes: 45,
    vocabulary: [
      {
        term: '这个多少钱？',
        pinyinOrIpa: 'Zhège duōshao qián?',
        translation: '¿Cuánto cuesta esto?',
        example: '老板，请问这个茶壶多少钱？',
        exampleTranslation: 'Jefe, ¿cuánto cuesta esta tetera por favor?'
      },
      {
        term: '太贵了！便宜一点吧',
        pinyinOrIpa: 'Tài guì le! Piányi yìdiǎn ba.',
        translation: '¡Demasiado caro! Déjamelo un poco más barato.',
        example: '一百块太贵了，五十块可以吗？',
        exampleTranslation: '100 yuanes es muy caro, ¿50 te parece bien?'
      },
      {
        term: '扫码支付',
        pinyinOrIpa: 'Sǎomǎ zhīfù',
        translation: 'Pagar escaneando código QR (con WeChat o Alipay)',
        example: '我扫你的二维码可以吗？',
        exampleTranslation: '¿Puedo escanear tu código QR para pagar?'
      }
    ],
    keyGrammarRule: {
      title: 'Estructura 太...了 (Tài... le) para extremos',
      explanation: 'Para expresar que algo es excesivo o exagerado se envuelve el adjetivo entre 太 y 了: 太贵了 (demasiado caro), 太好了 (¡qué bien!), 太大了 (demasiado grande).',
      sample: '这件衣服太漂亮了，但是有点太贵了。 (Esta ropa es preciosa, pero un poco cara).'
    },
    botRoleplay: {
      botPersona: 'Vendedor Zhang en el Mercado de la Seda',
      scenarioContext: 'Estás mirando una figura artesanal de un dragón chino y el comerciante se acerca con una calculadora.',
      openingMessage: {
        text: '帅哥！来看看，纯手工制作的中国龙，只要两百块！你喜欢吗？',
        pinyin: 'Shuàigē! Lái kànkan, chún shǒugōng zhìzuò de Zhōngguó lóng, zhǐ yào liǎng bǎi kuài! Nǐ xǐhuan ma?',
        translation: '¡Guapo! Ven a ver, dragón chino hecho a mano, ¡solo 200 yuanes! ¿Te gusta?',
        suggestedResponses: [
          '太贵了！便宜一点吧，一百块卖不卖？ (Tài guì le! Piányi yìdiǎn ba, yì bǎi kuài mài bú mài?)',
          '我很喜欢，但是两百块有点贵。 (Wǒ hěn xǐhuan, dànshì liǎng bǎi kuài yǒudiǎn guì.)',
          '可以扫微信支付吗？ (Kěyǐ sǎo Wēixìn zhīfù ma?)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['便宜', '贵', '一百'],
          botResponse: '哎呀，一百块我连本钱都收不回！看你汉语说得这么棒，一百五十块，交个朋友，怎么样？',
          pinyin: 'Āiyā, yì bǎi kuài wǒ lián běnqián dōu shōu bù huí! Kàn nǐ hànyǔ shuō de zhème bàng, yì bǎi wǔshí kuài, jiāo gè péngyou, zěnmeyàng?',
          translation: '¡Ay! ¡A cien no cubro ni el coste! Pero como hablas un chino tan bueno, te lo dejo a 150 por hacernos amigos, ¿te parece?',
          feedbackNote: '¡Magia de regateo lograda! Ha bajado de 200 a 150 gracias a tu soltura.',
          nextSuggestions: [
            '一百二十块，我就马上买！ (Yì bǎi èrshí kuài, wǒ jiù mǎshàng mǎi!)',
            '成交！我扫码付钱。 (Chéngjiāo! Wǒ sǎomǎ fùqián.)',
            '好的，非常感谢老板！ (Hǎo de, fēicháng gǎnxiè lǎobǎn!)'
          ]
        }
      ]
    }
  },
  {
    id: 'zh-metro-transport',
    lang: 'zh',
    level: 'HSK 3.0 Nivel 2 - 3',
    category: 'Transporte & Movilidad',
    title: 'Moviéndose en metro y taxi por Shanghái',
    subtitle: 'Comprar billetes, pedir direcciones y decir adónde vas',
    emoji: '🚇',
    description: 'Aprende a comprar billetes en máquinas del metro, hacer transbordos entre líneas y pedirle al taxista la dirección exacta sin perderte.',
    estimatedMinutes: 40,
    vocabulary: [
      {
        term: '请问，地铁站怎么走？',
        pinyinOrIpa: 'Qǐngwèn, dìtiězhàn zěnme zǒu?',
        translation: 'Disculpe, ¿cómo se va a la estación de metro?',
        example: '往右拐，走两百米就是地铁站。',
        exampleTranslation: 'Gira a la derecha, camina 200 metros y ahí está la estación.'
      },
      {
        term: '换乘二号线',
        pinyinOrIpa: 'Huànchéng èr hào xiàn',
        translation: 'Hacer transbordo a la Línea 2',
        example: '在人民广场站换乘二号线。',
        exampleTranslation: 'Haz transbordo a la Línea 2 en la estación Plaza del Pueblo.'
      },
      {
        term: '师傅，请去机场',
        pinyinOrIpa: 'Shīfu, qǐng qù jīchǎng.',
        translation: 'Conductor / Chófer, al aeropuerto por favor',
        example: '师傅，请打表，我去高铁站。',
        exampleTranslation: 'Conductor, ponga el taxímetro por favor, voy a la estación de alta velocidad.'
      }
    ],
    keyGrammarRule: {
      title: 'Uso de 往 (wǎng) para indicar dirección',
      explanation: 'Para indicar hacia dónde dirigirse se usa: 往 + Dirección + Verbo. Ejemplos: 往前走 (ir hacia adelante), 往左拐 (girar hacia la izquierda), 往右拐 (girar a la derecha).',
      sample: '一直往前走，在第二个路口往左拐。 (Sigue todo recto y en el segundo cruce gira a la izquierda).'
    },
    botRoleplay: {
      botPersona: 'Asistente del Metro de Shanghái',
      scenarioContext: 'Estás en la estación de metro y necesitas llegar a la Torre de Shanghái en Pudong.',
      openingMessage: {
        text: '您好！请问需要帮助吗？您要去哪儿？',
        pinyin: 'Nín hǎo! Qǐngwèn xūyào bāngzhù ma? Nín yào qù nǎr?',
        translation: '¡Hola! ¿Necesita ayuda? ¿Adónde se dirige?',
        suggestedResponses: [
          '您好，我想去东方明珠塔，请问坐几号线？ (Nín hǎo, wǒ xiǎng qù Dōngfāng Míngzhūtǎ, qǐngwèn zuò jǐ hào xiàn?)',
          '请问在哪里可以买单程地铁票？ (Qǐngwèn zài nǎlǐ kěyǐ mǎi dānchéng dìtiě piào?)',
          '去机场需要在哪里换乘？ (Qù jīchǎng xūyào zài nǎlǐ huànchéng?)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['几号线', '东方明珠', '怎么走'],
          botResponse: '去东方明珠塔请坐二号线，在陆家嘴站下车，从一号口出来就是。',
          pinyin: 'Qù Dōngfāng Míngzhūtǎ qǐng zuò èr hào xiàn, zài Lùjiāzuǐ zhàn xiàchē, cóng yī hào kǒu chūlai jiù shì.',
          translation: 'Para ir a la torre tome la Línea 2, bájese en la estación Lujiazui y salga por la Salida 1.',
          feedbackNote: 'Muy buena cortesía usando "您好" (usted) en vez de "你好".',
          nextSuggestions: [
            '好的，非常清楚，谢谢您！ (Hǎo de, fēicháng qīngchu, xièxie nín!)',
            '请问大概需要坐多长时间？ (Qǐngwèn dàgài xūyào zuò duō cháng shíjiān?)',
            '祝您工作愉快！ (Zhù nín gōngzuò yúkuài!)'
          ]
        }
      ]
    }
  },
  {
    id: 'zh-festivals-legends',
    lang: 'zh',
    level: 'HSK 3.0 Nivel 3 (Cultura & Mitos)',
    category: 'Mitos & Tradiciones',
    title: 'Mitos, Dragones y el Año Nuevo Chino (Chūnjié)',
    subtitle: 'Costumbres milenarias, sobres rojos y leyendas del monstruo Nian',
    emoji: '🐉',
    description: 'Aprende sobre la fiesta más grande de China: el Año Nuevo Lunar, comer jiaozi, desear prosperidad y el simbolismo del dragón y el tigre.',
    estimatedMinutes: 50,
    vocabulary: [
      {
        term: '新年快乐，恭喜发财！',
        pinyinOrIpa: 'Xīnnián kuàilè, gōngxǐ fācái!',
        translation: '¡Feliz Año Nuevo y que tengas mucha prosperidad!',
        example: '祝你和你的家人新年快乐，身体健康！',
        exampleTranslation: '¡Os deseo a ti y a tu familia feliz año nuevo y mucha salud!'
      },
      {
        term: '发红包',
        pinyinOrIpa: 'Fā hóngbāo',
        translation: 'Dar sobres rojos con dinero de la suerte',
        example: '春节的时候，长辈会给晚辈发红包。',
        exampleTranslation: 'En la Fiesta de la Primavera, los mayores dan sobres rojos a los jóvenes.'
      },
      {
        term: '年年有余',
        pinyinOrIpa: 'Nián nián yǒu yú',
        translation: 'Que cada año te sobre abundancia (juego de palabras con pez/sobrar)',
        example: '除夕夜一定要吃鱼，寓意年年有余。',
        exampleTranslation: 'En Nochevieja siempre se come pescado, como símbolo de abundancia.'
      }
    ],
    keyGrammarRule: {
      title: 'Estructura de bendiciones con 祝 (zhù)',
      explanation: 'Para desear algo bueno a alguien se usa: 祝 + Persona + Deseo. Ejemplos: 祝你生日快乐 (feliz cumpleaños), 祝你一路平安 (buen viaje).',
      sample: '祝你学业进步，天天开心！ (¡Te deseo progresos en tus estudios y alegría diaria!).'
    },
    botRoleplay: {
      botPersona: 'Maestro Long (Erudito tradicional)',
      scenarioContext: 'Estás en casa celebrando la cena de Nochevieja china y el Maestro Long te enseña la leyenda del dragón.',
      openingMessage: {
        text: '过年好！除夕夜吃饺子，放鞭炮，辞旧迎新。你知道为什么过年要穿红色的衣服吗？',
        pinyin: 'Guònián hǎo! Chúxī yè chī jiǎozi, fàng biānpào, cí jiù yíng xīn. Nǐ zhīdào wèishénme guònián yào chuān hóngsè de yīfu ma?',
        translation: '¡Feliz Año Nuevo! En Nochevieja comemos jiaozi, tiramos petardos y despedimos lo viejo para dar la bienvenida a lo nuevo. ¿Sabes por qué nos vestimos de rojo?',
        suggestedResponses: [
          '因为传说中红色的颜色和鞭炮能吓跑年兽！ (Yīnwèi chuánshuō zhōng hóngsè de yánsè hé biānpào néng xiàpǎo Nián shòu!)',
          '祝您新春快乐，身体健康，万事如意！ (Zhù nín xīnchūn kuàilè, shēntǐ jiànkāng, wànshì rúyì!)',
          '红色代表吉祥和好运。 (Hóngsè dàibiǎo jíxiáng hé hǎoyùn.)'
        ]
      },
      dialogueFlow: [
        {
          triggerUserContains: ['年兽', '红', '吓跑'],
          botResponse: '哈哈！你不仅汉语学得扎实，对中国传统文化更是了如指掌！有龙马精神，必成大器！',
          pinyin: 'Hāhā! Nǐ bùjǐn hànyǔ xué de zhāshi, duì Zhōngguó chuántǒng wénhuà gèng shì liǎorúzhǐzhǎng! Yǒu lóng mǎ jīngshén, bì chéng dàqì!',
          translation: '¡Jaja! ¡No solo dominas el idioma con solidez, sino que conoces la cultura al dedillo! ¡Con esa energía de dragón llegarás muy lejos!',
          feedbackNote: '"龙马精神" (Lóng mǎ jīngshén) es un chengyu clásico que elogia la fuerza y vitalidad.',
          nextSuggestions: [
            '多谢老师指点，我会继续努力！ (Duōxiè lǎoshī zhǐdiǎn, wǒ huì jìxù nǔlì!)',
            '我们一起举杯庆祝吧！ (Wǒmen yìqǐ jǔbēi qìngzhù ba!)',
            '干杯！ (Gānbēi!)'
          ]
        }
      ]
    }
  }
];
