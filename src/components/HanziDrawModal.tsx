import React, { useRef, useState, useEffect } from 'react';
import { HANZI_WRITING_CARDS } from '../data/chineseCurriculum';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { useGame } from '../context/GameContext';
import { PenTool, RotateCcw, Check, Eye, EyeOff, Sparkles, Volume2 } from 'lucide-react';

interface HanziDrawModalProps {
  onClose: () => void;
}

export const HanziDrawModal: React.FC<HanziDrawModalProps> = ({ onClose }) => {
  const { addXp, addGems } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeCountDrawn, setStrokeCountDrawn] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentCard = HANZI_WRITING_CARDS[currentIndex];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    setStrokeCountDrawn(0);
    setHasCompleted(false);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Red / Amber Tian Zi Ge (田字格) traditional Chinese practice grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, w, h);

    // Dashed center lines
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    // Horizontal center
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    // Vertical center
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    // Diagonals (Mi Zi Ge)
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
    ctx.setLineDash([]); // Reset
  };

  useEffect(() => {
    clearCanvas();
  }, [currentIndex]);

  const startDraw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokeCountDrawn((prev) => {
      const next = prev + 1;
      if (next >= currentCard.strokesCount) {
        setHasCompleted(true);
        sound.playCorrect();
      }
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    startDraw(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleNextChar = () => {
    sound.playTap();
    addXp(30);
    if (currentIndex < HANZI_WRITING_CARDS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      sound.playFanfare();
      addGems(20);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Escritura Manual HSK (书写字)</h3>
              <p className="text-[11px] text-slate-400">100 caracteres oficiales desde Niveles 1 y 2</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Character Info Card */}
        <div className="mt-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{currentCard.char}</span>
              <span className="text-sm font-bold text-amber-400">{currentCard.pinyin}</span>
              <button
                onClick={() => speech.speak(currentCard.pinyin, 'zh')}
                className="p-1 rounded-full bg-slate-700 text-slate-300 hover:text-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Significado: <span className="font-semibold text-white">{currentCard.meaning}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Radical: {currentCard.radical} ({currentCard.radicalMeaning})
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Trazos oficiales</div>
            <div className="text-lg font-black text-cyan-400">
              {strokeCountDrawn}/{currentCard.strokesCount}
            </div>
          </div>
        </div>

        {/* Canvas Area with Tian Zi Ge */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner">
            {/* Background character watermark guide */}
            {showGuide && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-700/35 text-[140px] font-black select-none pointer-events-none font-serif">
                {currentCard.char}
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={256}
              height={256}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
              className="absolute inset-0 cursor-crosshair touch-none"
            />
          </div>

          {/* Controls below canvas */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => {
                sound.playTap();
                clearCanvas();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setShowGuide(!showGuide);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showGuide ? 'Ocultar Guía' : 'Ver Guía'}</span>
            </button>
          </div>
        </div>

        {/* Stroke Order Hint List */}
        <div className="mt-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
          <div className="font-bold text-slate-300 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Orden de trazos oficial:</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
            {currentCard.hintStrokes.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ol>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {currentIndex + 1} de {HANZI_WRITING_CARDS.length} caracteres
          </span>

          <button
            onClick={handleNextChar}
            disabled={!hasCompleted}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
              hasCompleted
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Completar Carácter (+30 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
