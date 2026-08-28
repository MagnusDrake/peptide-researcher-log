import React, { useState, useEffect } from 'react';
import { User, Lock, Download, Upload, Shield, Settings, AlertTriangle } from 'lucide-react';

interface ProfileSettingsProps { onLogout: () => void; }

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const [name, setName] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  
  useEffect(() => {
    const savedName = localStorage.getItem('aura_researcher_name') || 'Lead Researcher';
    setName(savedName);
  }, []);

  const handleSaveName = () => {
    localStorage.setItem('aura_researcher_name', name);
    alert('Profile name updated successfully.');
  };

  const handleUpdatePin = () => {
    const savedPin = localStorage.getItem('aura_pin') || '0000';
    if (currentPin !== savedPin) {
      setPinMessage('Incorrect current PIN.');
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinMessage('New PIN must be exactly 4 digits.');
      return;
    }
    localStorage.setItem('aura_pin', newPin);
    setPinMessage('Vault PIN successfully updated.');
    setCurrentPin('');
    setNewPin('');
    setTimeout(() => setPinMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest uppercase">
          RESEARCHER PROFILE
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Manage your Vault identity and security parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Identity Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl h-fit">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <User className="w-4 h-4" />
            <span>Identity Configuration</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Researcher Alias</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                placeholder="Enter alias..."
              />
            </div>
            
            <button 
              onClick={handleSaveName}
              className="w-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/30 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Update Identity
            </button>
          </div>
        </div>

        {/* Security Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl h-fit">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Shield className="w-4 h-4" />
            <span>Vault Security</span>
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
              className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Change PIN</span>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl md:col-span-2">
          <h2 className="text-[0.65rem] font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Settings className="w-4 h-4" />
            <span>Data Operations</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group">
              <Download className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-sm font-semibold tracking-wider text-slate-200">Export Vault Data</span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Download JSON Backup</span>
              </div>
            </button>
            
            <button className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-center gap-3 transition-all group">
              <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-sm font-semibold tracking-wider text-slate-200">Import Vault Data</span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Restore from Backup</span>
              </div>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center bg-cyan-500/10 hover:bg-cyan-500/20 px-6 py-3 rounded-xl border border-cyan-500/20"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Secure Terminal</span>
          </button>
          
          <button className="flex items-center gap-2 text-rose-500/70 hover:text-rose-400 text-xs font-semibold uppercase tracking-widest transition-colors w-full sm:w-auto justify-center">
            <AlertTriangle className="w-4 h-4" />
            <span>Purge All Local Data (Irreversible)</span>
          </button>
        </div>
        </div>

      </div>
    </div>
  );
};
