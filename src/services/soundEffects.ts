// Procedural Audio Engine using Web Audio API - Zero latency, works offline anywhere

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Dopamine hit: Correct answer pleasant chime
  playCorrect() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Arpeggio E5 -> G#5 -> B5 -> E6
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(830.61, now + 0.08);
      osc1.frequency.setValueAtTime(987.77, now + 0.16);
      osc1.frequency.setValueAtTime(1318.51, now + 0.24);

      osc2.frequency.setValueAtTime(1318.51, now);
      osc2.frequency.setValueAtTime(1661.22, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.56);
      osc2.stop(now + 0.56);

      // Trigger mobile vibration if available
      if ('vibrate' in navigator) {
        navigator.vibrate([40, 30, 60]);
      }
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Soft low thud for incorrect answers
  playWrong() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);

      if ('vibrate' in navigator) {
        navigator.vibrate([80]);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // Epic Fanfare for Level-up / Boss defeat / Record broken
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C E G C E G

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.18, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.65);
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([60, 40, 80, 40, 120]);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // Chest Open sound: Magical shimmer
  playChestOpen() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 8; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + i * 180, now + i * 0.05);

        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.45);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // Mandarin Tone Synthesizer with variable pace and pitch amplify
  // Generates pure acoustic pitch trajectories (55, 35, 214, 51)
  playMandarinToneCurve(toneNumber: 1 | 2 | 3 | 4, pace: number = 1.0, amplify: boolean = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = (0.55 / pace);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const baseF = amplify ? 380 : 330;
      const mult = amplify ? 1.4 : 1.0;

      if (toneNumber === 1) {
        // High Flat (55)
        const f = baseF * 1.25;
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.setValueAtTime(f, now + duration);
      } else if (toneNumber === 2) {
        // Rising (35)
        const startF = baseF * (1 - 0.2 * mult);
        const endF = baseF * (1 + 0.3 * mult);
        osc.frequency.setValueAtTime(startF, now);
        osc.frequency.exponentialRampToValueAtTime(endF, now + duration);
      } else if (toneNumber === 3) {
        // Dipping (214)
        const dipF = baseF * (1 - 0.35 * mult);
        const endF = baseF * (1 + 0.15 * mult);
        osc.frequency.setValueAtTime(baseF, now);
        osc.frequency.exponentialRampToValueAtTime(dipF, now + duration * 0.5);
        osc.frequency.exponentialRampToValueAtTime(endF, now + duration);
      } else if (toneNumber === 4) {
        // Falling (51)
        const startF = baseF * (1 + 0.35 * mult);
        const endF = baseF * (1 - 0.35 * mult);
        osc.frequency.setValueAtTime(startF, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(120, endF), now + duration);
      }

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.setValueAtTime(0.25, now + duration - 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      console.warn(e);
    }
  }

  // Quick tactile tap click
  playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // ignore
    }
  }
}

export const sound = new SoundEffects();
