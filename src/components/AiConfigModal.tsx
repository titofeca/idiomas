import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { aiService } from '../services/aiService';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { AiProvider } from '../types';
import {
  Sparkles,
  Key,
  Cpu,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AiConfigModalProps {
  onClose: () => void;
}

const PRESET_MODELS: Record<AiProvider, { id: string; label: string; badge?: string }[]> = {
  openrouter: [
    { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (V3)', badge: 'Recomendado' },
    { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (Razonamiento)', badge: 'Top Lógica' },
    { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Gratis)', badge: 'Free' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Gratis)', badge: 'Free' },
  ],
  deepseek: [
    { id: 'deepseek-chat', label: 'DeepSeek Chat (Directo)', badge: 'Oficial' },
    { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (R1)', badge: 'Oficial' },
  ],
  gemini: [
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', badge: 'Google' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', badge: 'Rápido' },
  ],
  builtin: [
    { id: 'procedural-smart', label: 'Motor Procedural Local', badge: 'Offline' },
  ],
};

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ onClose }) => {
  const { aiConfig, updateAiConfig } = useGame();

  const [provider, setProvider] = useState<AiProvider>(aiConfig.provider || 'openrouter');
  const [apiKey, setApiKey] = useState<string>(aiConfig.apiKey || '');
  const [model, setModel] = useState<string>(aiConfig.model || 'deepseek/deepseek-chat');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (p: AiProvider) => {
    sound.playTap();
    setProvider(p);
    const presets = PRESET_MODELS[p];
    if (presets && presets[0]) {
      setModel(presets[0].id);
    }
  };

  const handleTestConnection = async () => {
    sound.playTap();
    setIsTesting(true);
    setTestResult(null);

    // Temporarily apply to aiService to test
    aiService.saveConfig({
      provider,
      apiKey,
      model,
      temperature: 0.7,
      enabled: true,
    });

    const res = await aiService.testConnection();
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      sound.playFanfare();
      telegram.haptic('success');
    } else {
      sound.playWrong();
      telegram.haptic('error');
    }
  };

  const handleSave = () => {
    updateAiConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      temperature: 0.7,
      enabled: true,
    });
    sound.playCorrect();
    telegram.haptic('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Cerebro IA para Conversación</h3>
              <p className="text-xs text-slate-500 font-medium">OpenRouter, DeepSeek o Gemini</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="font-extrabold text-slate-700 block mb-2">Proveedor de Inteligencia Artificial</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleProviderChange('openrouter')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'openrouter'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">OpenRouter</span>
                  <span className="text-[10px] bg-indigo-200/80 text-indigo-900 font-extrabold px-1.5 py-0.5 rounded-md">
                    Multi-LLM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">DeepSeek, Llama 3, Gemini gratis y de pago.</p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('deepseek')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'deepseek'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">DeepSeek</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded-md">
                    Directo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">API oficial directa de DeepSeek (V3 y R1).</p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">Gemini</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded-md">
                    Google
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Google AI Studio (Gemini 2.0 Flash).</p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('builtin')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'builtin'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">Modo Offline</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-extrabold px-1.5 py-0.5 rounded-md">
                    Sin Clave
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Respuestas locales guiadas por el temario.</p>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {provider !== 'builtin' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>API Key de {provider === 'openrouter' ? 'OpenRouter' : provider === 'deepseek' ? 'DeepSeek' : 'Google Gemini'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] text-indigo-600 font-bold hover:underline"
                >
                  {showKey ? 'Ocultar' : 'Ver clave'}
                </button>
              </div>

              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'openrouter'
                    ? 'sk-or-v1-...'
                    : provider === 'deepseek'
                    ? 'sk-...'
                    : 'AIzaSy...'
                }
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-slate-900"
              />

              <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Se guarda únicamente en tu dispositivo (privado)
                </span>
                <a
                  href={
                    provider === 'openrouter'
                      ? 'https://openrouter.ai/keys'
                      : provider === 'deepseek'
                      ? 'https://platform.deepseek.com/api_keys'
                      : 'https://aistudio.google.com/app/apikey'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-bold flex items-center gap-0.5 hover:underline"
                >
                  <span>Obtener clave</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}

          {/* Model Selection */}
          {provider !== 'builtin' && (
            <div>
              <label className="font-extrabold text-slate-700 flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Modelo de Lenguaje</span>
              </label>

              <div className="space-y-1.5">
                {PRESET_MODELS[provider].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setModel(m.id);
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      model === m.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.id}</div>
                    </div>
                    {m.badge && (
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-2xl border flex items-start gap-2.5 animate-pop ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-medium leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            {provider !== 'builtin' && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{isTesting ? 'Probando conexión...' : 'Probar Clave & Conexión'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar Configuración IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
