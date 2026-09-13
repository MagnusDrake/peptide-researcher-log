// Aura Luxury Audio & Haptic Sensory Engine
// Synthesizes procedural Web Audio API tones and mobile tactile haptics.

class AuraSensoryEngine {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private volume: number = 0.35;

  constructor() {
    if (typeof window !== 'undefined') {
      this.soundEnabled = localStorage.getItem('aura_sound_enabled') !== 'false';
      this.hapticsEnabled = localStorage.getItem('aura_haptics_enabled') !== 'false';
      const savedVol = localStorage.getItem('aura_sound_volume');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // --- Configuration & Persistence ---

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('aura_sound_enabled', enabled ? 'true' : 'false');
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
    localStorage.setItem('aura_haptics_enabled', enabled ? 'true' : 'false');
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('aura_sound_volume', this.volume.toString());
  }

  public isHapticsSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  // --- Haptic Feedback Methods ---

  public haptic(pattern: number | number[]): void {
    if (!this.hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on unsupported hardware
    }
  }

  public hapticLight(): void {
    this.haptic(10);
  }

  public hapticSelection(): void {
    this.haptic(8);
  }

  public hapticMedium(): void {
    this.haptic(25);
  }

  public hapticHeavy(): void {
    this.haptic(45);
  }

  public hapticSuccess(): void {
    this.haptic([15, 50, 25]);
  }

  public hapticError(): void {
    this.haptic([30, 40, 30, 40, 30]);
  }

  public hapticDoseLogged(): void {
    this.haptic([20, 50, 35, 50, 20]);
  }

  // --- Sound Effects Synthesis (Procedural Web Audio) ---

  /** Subtle, high-end acoustic glass tap */
  public playTap(pitchMultiplier = 1.0): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(450 * pitchMultiplier, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio play failure ignored
    }
  }

  /** Navigation tab switch / section selection */
  public playTabSwitch(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc2.frequency.setValueAtTime(880.00, now); // A5

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.065);
      osc2.stop(now + 0.065);
    } catch {}
  }

  /** Toggle switch / micro selection click */
  public playToggle(isOn = true): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startFreq = isOn ? 440 : 660;
      const endFreq = isOn ? 660 : 440;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {}
  }

  /** Light / Dark / Atmosphere Palette transition sweep */
  public playThemeSwitch(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  /** Vault PIN unlock chime */
  public playUnlock(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Radiant major triad chord with shimmer: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.45, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch {}
  }

  /** Dose Logged / Research Entry Reward */
  public playDoseLogged(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Ethereal pentatonic sequence: G5, A5, C6, D6, E6
      const notes = [783.99, 880.0, 1046.5, 1174.66, 1318.51];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.05;

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.5, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {}
  }

  /** Action saved / Success chime */
  public playSuccess(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [659.25, 880.0]; // E5 -> A5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.45, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    } catch {}
  }

  /** Warning / Incorrect PIN / Error thud */
  public playError(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      gain.gain.setValueAtTime(this.volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // --- Combined Sensory Helpers ---

  public triggerTap(pitchMultiplier = 1): void {
    this.playTap(pitchMultiplier);
    this.hapticLight();
  }

  public triggerTabSwitch(): void {
    this.playTabSwitch();
    this.hapticSelection();
  }

  public triggerToggle(isOn = true): void {
    this.playToggle(isOn);
    this.hapticLight();
  }

  public triggerThemeSwitch(): void {
    this.playThemeSwitch();
    this.hapticMedium();
  }

  public triggerUnlock(): void {
    this.playUnlock();
    this.hapticSuccess();
  }

  public triggerDoseLogged(): void {
    this.playDoseLogged();
    this.hapticDoseLogged();
  }

  public triggerSuccess(): void {
    this.playSuccess();
    this.hapticSuccess();
  }

  public triggerError(): void {
    this.playError();
    this.hapticError();
  }
}

export const sensory = new AuraSensoryEngine();
