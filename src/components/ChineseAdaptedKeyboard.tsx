import React, { useState } from 'react';
import { speech } from '../services/speechService';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { Volume2, Sparkles, Keyboard, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface Candidate {
  hanzi: string;
  pinyin: string;
  translation: string;
}

const PINYIN_DICTIONARY: Record<string, Candidate[]> = {
  ni: [
    { hanzi: '你', pinyin: 'nǐ', translation: 'tú' },
    { hanzi: '你好', pinyin: 'nǐ hǎo', translation: 'hola' },
    { hanzi: '您', pinyin: 'nín', translation: 'usted (respeto)' },
    { hanzi: '你们', pinyin: 'nǐmen', translation: 'vosotros' },
  ],
  nihao: [
    { hanzi: '你好', pinyin: 'nǐ hǎo', translation: '¡Hola!' },
    { hanzi: '你好吗', pinyin: 'nǐ hǎo ma', translation: '¿Cómo estás?' },
  ],
  hao: [
    { hanzi: '好', pinyin: 'hǎo', translation: 'bien / bueno' },
    { hanzi: '好的', pinyin: 'hǎo de', translation: 'de acuerdo / vale' },
    { hanzi: '好吃', pinyin: 'hǎochī', translation: 'delicioso' },
    { hanzi: '号', pinyin: 'hào', translation: 'número / día' },
  ],
  xie: [
    { hanzi: '谢谢', pinyin: 'xièxie', translation: 'gracias' },
    { hanzi: '写', pinyin: 'xiě', translation: 'escribir' },
  ],
  xiexie: [
    { hanzi: '谢谢', pinyin: 'xièxie', translation: '¡Muchas gracias!' },
    { hanzi: '谢谢你', pinyin: 'xièxie nǐ', translation: 'Gracias a ti' },
  ],
  zai: [
    { hanzi: '再见', pinyin: 'zàijiàn', translation: 'adiós' },
    { hanzi: '在', pinyin: 'zài', translation: 'estar en' },
    { hanzi: '再', pinyin: 'zài', translation: 'otra vez' },
  ],
  zaijian: [
    { hanzi: '再见', pinyin: 'zàijiàn', translation: '¡Adiós / Hasta luego!' },
  ],
  wo: [
    { hanzi: '我', pinyin: 'wǒ', translation: 'yo' },
    { hanzi: '我们', pinyin: 'wǒmen', translation: 'nosotros' },
    { hanzi: '我是', pinyin: 'wǒ shì', translation: 'yo soy' },
    { hanzi: '我的', pinyin: 'wǒ de', translation: 'mi / mío' },
  ],
  baba: [
    { hanzi: '爸爸', pinyin: 'bàba', translation: 'papá' },
  ],
  mama: [
    { hanzi: '妈妈', pinyin: 'māma', translation: 'mamá' },
  ],
  erzi: [
    { hanzi: '儿子', pinyin: 'érzi', translation: 'hijo' },
  ],
  shi: [
    { hanzi: '是', pinyin: 'shì', translation: 'ser / sí' },
    { hanzi: '十', pinyin: 'shí', translation: 'diez (10)' },
    { hanzi: '事', pinyin: 'shì', translation: 'asunto / cosa' },
  ],
  bu: [
    { hanzi: '不', pinyin: 'bù', translation: 'no' },
    { hanzi: '不是', pinyin: 'bú shì', translation: 'no es / no soy' },
    { hanzi: '不要', pinyin: 'bú yào', translation: 'no quiero' },
  ],
  duibuqi: [
    { hanzi: '对不起', pinyin: 'duìbuqǐ', translation: 'Lo siento / Perdón' },
  ],
  meiguanxi: [
    { hanzi: '没关系', pinyin: 'méi guānxi', translation: 'No pasa nada / No importa' },
  ],
  bukeqi: [
    { hanzi: '不客气', pinyin: 'bú kèqi', translation: 'De nada' },
  ],
  haode: [
    { hanzi: '好的', pinyin: 'hǎo de', translation: 'Vale / De acuerdo' },
  ],
  ma: [
    { hanzi: '吗', pinyin: 'ma', translation: '¿verdad? (pregunta)' },
    { hanzi: '妈', pinyin: 'mā', translation: 'mamá' },
    { hanzi: '马', pinyin: 'mǎ', translation: 'caballo' },
  ],
  shui: [
    { hanzi: '水', pinyin: 'shuǐ', translation: 'agua' },
  ],
  cha: [
    { hanzi: '茶', pinyin: 'chá', translation: 'té' },
  ],
  chi: [
    { hanzi: '吃', pinyin: 'chī', translation: 'comer' },
  ],
  he: [
    { hanzi: '喝', pinyin: 'hē', translation: 'beber' },
    { hanzi: '和', pinyin: 'hé', translation: 'y (conjunción)' },
  ],
  yi: [
    { hanzi: '一', pinyin: 'yī', translation: 'uno (1)' },
  ],
  er: [
    { hanzi: '二', pinyin: 'èr', translation: 'dos (2)' },
  ],
  san: [
    { hanzi: '三', pinyin: 'sān', translation: 'tres (3)' },
  ],
  si: [
    { hanzi: '四', pinyin: 'sì', translation: 'cuatro (4)' },
  ],
  wu: [
    { hanzi: '五', pinyin: 'wǔ', translation: 'cinco (5)' },
  ],
  liu: [
    { hanzi: '六', pinyin: 'liù', translation: 'seis (6)' },
  ],
  qi: [
    { hanzi: '七', pinyin: 'qī', translation: 'siete (7)' },
  ],
  ba: [
    { hanzi: '八', pinyin: 'bā', translation: 'ocho (8)' },
    { hanzi: '吧', pinyin: 'ba', translation: '¿vale? / vamos' },
  ],
  jiu: [
    { hanzi: '九', pinyin: 'jiǔ', translation: 'nueve (9)' },
  ],
};

const STARTER_CATEGORIES = [
  {
    name: 'Básicos & Saludos',
    phrases: [
      { hanzi: '你好！', pinyin: 'Nǐ hǎo!', translation: '¡Hola!' },
      { hanzi: '谢谢！', pinyin: 'Xièxie!', translation: '¡Gracias!' },
      { hanzi: '再见！', pinyin: 'Zàijiàn!', translation: '¡Adiós!' },
      { hanzi: '好的', pinyin: 'Hǎo de', translation: 'Vale / De acuerdo' },
      { hanzi: '不客气', pinyin: 'Bú kèqi', translation: 'De nada' },
      { hanzi: '对不起', pinyin: 'Duìbuqǐ', translation: 'Perdón / Lo siento' },
      { hanzi: '没关系', pinyin: 'Méi guānxi', translation: 'No pasa nada' },
    ],
  },
  {
    name: 'Supervivencia desde Cero',
    phrases: [
      { hanzi: '听不懂', pinyin: 'Tīng bù dǒng', translation: 'No entiendo' },
      { hanzi: '请慢一点', pinyin: 'Qǐng màn yìdiǎn', translation: 'Más despacio por favor' },
      { hanzi: '请再说一次', pinyin: 'Qǐng zài shuō yí cì', translation: 'Repite otra vez' },
      { hanzi: '这是什么？', pinyin: 'Zhè shì shénme?', translation: '¿Qué es esto?' },
      { hanzi: '太棒了！', pinyin: 'Tài bàng le!', translation: '¡Genial / Fantástico!' },
    ],
  },
  {
    name: 'Padre e Hijo',
    phrases: [
      { hanzi: '我是爸爸', pinyin: 'Wǒ shì bàba', translation: 'Soy el papá' },
      { hanzi: '我是儿子', pinyin: 'Wǒ shì érzi', translation: 'Soy el hijo' },
      { hanzi: '我叫...', pinyin: 'Wǒ jiào...', translation: 'Me llamo...' },
      { hanzi: '很高兴认识你！', pinyin: 'Hěn gāoxìng rènshi nǐ!', translation: '¡Encantado de conocerte!' },
      { hanzi: '我们一起学中文', pinyin: 'Wǒmen yìqǐ xué zhōngwén', translation: 'Aprendemos chino juntos' },
    ],
  },
  {
    name: 'Comida & Números',
    phrases: [
      { hanzi: '我想喝水', pinyin: 'Wǒ xiǎng hē shuǐ', translation: 'Quiero agua' },
      { hanzi: '好吃！', pinyin: 'Hǎochī!', translation: '¡Qué rico!' },
      { hanzi: '一二三四五', pinyin: 'Yī èr sān sì wǔ', translation: '1, 2, 3, 4, 5' },
      { hanzi: '多少钱？', pinyin: 'Duōshao qián?', translation: '¿Cuánto cuesta?' },
    ],
  },
];

const TONE_KEYS = [
  ['ā', 'á', 'ǎ', 'à'],
  ['ē', 'é', 'ě', 'è'],
  ['ī', 'í', 'ǐ', 'ì'],
  ['ō', 'ó', 'ǒ', 'ò'],
  ['ū', 'ú', 'ǔ', 'ù'],
  ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
];

interface ChineseAdaptedKeyboardProps {
  currentInputText: string;
  onSelectCandidate: (hanzi: string, fullCandidate: Candidate) => void;
  onQuickPhraseClick: (hanzi: string) => void;
  onInsertToneChar: (char: string) => void;
}

export const ChineseAdaptedKeyboard: React.FC<ChineseAdaptedKeyboardProps> = ({
  currentInputText,
  onSelectCandidate,
  onQuickPhraseClick,
  onInsertToneChar,
}) => {
  const [activeTab, setActiveTab] = useState<'phrases' | 'tones'>('phrases');
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract last typed word in lowercase without punctuation to check IME candidate
  const words = currentInputText.trim().split(/\s+/);
  const lastWord = words.length > 0 ? words[words.length - 1].toLowerCase().replace(/[^a-z]/g, '') : '';
  const candidates = PINYIN_DICTIONARY[lastWord] || [];

  const playPreview = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    sound.playTap();
    speech.speak(text, 'zh', { pace: 0.8 });
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 space-y-2 select-none">
      {/* 1. Live IME Candidate Bar (appears automatically when typing pinyin like 'ni', 'hao', 'xie') */}
      {candidates.length > 0 && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-xs animate-pop">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Sugerencias para "{lastWord}":
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">Toca para insertar carácter</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {candidates.map((cand, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playTap();
                  telegram.haptic('light');
                  onSelectCandidate(cand.hanzi, cand);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-200 text-slate-900 font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-all active:scale-95"
              >
                <span className="text-base font-serif text-slate-950 font-bold">{cand.hanzi}</span>
                <span className="text-[10px] text-amber-700 font-mono">({cand.pinyin})</span>
                <span className="text-[10px] text-slate-400">· {cand.translation}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => playPreview(e, cand.hanzi)}
                  className="p-1 hover:text-amber-700 text-slate-400"
                  title="Oír pronunciación"
                >
                  <Volume2 className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Top Controls: Tabs & Expand/Collapse */}
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('phrases');
              setIsExpanded(true);
            }}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] transition-all ${
              activeTab === 'phrases'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            💬 Frases Rápidas Nivel 0
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('tones');
              setIsExpanded(true);
            }}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] transition-all ${
              activeTab === 'tones'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎵 Tonos (ā, á, ǎ, à)
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setIsExpanded(!isExpanded);
          }}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          title={isExpanded ? 'Ocultar teclado adaptado' : 'Mostrar teclado adaptado'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 3. Expandable Body */}
      {isExpanded && (
        <div>
          {activeTab === 'phrases' ? (
            <div className="space-y-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {STARTER_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setSelectedCategoryIdx(idx);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                      selectedCategoryIdx === idx
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Phrase Chips in Selected Category */}
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {STARTER_CATEGORIES[selectedCategoryIdx].phrases.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      sound.playTap();
                      telegram.haptic('light');
                      onQuickPhraseClick(item.hanzi);
                    }}
                    className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs shadow-xs transition-all active:scale-95"
                  >
                    <span className="font-serif font-black text-slate-900 text-sm">
                      {item.hanzi}
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono font-bold">
                      {item.pinyin}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({item.translation})
                    </span>
                    <button
                      type="button"
                      onClick={(e) => playPreview(e, item.hanzi)}
                      className="p-0.5 rounded-md text-slate-300 group-hover:text-indigo-600 hover:scale-110"
                      title="Escuchar audio"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Tone Keyboard Bar */
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 font-medium">
                Toca cualquier vocal con tono para insertarla en el texto:
              </div>
              <div className="grid grid-cols-6 gap-1 text-center">
                {TONE_KEYS.map((group, rowIdx) => (
                  <div key={rowIdx} className="flex flex-col gap-1">
                    {group.map((char, charIdx) => (
                      <button
                        key={charIdx}
                        type="button"
                        onClick={() => {
                          sound.playTap();
                          telegram.haptic('light');
                          onInsertToneChar(char);
                        }}
                        className="py-1 rounded-lg bg-white hover:bg-indigo-100 border border-slate-200 text-xs font-mono font-bold text-indigo-900 hover:border-indigo-400 active:scale-95 transition-all"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
