import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in LinguaQuest:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('lq_v2_profile_son');
      localStorage.removeItem('lq_v2_profile_father');
      localStorage.removeItem('lq_srs_cards');
      localStorage.removeItem('lq_daily_quests');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              ✨
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              ¡Ups! Se ha recuperado la sesión
            </h2>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              LinguaQuest ha detectado un pequeño conflicto al cargar los datos en tu dispositivo. Puedes recargar o reiniciar los datos para continuar.
            </p>

            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-2xl text-[11px] font-mono text-slate-600 mb-5 text-left overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-all active:scale-98"
              >
                🔄 Recargar App
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-98"
              >
                🧹 Limpiar Datos Locales y Entrar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
