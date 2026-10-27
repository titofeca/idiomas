// Telegram WebApp Integration Service for LinguaQuest
import { TelegramUser, TelegramWebApp } from '../types/telegram';

class TelegramService {
  private webApp: TelegramWebApp | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.init();
    }
  }

  public getTg(): TelegramWebApp | null {
    if (!this.webApp && typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
    }
    return this.webApp;
  }

  public isTelegram(): boolean {
    const tg = this.getTg();
    return Boolean(tg && tg.initData && tg.initData.length > 0);
  }

  public init() {
    const tg = this.getTg();
    if (!tg) return;

    try {
      if (typeof tg.ready === 'function') tg.ready();
      if (typeof tg.expand === 'function') tg.expand();
      if (typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor('#f8fafc');
      }
      if (typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor('#f8fafc');
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }

  public getUser(): TelegramUser | null {
    const tg = this.getTg();
    if (!tg?.initDataUnsafe?.user) return null;
    return tg.initDataUnsafe.user;
  }

  public getStartParam(): string | null {
    const tg = this.getTg();
    return tg?.initDataUnsafe?.start_param || null;
  }

  public haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
    const tg = this.getTg();
    if (!tg?.HapticFeedback) return;

    try {
      if (type === 'success' || type === 'warning' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Haptics might fail on desktop or unsupported clients silently
    }
  }

  private backButtonCallback: (() => void) | null = null;

  public showBackButton(callback: () => void) {
    const tg = this.getTg();
    if (!tg?.BackButton) return;
    try {
      if (this.backButtonCallback && typeof tg.BackButton.offClick === 'function') {
        tg.BackButton.offClick(this.backButtonCallback);
      }
      this.backButtonCallback = callback;
      if (typeof tg.BackButton.onClick === 'function') {
        tg.BackButton.onClick(callback);
      }
      if (typeof tg.BackButton.show === 'function') {
        tg.BackButton.show();
      }
    } catch (e) {
      console.warn('Telegram BackButton warning:', e);
    }
  }

  public hideBackButton() {
    const tg = this.getTg();
    if (!tg?.BackButton) return;
    try {
      if (this.backButtonCallback && typeof tg.BackButton.offClick === 'function') {
        tg.BackButton.offClick(this.backButtonCallback);
        this.backButtonCallback = null;
      }
      if (typeof tg.BackButton.hide === 'function') {
        tg.BackButton.hide();
      }
    } catch (e) {
      console.warn('Telegram BackButton hide warning:', e);
    }
  }

  public shareInvite(role: 'son' | 'father' | string, customMessage?: string) {
    const defaultMsg =
      role === 'son'
        ? '¡Papá, he avanzado en mi reto de idiomas en LinguaQuest! 🚀 ¿Aceptas el duelo hoy?'
        : '¡Hijo, he completado mi entrenamiento de hoy en LinguaQuest! 📚 ¿Cómo llevas tu racha?';

    const text = customMessage || defaultMsg;
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;

    const tg = this.getTg();
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(shareUrl);
    } else if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank');
    }
  }

  public openLink(url: string) {
    const tg = this.getTg();
    if (tg?.openLink) {
      tg.openLink(url);
    } else if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }
}

export const telegram = new TelegramService();
