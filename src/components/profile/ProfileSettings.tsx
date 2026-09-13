import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User, Lock, Download, Upload, Shield, Settings, AlertTriangle, CheckCircle2, Wand2, Eye, EyeOff, Sun, Moon, Palette, Check, Sparkles, ArrowRightLeft, X, Volume2, VolumeX, Vibrate, Play, Radio } from 'lucide-react';
import { db } from '../../db';
import { exportDatabaseToJson, triggerDownload, importDatabaseFromJson } from '../../utils/exportImport';
import { LightPalette, LIGHT_PALETTES, DarkPalette, DARK_PALETTES } from '../../types/theme';
import { sensory } from '../../utils/soundHaptics';

interface ProfileSettingsProps { 
  onLogout: () => void; 
  isStudioUnlocked?: boolean;
  onToggleStudioUnlock?: () => void;
  lightPalette?: LightPalette;
  onSelectLightPalette?: (palette: LightPalette) => void;
  darkPalette?: DarkPalette;
  onSelectDarkPalette?: (palette: DarkPalette) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

interface FeedbackModalData {
  isOpen: boolean;
  badge: string;
  title: string;
  message: string;
  subMessage?: string;
  isError?: boolean;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  onLogout,
  isStudioUnlocked = false,
  onToggleStudioUnlock,
  lightPalette = 'alabaster',
  onSelectLightPalette,
  darkPalette = 'obsidian',
  onSelectDarkPalette,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [dataMessage, setDataMessage] = useState('');
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio & Haptic Sensory State
  const [soundEnabled, setSoundEnabled] = useState(() => sensory.isSoundEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState(() => sensory.isHapticsEnabled());
  const [volume, setVolume] = useState(() => Math.round(sensory.getVolume() * 100));
  
  useEffect(() => {
    const savedName = localStorage.getItem('aura_researcher_name') || 'Lead Researcher';
    setName(savedName);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sensory.setSoundEnabled(next);
    setSoundEnabled(next);
    sensory.triggerToggle(next);
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    sensory.setHapticsEnabled(next);
    setHapticsEnabled(next);
    sensory.triggerToggle(next);
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    sensory.setVolume(newVal / 100);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFeedbackModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveName = () => {
    const trimmed = name.trim() || 'Lead Researcher';
    setName(trimmed);
    localStorage.setItem('aura_researcher_name', trimmed);
    sensory.triggerSuccess();
    setFeedbackModal({
      isOpen: true,
      badge: 'Identity Saved',
      title: 'Profile Updated',
      message: 'Your researcher display name has been saved and will appear across your daily schedules, protocols, and dose logs.',
      subMessage: trimmed,
      isError: false,
    });
  };

  const handleUpdatePin = () => {
    const savedPin = localStorage.getItem('aura_pin') || '0000';
    if (currentPin !== savedPin) {
      sensory.triggerError();
      setPinMessage('Incorrect current PIN.');
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      sensory.triggerError();
      setPinMessage('New PIN must be exactly 4 digits.');
      return;
    }
    localStorage.setItem('aura_pin', newPin);
    sensory.triggerSuccess();
    setPinMessage('Vault PIN successfully updated.');
    setCurrentPin('');
    setNewPin('');
    setTimeout(() => setPinMessage(''), 3000);
  };

  const handleExportData = async () => {
    try {
      const json = await exportDatabaseToJson();
      const filename = `aura_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
      triggerDownload(json, filename, 'application/json');
      setDataMessage('Vault data exported successfully.');
      setTimeout(() => setDataMessage(''), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setFeedbackModal({
        isOpen: true,
        badge: 'Export Failed',
        title: 'Vault Backup Error',
        message: 'Unable to export vault data. Please ensure browser storage is accessible.',
        isError: true,
      });
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importDatabaseFromJson(content);
        if (res.success) {
          setDataMessage(res.message);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setFeedbackModal({
            isOpen: true,
            badge: 'Import Failed',
            title: 'Restore Error',
            message: res.message,
            isError: true,
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePurgeAllData = async () => {
    const confirmed = window.confirm(
      '⚠️ PERMANENT DATA PURGE\n\nAre you sure you want to delete ALL your protocols, injection logs, weight tracking, custom peptides, and reset your vault PIN?\n\nThis action is completely IRREVERSIBLE.'
    );

    if (!confirmed) return;

    const doubleCheck = window.confirm(
      'FINAL CONFIRMATION: Type OK to wipe this vault completely.'
    );

    if (!doubleCheck) return;

    try {
      // Clear Dexie IndexedDB tables
      await db.protocols.clear();
      await db.doseLogs.clear();
      await db.customPeptides.clear();
      await db.settings.clear();
      await db.sharedCommunityFindings.clear();

      // Clear LocalStorage and SessionStorage
      localStorage.clear();
      sessionStorage.clear();

      alert('All local data has been purged. The application will now restart.');
      window.location.reload();
    } catch (err) {
      console.error('Purge error:', err);
      alert('An error occurred while purging local data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest">
          MY PROFILE & SETTINGS
        </h1>
        <p className="text-slate-400 mt-2 text-sm font-medium">Manage your display name, passcode lock, and app data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Atmosphere Palette Panel (Dynamically displays only Dark or Light palettes based on active mode) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>
                {theme === 'dark' ? 'Atmosphere & Dark Mode Palette' : 'Atmosphere & Light Mode Palette'}
              </span>
            </h2>

            <div className="flex items-center gap-3">
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                  title="Toggle Light / Dark Mode"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Switch to Dark Mode</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {theme === 'dark'
              ? 'Select your bespoke dark atmosphere — each tuned with multi-tiered deep carbon, bioluminescent telemetry, botanical emerald, or cosmic royal violet.'
              : 'Aura never blinds you with harsh, sterile white. Select your bespoke light atmosphere below — each handcrafted with organic mineral tones, non-glare surfaces, and comfortable contrast.'}
          </p>

          {/* DARK MODE PALETTES (Visible ONLY when in Dark Mode) */}
          {theme === 'dark' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.values(DARK_PALETTES)).map((palette) => {
                const isSelected = darkPalette === palette.id;
                return (
                  <div
                    key={palette.id}
                    onClick={() => {
                      sensory.triggerThemeSwitch();
                      onSelectDarkPalette?.(palette.id as DarkPalette);
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{palette.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                            {palette.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 font-mono">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[0.68rem] font-semibold text-cyan-400 mb-3 tracking-wide">
                        {palette.tagline}
                      </p>

                      {/* Color Swatches Strip */}
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-3 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-700/60 shadow-xs" 
                            style={{ backgroundColor: palette.canvasHex }}
                            title={`Canvas: ${palette.canvasHex}`}
                          />
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-700/60 shadow-xs" 
                            style={{ backgroundColor: palette.cardHex }}
                            title={`Card: ${palette.cardHex}`}
                          />
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-700/60 shadow-xs" 
                            style={{ backgroundColor: palette.borderHex }}
                            title={`Border: ${palette.borderHex}`}
                          />
                        </div>
                        <div 
                          className="w-5 h-5 rounded-md border border-slate-700/60 shadow-xs" 
                          style={{ backgroundColor: palette.accentHex }}
                          title={`Accent: ${palette.accentHex}`}
                        />
                      </div>

                      <p className="text-[0.72rem] text-slate-400 leading-relaxed">
                        {palette.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[0.65rem] font-mono uppercase tracking-widest text-slate-500">
                        {palette.canvasHex}
                      </span>
                      <span className={`text-[0.65rem] font-semibold uppercase tracking-wider transition ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {isSelected ? 'Selected' : 'Apply Atmosphere'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIGHT MODE PALETTES (Visible ONLY when in Light Mode) */}
          {theme === 'light' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.values(LIGHT_PALETTES)).map((palette) => {
                const isSelected = lightPalette === palette.id;
                return (
                  <div
                    key={palette.id}
                    onClick={() => {
                      sensory.triggerThemeSwitch();
                      onSelectLightPalette?.(palette.id as LightPalette);
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{palette.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                            {palette.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 font-mono">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[0.68rem] font-semibold text-cyan-400 mb-3 tracking-wide">
                        {palette.tagline}
                      </p>

                      {/* Color Swatches Strip */}
                      <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 mb-3 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-600/30 shadow-xs" 
                            style={{ backgroundColor: palette.canvasHex }}
                            title={`Canvas: ${palette.canvasHex}`}
                          />
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-600/30 shadow-xs" 
                            style={{ backgroundColor: palette.cardHex }}
                            title={`Card: ${palette.cardHex}`}
                          />
                          <div 
                            className="w-5 h-5 rounded-md border border-slate-600/30 shadow-xs" 
                            style={{ backgroundColor: palette.borderHex }}
                            title={`Border: ${palette.borderHex}`}
                          />
                        </div>
                        <div 
                          className="w-5 h-5 rounded-md border border-slate-600/30 shadow-xs" 
                          style={{ backgroundColor: palette.accentHex }}
                          title={`Accent: ${palette.accentHex}`}
                        />
                      </div>

                      <p className="text-[0.72rem] text-slate-400 leading-relaxed">
                        {palette.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[0.65rem] font-mono uppercase tracking-widest text-slate-500">
                        {palette.canvasHex}
                      </span>
                      <span className={`text-[0.65rem] font-semibold uppercase tracking-wider transition ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {isSelected ? 'Selected' : 'Apply Atmosphere'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Identity Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl h-fit">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <User className="w-4 h-4" />
            <span>Your Profile</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  }
                }}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                placeholder="Enter name..."
              />
            </div>
            
            <button 
              onClick={handleSaveName}
              className="w-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 cursor-pointer"
            >
              Save Name
            </button>
          </div>
        </div>

        {/* Security Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl h-fit">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Shield className="w-4 h-4" />
            <span>Passcode Lock</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current PIN</label>
              <input 
                type="password" 
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center tracking-[0.5em] text-lg font-mono"
                placeholder="****"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">New 4-Digit PIN</label>
              <input 
                type="password" 
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center tracking-[0.5em] text-lg font-mono"
                placeholder="****"
              />
            </div>
            
            {pinMessage && (
              <p className={`text-xs font-semibold uppercase tracking-widest text-center ${pinMessage.includes('successfully') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pinMessage}
              </p>
            )}

            <button 
              onClick={handleUpdatePin}
              className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Change PIN</span>
            </button>
          </div>
        </div>

        {/* Sensory & Haptic Feedback Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
            <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Sensory & Haptic Feedback</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-bold uppercase tracking-wider border border-cyan-500/20">
                Acoustic & Tactile Engine
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Experience tactile precision with synthesized procedural audio tones and physical haptic vibrations. All sounds are procedurally generated in real-time with zero network latency and work 100% offline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Toggles & Volume */}
            <div className="space-y-4">
              
              {/* Sound Toggle */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                    soundEnabled 
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' 
                      : 'bg-slate-850 border-slate-750 text-slate-500'
                  }`}>
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 uppercase tracking-wider">Acoustic Audio FX</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Subtle glass taps, pentatonic chimes & sweeps</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle Sound Effects"
                >
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Haptics Toggle */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
                    hapticsEnabled 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-850 border-slate-750 text-slate-500'
                  }`}>
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 uppercase tracking-wider">Tactile Haptics</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {sensory.isHapticsSupported() 
                        ? 'Precision mobile micro-vibrations for keypads & saves' 
                        : 'Simulated on desktop / Supported on Android & iOS'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleHaptics}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle Haptic Vibrations"
                >
                  <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Master Audio Gain</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  disabled={!soundEnabled}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1">
                  <span>Silent</span>
                  <span>Aura Balanced (35%)</span>
                  <span>Max</span>
                </div>
              </div>

            </div>

            {/* Live Interactive Sensory Testing Playground */}
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sensory Playground</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  Tap any trigger below to preview individual acoustic tones and companion haptic pulses:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  
                  {/* Tap Test */}
                  <button
                    type="button"
                    onClick={() => sensory.triggerTap()}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">Glass Tap</span>
                      <Play className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Keypad & Buttons</span>
                  </button>

                  {/* Harmony Switch Test */}
                  <button
                    type="button"
                    onClick={() => sensory.triggerTabSwitch()}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">Tab Chime</span>
                      <Play className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Navigation Switch</span>
                  </button>

                  {/* Atmosphere Sweep Test */}
                  <button
                    type="button"
                    onClick={() => sensory.triggerThemeSwitch()}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">Aura Sweep</span>
                      <Play className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Atmosphere / Mode</span>
                  </button>

                  {/* Vault Unlock Test */}
                  <button
                    type="button"
                    onClick={() => sensory.triggerUnlock()}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition">Vault Chord</span>
                      <Play className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">PIN Authentication</span>
                  </button>

                  {/* Dose Reward Test */}
                  <button
                    type="button"
                    onClick={() => sensory.triggerDoseLogged()}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition active:scale-95 cursor-pointer group col-span-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">Dose Reward Chime</span>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Pentatonic Cascade on Dose Logging</span>
                  </button>

                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Procedural Web Audio API</span>
                <span>0 ms Latency</span>
              </div>
            </div>

          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl md:col-span-2">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Settings className="w-4 h-4" />
            <span>Data Operations & Backup</span>
          </h2>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportFileChange} 
            accept=".json" 
            className="hidden" 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleExportData}
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group cursor-pointer"
            >
              <Download className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-sm font-semibold tracking-wider text-slate-200">Export Vault Data</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Download JSON Backup</span>
              </div>
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group cursor-pointer"
            >
              <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-sm font-semibold tracking-wider text-slate-200">Import Vault Data</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Restore from Backup</span>
              </div>
            </button>
          </div>

          {dataMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{dataMessage}</span>
            </div>
          )}

          {/* Developer & Studio Privileges Toggle - STRICTLY HIDDEN UNLESS UNLOCKED VIA 5-TAP CORNER */}
          {isStudioUnlocked && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">Aura Studio (Visual Page Builder)</span>
                    <span className="text-[9px] px-2 py-0.2 rounded-full font-mono font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Developer Mode Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Studio is currently active for this device. Click "Hide Studio" or tap the top-left corner 5 times to lock and hide it.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleStudioUnlock}
                className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide & Lock Studio</span>
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center bg-cyan-500/10 hover:bg-cyan-500/20 px-6 py-3 rounded-xl border border-cyan-500/20 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Secure Terminal</span>
            </button>
            
            <button 
              onClick={handlePurgeAllData}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Purge All Local Data (Irreversible)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Aura Luxury Feedback Confirmation Modal */}
      {feedbackModal && feedbackModal.isOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setFeedbackModal(null)}
        >
          <div 
            className="glass-panel relative w-full max-w-sm rounded-3xl border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setFeedbackModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition p-1.5 rounded-xl hover:bg-slate-800/60 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon with Halo */}
            <div className="relative mb-4 mt-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                feedbackModal.isError 
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-rose-500/10' 
                  : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'
              }`}>
                {feedbackModal.isError ? (
                  <AlertTriangle className="w-7 h-7 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                )}
              </div>
              <div className={`absolute -inset-1 rounded-2xl blur-md -z-10 animate-pulse ${
                feedbackModal.isError ? 'bg-rose-500/20' : 'bg-cyan-500/20'
              }`} />
            </div>

            {/* Micro-Label Badge */}
            <span className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1.5">
              {feedbackModal.badge}
            </span>

            {/* Title */}
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider mb-2">
              {feedbackModal.title}
            </h3>

            {/* Message Body */}
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {feedbackModal.message}
            </p>

            {/* Sub-message / Highlighted Alias Box */}
            {feedbackModal.subMessage && (
              <div className="w-full py-2.5 px-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold text-cyan-300 mb-5 flex items-center justify-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-slate-200">{feedbackModal.subMessage}</span>
              </div>
            )}

            {/* Confirm & Close Button */}
            <button
              onClick={() => setFeedbackModal(null)}
              className="w-full py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
