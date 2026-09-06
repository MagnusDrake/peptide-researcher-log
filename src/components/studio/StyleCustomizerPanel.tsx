import React from "react";
import { 
  LayoutStyleConfig, 
  AccentTheme, 
  CardRounding, 
  GlassIntensity, 
  SpacingDensity, 
  HeroLayout 
} from "../../types/layout";
import { Palette, Sparkles, LayoutGrid, Check, Sliders, Box } from "lucide-react";

interface StyleCustomizerPanelProps {
  styles: LayoutStyleConfig;
  onChange: (newStyles: LayoutStyleConfig) => void;
}

const ACCENT_OPTIONS: { id: AccentTheme; label: string; bgClass: string; borderClass: string; glowClass: string }[] = [
  { id: "cyan", label: "Cyan Aura", bgClass: "bg-cyan-500", borderClass: "border-cyan-400", glowClass: "shadow-cyan-500/30" },
  { id: "emerald", label: "Bio Emerald", bgClass: "bg-emerald-500", borderClass: "border-emerald-400", glowClass: "shadow-emerald-500/30" },
  { id: "violet", label: "Royal Violet", bgClass: "bg-violet-500", borderClass: "border-violet-400", glowClass: "shadow-violet-500/30" },
  { id: "amber", label: "Solar Amber", bgClass: "bg-amber-500", borderClass: "border-amber-400", glowClass: "shadow-amber-500/30" },
  { id: "rose", label: "Cyber Rose", bgClass: "bg-rose-500", borderClass: "border-rose-400", glowClass: "shadow-rose-500/30" },
  { id: "slate", label: "Obsidian Pure", bgClass: "bg-slate-400", borderClass: "border-slate-300", glowClass: "shadow-slate-400/20" },
];

const ROUNDING_OPTIONS: { id: CardRounding; label: string; previewClass: string }[] = [
  { id: "rounded-none", label: "Sharp Rect", previewClass: "rounded-none" },
  { id: "rounded-xl", label: "Subtle (XL)", previewClass: "rounded-xl" },
  { id: "rounded-2xl", label: "Smooth (2XL)", previewClass: "rounded-2xl" },
  { id: "rounded-3xl", label: "Ultra (3XL)", previewClass: "rounded-3xl" },
];

const GLASS_OPTIONS: { id: GlassIntensity; label: string; desc: string }[] = [
  { id: "subtle", label: "Subtle Glass", desc: "Minimal tint & light borders" },
  { id: "medium", label: "Signature Aura", desc: "Obsidian glass with ambient reflections" },
  { id: "deep", label: "Deep Frosted", desc: "High blur & heavy background depth" },
  { id: "solid", label: "Solid Slate", desc: "100% opaque high-contrast cards" },
];

const DENSITY_OPTIONS: { id: SpacingDensity; label: string; desc: string }[] = [
  { id: "compact", label: "Dense & Compact", desc: "Tighter padding for maximal data visibility" },
  { id: "balanced", label: "Balanced Default", desc: "Optimal breathing room on mobile and desktop" },
  { id: "cinematic", label: "Cinematic Spacious", desc: "Generous luxury gaps and wide margins" },
];

const HERO_OPTIONS: { id: HeroLayout; label: string; desc: string }[] = [
  { id: "split", label: "Split Header", desc: "Title left, action buttons & progress meter right" },
  { id: "centered", label: "Centered Hero", desc: "Focused centerpiece with balanced action bar" },
  { id: "compact", label: "Compact Bar", desc: "Minimal height single-row command strip" },
];

export const StyleCustomizerPanel: React.FC<StyleCustomizerPanelProps> = ({
  styles,
  onChange,
}) => {
  const updateStyle = <K extends keyof LayoutStyleConfig>(key: K, value: LayoutStyleConfig[K]) => {
    onChange({
      ...styles,
      [key]: value
    });
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Accent Color Palette */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Brand Accent Color</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ACCENT_OPTIONS.map(acc => {
            const isSelected = styles.accentTheme === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => updateStyle("accentTheme", acc.id)}
                className={`p-2.5 rounded-2xl border transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? `${acc.borderClass} bg-slate-900 shadow-md ${acc.glowClass} scale-102`
                    : "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${acc.bgClass} flex items-center justify-center text-slate-950 shadow-inner`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-semibold text-slate-300 whitespace-nowrap">
                  {acc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Corner Rounding */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <Box className="w-3.5 h-3.5 text-purple-400" />
          <span>Card Corner Geometry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROUNDING_OPTIONS.map(opt => {
            const isSelected = styles.cardRounding === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateStyle("cardRounding", opt.id)}
                className={`p-3 border transition flex flex-col items-center gap-2 cursor-pointer ${opt.previewClass} ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/30 text-white shadow-md shadow-cyan-500/10 font-bold"
                    : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className={`w-8 h-5 border border-dashed ${isSelected ? "border-cyan-400 bg-cyan-500/20" : "border-slate-600"} ${opt.previewClass}`} />
                <span className="text-xs font-semibold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Glassmorphism & Depth */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Glassmorphism & Surface Depth</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GLASS_OPTIONS.map(opt => {
            const isSelected = styles.glassIntensity === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateStyle("glassIntensity", opt.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "border-cyan-400 bg-slate-900 text-white shadow-md shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacing & Density */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Layout Density & Margins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DENSITY_OPTIONS.map(opt => {
            const isSelected = styles.spacingDensity === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateStyle("spacingDensity", opt.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "border-cyan-400 bg-slate-900 text-white shadow-md shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Header Layout */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>Hero Header Arrangement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {HERO_OPTIONS.map(opt => {
            const isSelected = styles.heroLayout === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateStyle("heroLayout", opt.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "border-cyan-400 bg-slate-900 text-white shadow-md shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Extras */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Ambient Glow Borders</span>
            <span className="text-[10px] text-slate-500">Enable neon gradient aura accents on featured cards</span>
          </div>
          <input
            type="checkbox"
            checked={styles.showGlowBorders}
            onChange={(e) => updateStyle("showGlowBorders", e.target.checked)}
            className="w-4 h-4 accent-cyan-400 cursor-pointer rounded"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Section Category Badges</span>
            <span className="text-[10px] text-slate-500">Display tracked uppercase category tags on section headers</span>
          </div>
          <input
            type="checkbox"
            checked={styles.showSectionBadges}
            onChange={(e) => updateStyle("showSectionBadges", e.target.checked)}
            className="w-4 h-4 accent-cyan-400 cursor-pointer rounded"
          />
        </label>
      </div>

    </div>
  );
};
