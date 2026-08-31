import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Download, Upload, Shield, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { db } from '../../db';
import { exportDatabaseToJson, triggerDownload, importDatabaseFromJson } from '../../utils/exportImport';

interface ProfileSettingsProps { onLogout: () => void; }

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const [name, setName] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [dataMessage, setDataMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleExportData = async () => {
    try {
      const json = await exportDatabaseToJson();
      const filename = `aura_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
      triggerDownload(json, filename, 'application/json');
      setDataMessage('Vault data exported successfully.');
      setTimeout(() => setDataMessage(''), 3000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export vault data.');
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
          alert(res.message);
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
    </div>
  );
};
