// Speech Synthesis Engine with Character-Specific Voice Profiling

export interface SpeakOptions {
  companionId?: string;
  pace?: number;
  pitch?: number;
  gender?: 'male' | 'female';
  preferLocale?: 'en-GB' | 'en-US' | 'zh-CN';
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  // Find a specific distinct voice for each character
  private pickVoiceForCompanion(
    lang: 'zh' | 'en',
    companionId?: string
  ): SpeechSynthesisVoice | null {
    const all = this.getVoices();
    if (all.length === 0) return null;

    const langPrefix = lang === 'zh' ? 'zh' : 'en';
    const langVoices = all.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (langVoices.length === 0) return all[0] || null;

    if (lang === 'en') {
      if (companionId === 'arthur') {
        // British male voice
        const britishMale = langVoices.find(
          (v) =>
            v.lang.toLowerCase().includes('gb') &&
            (v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('george') ||
              v.name.toLowerCase().includes('oliver') ||
              v.name.toLowerCase().includes('ryan'))
        );
        if (britishMale) return britishMale;
        const britishAny = langVoices.find((v) => v.lang.toLowerCase().includes('gb'));
        if (britishAny) return britishAny;
      }

      if (companionId === 'mei') {
        // High, feminine, friendly voice
        const femaleVoice = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('susan') ||
            v.name.toLowerCase().includes('jenny') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria')
        );
        if (femaleVoice) return femaleVoice;
      }

      if (companionId === 'kenji') {
        // Young US male energetic voice
        const usMale = langVoices.find(
          (v) =>
            v.lang.toLowerCase().includes('us') &&
            (v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('mark') ||
              v.name.toLowerCase().includes('guy') ||
              v.name.toLowerCase().includes('male'))
        );
        if (usMale) return usMale;
      }

      if (companionId === 'ren') {
        // Smooth melodic voice
        const altVoice = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('karen') ||
            v.name.toLowerCase().includes('google')
        );
        if (altVoice) return altVoice;
      }
    }

    if (lang === 'zh') {
      if (companionId === 'long') {
        // Deep Chinese male voice
        const maleZh = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('yunyang') ||
            v.name.toLowerCase().includes('kangkang') ||
            v.name.toLowerCase().includes('zhiwei') ||
            v.name.toLowerCase().includes('male')
        );
        if (maleZh) return maleZh;
      }

      if (companionId === 'mei' || companionId === 'ren') {
        // Clear female Chinese voice
        const femaleZh = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('xiaoxiao') ||
            v.name.toLowerCase().includes('huihui') ||
            v.name.toLowerCase().includes('yaoyao') ||
            v.name.toLowerCase().includes('female')
        );
        if (femaleZh) return femaleZh;
      }
    }

    // Fallback: distribute different voices by index if multiple are installed
    if (companionId === 'arthur' && langVoices.length > 1) return langVoices[1];
    if (companionId === 'mei' && langVoices.length > 2) return langVoices[2];
    if (companionId === 'ren' && langVoices.length > 3) return langVoices[3 % langVoices.length];

    return langVoices[0];
  }

  public speak(
    text: string,
    lang: 'zh' | 'en' = 'en',
    options: SpeakOptions = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      // Cancel previous utterances for zero-latency response
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'zh' ? 'zh-CN' : options.preferLocale || 'en-US';

      // Fine-tuned character pitch & rate profiles
      let calculatedPitch = options.pitch ?? 1.0;
      let calculatedRate = options.pace ?? 0.9;

      if (options.companionId === 'kenji') {
        calculatedPitch = 1.18;
        calculatedRate = 1.02;
      } else if (options.companionId === 'arthur') {
        calculatedPitch = 0.82;
        calculatedRate = 0.88;
      } else if (options.companionId === 'long') {
        calculatedPitch = 0.74;
        calculatedRate = 0.80;
      } else if (options.companionId === 'mei') {
        calculatedPitch = 1.34;
        calculatedRate = 0.94;
      } else if (options.companionId === 'ren') {
        calculatedPitch = 1.04;
        calculatedRate = 0.88;
      }

      utterance.pitch = Math.max(0.5, Math.min(2.0, calculatedPitch));
      utterance.rate = Math.max(0.5, Math.min(1.5, calculatedRate));

      const matchedVoice = this.pickVoiceForCompanion(lang, options.companionId);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speech = new SpeechService();
