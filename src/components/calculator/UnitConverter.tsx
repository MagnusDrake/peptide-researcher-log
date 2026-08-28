import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Equal } from 'lucide-react';
import { convertUnits } from '../../utils/calculations';

export const UnitConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<number | string>(500);
  const [fromUnit, setFromUnit] = useState<'mg' | 'mcg' | 'ml' | 'units'>('mcg');
  const [toUnit, setToUnit] = useState<'mg' | 'mcg' | 'ml' | 'units'>('units');
  const [concentrationMgMl, setConcentrationMgMl] = useState<number | string>(2.5);

  const convertedValue = convertUnits(Number(inputValue) || 0, fromUnit, toUnit, Number(concentrationMgMl) || 0.1);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(convertedValue);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Biochemical Unit Converter</span>
        </div>
        <h1 className="text-[0.85rem] font-bold text-white uppercase tracking-widest">
          Peptide & Syringe Unit Converter
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Convert instantly across milligrams (mg), micrograms (mcg), volume (mL), and insulin syringe units based on active vial concentration.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
        {/* Solution Concentration Basis */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase block">Solution Concentration</span>
            <span className="text-xs text-slate-500">Required for volume & unit conversions</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.01"
              step="0.5"
              placeholder="0"
              value={concentrationMgMl}
              onChange={(e) => setConcentrationMgMl(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm rounded-lg p-2 text-center"
            />
            <span className="text-xs text-slate-400 font-medium">mg / mL</span>
          </div>
        </div>

        {/* Converter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* FROM */}
          <div className="md:col-span-5 bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase">Convert From</label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-xl font-bold font-mono rounded-lg p-3 outline-none focus:border-amber-400"
            />
            <div className="grid grid-cols-4 gap-1 mt-1">
              {(['mcg', 'mg', 'units', 'ml'] as const).map(u => (
                <button
                  key={`from-${u}`}
                  type="button"
                  onClick={() => setFromUnit(u)}
                  className={`py-1.5 rounded text-xs font-bold uppercase transition ${
                    fromUnit === u
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition active:scale-95 shadow-md"
              title="Swap From and To"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO */}
          <div className="md:col-span-5 bg-slate-900/90 p-4 rounded-xl border border-amber-500/30 flex flex-col gap-2 shadow-lg shadow-amber-950/20">
            <label className="text-xs font-semibold text-amber-400 uppercase">Result (To)</label>
            <div className="w-full bg-slate-950 border border-amber-500/30 text-amber-300 text-xl font-bold font-mono rounded-lg p-3 flex items-center justify-between">
              <span>{convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              <span className="text-xs text-slate-500 font-normal uppercase">{toUnit}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {(['mcg', 'mg', 'units', 'ml'] as const).map(u => (
                <button
                  key={`to-${u}`}
                  type="button"
                  onClick={() => setToUnit(u)}
                  className={`py-1.5 rounded text-xs font-bold uppercase transition ${
                    toUnit === u
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reference Equivalency Cheatsheet */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
          <div className="font-bold text-slate-300 flex items-center gap-1.5">
            <Equal className="w-4 h-4 text-amber-400" />
            <span>Standard Mathematical Equivalencies</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900 p-2 rounded">1 mg = 1,000 mcg</div>
            <div className="bg-slate-900 p-2 rounded">1 mL = 100 Units (U-100)</div>
            <div className="bg-slate-900 p-2 rounded">1 Unit = 0.01 mL</div>
            <div className="bg-slate-900 p-2 rounded">10 Units = 0.1 mL</div>
          </div>
        </div>
      </div>
    </div>
  );
};
