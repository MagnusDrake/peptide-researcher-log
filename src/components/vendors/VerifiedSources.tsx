import React from 'react';
import { ShieldCheck, ExternalLink, TestTube2, FlaskConical, Beaker, CheckCircle2 } from 'lucide-react';

export const VerifiedSources: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="mb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Trusted Supply Chain</span>
        </div>
        <h1 className="text-[0.85rem] font-bold text-slate-100 uppercase tracking-widest uppercase">
          Verified Sources & Vendors
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          The research peptide space is flooded with under-dosed and untested products. We only recommend vendors who provide rigorous 3rd-party HPLC testing and mass spectrometry for every batch.
        </p>
      </div>

      {/* Featured Affiliate Card */}
      <div className="relative group rounded-3xl overflow-hidden mt-4">
        {/* Animated Glow Border Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 animate-pulse"></div>
        <div className="absolute inset-[1px] bg-slate-950 rounded-[23px] z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 glass-panel p-6 sm:p-8 rounded-[23px] border-none flex flex-col md:flex-row items-center gap-8">
          
          {/* Vendor Logo / Identity */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shrink-0">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Beaker className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-wider uppercase mb-1">Amino Club</h2>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3rd Party Tested</span>
            </div>
          </div>

          {/* Value Prop */}
          <div className="w-full md:w-2/3 flex flex-col items-start text-left">
            <h3 className="text-xl font-black text-white mb-2">Premium Research Compounds</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Amino Club provides exceptionally high-purity peptides with verified certificates of analysis (COAs) for every batch. Perfect for researchers demanding absolute precision in their protocols.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <TestTube2 className="w-4 h-4 text-cyan-400" />
                <span>99%+ Purity</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>Fast Shipping</span>
              </div>
            </div>

            {/* Affiliate CTA */}
            <div className="w-full bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-400">Support Aura Peptides</span>
                <span className="text-xs font-semibold text-slate-200">Use code <strong className="text-cyan-400 text-sm tracking-wider mx-1">AURAPEPTIDES</strong> at checkout</span>
              </div>
              
              <a 
                href="https://aminoclub.com?utm_source=affiliate_marketing&code=AURAPEPTIDES" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition"
              >
                <span>Visit Amino Club</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};
