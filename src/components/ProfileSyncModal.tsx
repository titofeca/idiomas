import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { Smartphone, Copy, Check, Download, Upload } from 'lucide-react';

interface ProfileSyncModalProps {
  onClose: () => void;
}

export const ProfileSyncModal: React.FC<ProfileSyncModalProps> = ({ onClose }) => {
  const { exportSyncData, importSyncData, activeProfileId } = useGame();
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const syncCode = exportSyncData();

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    sound.playTap();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importSyncData(importText.trim());
    if (success) {
      setImportStatus('¡Datos sincronizados con éxito!');
      sound.playFanfare();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setImportStatus('Código de sincronización no válido.');
      sound.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-700">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Sincronizar entre Móviles</h3>
              <p className="text-xs text-slate-500">Pasa los progresos entre el teléfono de tu hijo y el tuyo</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" />
              1. Tu Código de Progreso
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Copia este código y envíaselo por WhatsApp al otro teléfono:
          </p>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] font-mono text-slate-600 break-all max-h-20 overflow-y-auto select-all">
            {syncCode}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
            <Upload className="w-4 h-4 text-indigo-600" />
            2. Cargar Código del Otro Móvil
          </span>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Pega aquí el código que recibas por WhatsApp..."
            className="w-full h-20 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
          />

          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className={`w-full mt-2.5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
              importText.trim()
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Actualizar Marcador Familiar</span>
          </button>

          {importStatus && (
            <p className="text-xs text-center mt-2 font-bold text-indigo-700">{importStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};
