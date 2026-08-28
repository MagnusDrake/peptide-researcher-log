import React, { useState } from 'react';
import { SyringeType } from '../../types';

interface SyringeVisualizerProps {
  syringeType: SyringeType;
  drawUnits: number;
  concentrationMcgPerUnit?: number;
  peptideName?: string;
  onUnitsChange?: (units: number) => void;
  interactive?: boolean;
}

export const SyringeVisualizer: React.FC<SyringeVisualizerProps> = ({
  syringeType,
  drawUnits,
  concentrationMcgPerUnit = 0,
  peptideName = 'Peptide Solution',
  onUnitsChange,
  interactive = true,
}) => {
  const [hoverUnits, setHoverUnits] = useState<number | null>(null);

  const maxUnits = syringeType === 'U-100' ? 100 : syringeType === 'U-50' ? 50 : 30;
  const clampedUnits = Math.min(Math.max(0, drawUnits), maxUnits);
  const currentUnits = hoverUnits !== null ? hoverUnits : clampedUnits;
  
  // Percent fill of barrel (from right 0% to left 100% or vertical top-down)
  // Let's render a clean, high-resolution horizontal syringe
  const fillPercentage = (currentUnits / maxUnits) * 100;
  const calculatedDoseMcg = concentrationMcgPerUnit > 0 ? (currentUnits * concentrationMcgPerUnit).toFixed(1) : null;
  const calculatedDoseMg = concentrationMcgPerUnit > 0 ? (currentUnits * concentrationMcgPerUnit / 1000).toFixed(2) : null;
  const volumeMl = (currentUnits * 0.01).toFixed(2);

  // Generate tick marks
  const ticks = [];
  const majorInterval = syringeType === 'U-100' ? 10 : syringeType === 'U-50' ? 5 : 5;
  const minorInterval = syringeType === 'U-100' ? 2 : 1;

  for (let i = 0; i <= maxUnits; i += minorInterval) {
    const isMajor = i % majorInterval === 0;
    const isMid = !isMajor && i % (majorInterval / 2) === 0;
    ticks.push({
      unit: i,
      isMajor,
      isMid,
      percent: (i / maxUnits) * 100
    });
  }

  // SVG dimensions - calibrated so plunger never clips or overflows viewBox
  const svgWidth = 860;
  const svgHeight = 180;
  const barrelStartX = 120;
  const barrelWidth = 350;
  const barrelEndX = barrelStartX + barrelWidth; // 470
  const barrelTopY = 40;
  const barrelBottomY = 140;
  const barrelHeight = barrelBottomY - barrelTopY;
  const rodLength = 345;

  // Plunger position: 0 units is at barrelStartX (left), maxUnits is at barrelEndX (right)
  const plungerX = barrelStartX + (currentUnits / maxUnits) * barrelWidth;

  return (
    <div className="flex flex-col items-center w-full min-w-0 max-w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header Info */}
      <div className="w-full min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base shrink-0">
            💉
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">Syringe Visualizer</div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{syringeType}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-normal shrink-0">
                {syringeType === 'U-100' ? '1.0 mL' : syringeType === 'U-50' ? '0.5 mL' : '0.3 mL'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Readout Badges (3-column grid on mobile, flex on desktop) */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:px-3 sm:py-1.5 text-center">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase truncate">Draw</div>
            <div className="text-sm sm:text-lg font-extrabold text-cyan-400 font-mono">
              {currentUnits.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">u</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:px-3 sm:py-1.5 text-center">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase truncate">Volume</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
              {volumeMl} <span className="text-[10px] font-normal text-slate-400">mL</span>
            </div>
          </div>

          {calculatedDoseMcg ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:px-3 sm:py-1.5 text-center">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase truncate">Dose</div>
              <div className="text-xs sm:text-base font-bold text-violet-400 font-mono truncate">
                {Number(calculatedDoseMg) >= 1 ? `${calculatedDoseMg}mg` : `${calculatedDoseMcg}mcg`}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:px-3 sm:py-1.5 text-center">
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase truncate">Type</div>
              <div className="text-xs font-bold text-slate-300 font-mono">{syringeType}</div>
            </div>
          )}
        </div>
      </div>

      {/* Syringe SVG Graphic */}
      <div className="w-full min-w-0 max-w-full py-1 flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-full h-auto select-none"
          style={{ maxHeight: '140px' }}
        >
          <defs>
            {/* Fluid Gradient */}
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>

            {/* Glass Barrel Gradient */}
            <linearGradient id="barrelGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="15%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="85%" stopColor="#0f172a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            {/* Plunger Rubber Stopper Gradient */}
            <linearGradient id="rubberStopper" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Needle Metal Gradient */}
            <linearGradient id="metalNeedle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* === NEEDLE & HUB (Left Side) === */}
          {/* Needle Shaft */}
          <line
            x1="15"
            y1="90"
            x2="85"
            y2="90"
            stroke="url(#metalNeedle)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Needle Beveled Tip */}
          <polygon points="13,88.5 18,90 13,91.5" fill="#94a3b8" />
          
          {/* Needle Hub (Luer connection) */}
          <polygon
            points="85,76 108,80 120,82 120,98 108,100 85,104"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <rect x="108" y="78" width="12" height="24" rx="2" fill="#0369a1" />

          {/* === BARREL FLANGE (Right Side Finger Rest) === */}
          <rect
            x={barrelEndX - 2}
            y="25"
            width="14"
            height="130"
            rx="4"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* === PLUNGER ROD (extends to the right) === */}
          <rect
            x={plungerX + 20}
            y="83"
            width={rodLength}
            height="14"
            fill="#475569"
            stroke="#64748b"
            strokeWidth="1"
          />
          {/* Plunger Thumb Press */}
          <rect
            x={plungerX + 20 + rodLength}
            y="52"
            width="12"
            height="76"
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* === LIQUID FILL IN BARREL === */}
          {currentUnits > 0 && (
            <g>
              <rect
                x={barrelStartX}
                y={barrelTopY + 2}
                width={Math.max(0, plungerX - barrelStartX)}
                height={barrelHeight - 4}
                fill="url(#liquidGrad)"
              />
              {/* Fluid Meniscus Bubble Effect */}
              <ellipse
                cx={plungerX}
                cy={90}
                rx="4"
                ry={(barrelHeight - 6) / 2}
                fill="#38bdf8"
                opacity="0.7"
              />
            </g>
          )}

          {/* === PLUNGER RUBBER STOPPER (Inside Barrel) === */}
          <g transform={`translate(${plungerX}, 0)`}>
            {/* Rubber main body */}
            <rect
              x="0"
              y={barrelTopY + 1}
              width="22"
              height={barrelHeight - 2}
              rx="2"
              fill="url(#rubberStopper)"
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Rubber Ring Ridges */}
            <line x1="6" y1={barrelTopY + 2} x2="6" y2={barrelBottomY - 2} stroke="#64748b" strokeWidth="2" />
            <line x1="16" y1={barrelTopY + 2} x2="16" y2={barrelBottomY - 2} stroke="#64748b" strokeWidth="2" />
            
            {/* Indicator Line on Stopper Front Ring */}
            <line
              x1="0"
              y1={barrelTopY - 8}
              x2="0"
              y2={barrelBottomY + 8}
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="2,2"
              filter="url(#glow)"
            />
          </g>

          {/* === GLASS BARREL OUTLINE === */}
          <rect
            x={barrelStartX}
            y={barrelTopY}
            width={barrelWidth}
            height={barrelHeight}
            rx="4"
            fill="url(#barrelGlass)"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Glass Highlight Reflection */}
          <line
            x1={barrelStartX + 5}
            y1={barrelTopY + 8}
            x2={barrelEndX - 5}
            y2={barrelTopY + 8}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* === TICK MARKS & LABELS === */}
          {ticks.map(({ unit, isMajor, isMid, percent }) => {
            const x = barrelStartX + (percent / 100) * barrelWidth;
            const tickLength = isMajor ? 26 : isMid ? 18 : 10;

            return (
              <g key={`tick-${unit}`}>
                {/* Top Ticks */}
                <line
                  x1={x}
                  y1={barrelTopY}
                  x2={x}
                  y2={barrelTopY + tickLength}
                  stroke={unit <= currentUnits ? '#ffffff' : '#94a3b8'}
                  strokeWidth={isMajor ? 2 : 1.2}
                  opacity={unit <= currentUnits ? 0.95 : 0.7}
                />

                {/* Major Tick Numbers (Rendered below top tick) */}
                {isMajor && (
                  <text
                    x={x}
                    y={barrelTopY + 38}
                    textAnchor="middle"
                    fill={unit <= currentUnits ? '#38bdf8' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    {unit}
                  </text>
                )}

                {/* Bottom Minor Ticks */}
                <line
                  x1={x}
                  y1={barrelBottomY}
                  x2={x}
                  y2={barrelBottomY - (isMajor ? 14 : 7)}
                  stroke="#94a3b8"
                  strokeWidth={isMajor ? 1.5 : 1}
                  opacity="0.5"
                />
              </g>
            );
          })}

          {/* Syringe Branding / Label Text on Barrel */}
          <text
            x={barrelStartX + barrelWidth / 2}
            y={barrelBottomY - 14}
            textAnchor="middle"
            fill="#64748b"
            fontSize="9"
            letterSpacing="2"
            fontWeight="bold"
            className="select-none uppercase"
          >
            {peptideName} • {syringeType} (100U = 1mL)
          </text>
        </svg>
      </div>

      {/* Interactive Slider & Adjustment Controls */}
      {interactive && (
        <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>0 units</span>
            <span className="font-semibold text-cyan-400 hidden sm:inline">Drag or Adjust Target Units</span>
            <span className="font-semibold text-cyan-400 sm:hidden">Adjust Units</span>
            <span>{maxUnits} units</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onUnitsChange && onUnitsChange(Math.max(0, currentUnits - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-bold border border-slate-700 transition"
              title="Decrease by 1 unit"
            >
              - 1 U
            </button>

            <input
              type="range"
              min="0"
              max={maxUnits}
              step="0.5"
              value={currentUnits}
              onChange={(e) => onUnitsChange && onUnitsChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <button
              onClick={() => onUnitsChange && onUnitsChange(Math.min(maxUnits, currentUnits + 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-bold border border-slate-700 transition"
              title="Increase by 1 unit"
            >
              + 1 U
            </button>
          </div>

          {/* Helpful drawing tip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 w-full min-w-0">
            <span className="flex items-start sm:items-center gap-1.5 leading-snug">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0 mt-1 sm:mt-0"></span>
              <span>Draw until the <strong className="text-slate-200">front ring</strong> of the stopper aligns with <strong className="text-cyan-400 font-mono">{currentUnits.toFixed(1)}</strong> mark.</span>
            </span>
            <span className="text-slate-500 font-mono shrink-0 text-[10px] sm:text-[11px]">{volumeMl} mL total fluid</span>
          </div>
        </div>
      )}
    </div>
  );
};
