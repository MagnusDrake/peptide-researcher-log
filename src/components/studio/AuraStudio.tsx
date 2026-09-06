import React, { useState, useEffect } from "react";
import { AppLayoutConfig, LayoutPreset } from "../../types/layout";
import { Protocol, DoseLogEntry } from "../../types";
import { PRESET_TEMPLATES, resetLayoutConfig } from "../../utils/layoutStorage";
import { DraggableSectionList } from "./DraggableSectionList";
import { StyleCustomizerPanel } from "./StyleCustomizerPanel";
import { DailySchedule } from "../dashboard/DailySchedule";
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  Layers, 
  Palette, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Upload, 
  Check, 
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  Undo2
} from "lucide-react";

interface AuraStudioProps {
  currentConfig: AppLayoutConfig;
  onSaveConfig: (config: AppLayoutConfig) => void;
  onResetConfig: () => void;
  protocols: Protocol[];
  logs: DoseLogEntry[];
  onNavigateToDashboard: () => void;
}

export const AuraStudio: React.FC<AuraStudioProps> = ({
  currentConfig,
  onSaveConfig,
  onResetConfig,
  protocols,
  logs,
  onNavigateToDashboard,
}) => {
  const [draftConfig, setDraftConfig] = useState<AppLayoutConfig>(() => JSON.parse(JSON.stringify(currentConfig)));
  const [activeStudioTab, setActiveStudioTab] = useState<"sections" | "styles" | "presets">("sections");
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync draft if external config changes
  useEffect(() => {
    setDraftConfig(JSON.parse(JSON.stringify(currentConfig)));
  }, [currentConfig]);

  const hasChanges = JSON.stringify(draftConfig) !== JSON.stringify(currentConfig);

  const handleSave = () => {
    onSaveConfig(draftConfig);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleDiscard = () => {
    setDraftConfig(JSON.parse(JSON.stringify(currentConfig)));
  };

  const handleReset = () => {
    if (confirm("Reset layout and styles to factory Aura defaults?")) {
      const def = resetLayoutConfig();
      setDraftConfig(JSON.parse(JSON.stringify(def)));
      onResetConfig();
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  const handleApplyPreset = (preset: LayoutPreset) => {
    setDraftConfig(JSON.parse(JSON.stringify(preset.config)));
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftConfig, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura-layout-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.dashboardSections && parsed.styles) {
            setDraftConfig(parsed);
          } else {
            alert("Invalid Aura configuration JSON file.");
          }
        } catch (err) {
          alert("Could not parse JSON configuration file.");
        }
      };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1700px] mx-auto pb-20">
      
      {/* Studio Top Control Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow Ambient Cue */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Aura Visual Studio & Layout Workbench</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-widest">
            Drag-and-Drop Page Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Freely drag to reorder modules, toggle section visibility, test color themes, and instantly see live updates. When satisfied, click <strong>Save & Apply</strong> to update the live website.
          </p>
        </div>

        {/* Action Controls & Save Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {hasChanges && (
            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Reset to factory Aura layout"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs shadow-xl transition active:scale-95 cursor-pointer ${
              hasChanges
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25 animate-pulse"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasChanges ? "Save & Apply to Website" : "Saved & Applied"}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <span>View Live Site</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>Layout successfully applied to live website!</span>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Left Workbench (40%) / Right Live Canvas (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Workbench Controls (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Sub-tab Switcher */}
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveStudioTab("sections")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeStudioTab === "sections"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Modules Order</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudioTab("styles")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeStudioTab === "styles"
                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Style & Themes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStudioTab("presets")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeStudioTab === "presets"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Templates</span>
            </button>
          </div>

          {/* Tab 1: Sections Order & Visibility */}
          {activeStudioTab === "sections" && (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Dashboard Section Arrangement
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Grab the handles to drag & drop sections into any order, or use the eye icon to hide modules.
                </p>
              </div>

              <DraggableSectionList
                sections={draftConfig.dashboardSections}
                onReorder={(newSections) => {
                  setDraftConfig({
                    ...draftConfig,
                    dashboardSections: newSections
                  });
                }}
                onToggleVisibility={(sectionId) => {
                  setDraftConfig({
                    ...draftConfig,
                    dashboardSections: draftConfig.dashboardSections.map(s => 
                      s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
                    )
                  });
                }}
              />
            </div>
          )}

          {/* Tab 2: Style & Themes */}
          {activeStudioTab === "styles" && (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Visual Aesthetics & Density
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customize colors, surface glassmorphism, corner geometry, and header layouts.
                </p>
              </div>

              <StyleCustomizerPanel
                styles={draftConfig.styles}
                onChange={(newStyles) => {
                  setDraftConfig({
                    ...draftConfig,
                    styles: newStyles
                  });
                }}
              />
            </div>
          )}

          {/* Tab 3: Presets & Templates */}
          {activeStudioTab === "presets" && (
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Ready-to-Use Layout Presets
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click any template to instantly load a curated arrangement and aesthetic.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {PRESET_TEMPLATES.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-left transition flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 group-hover:scale-105 transition-transform">
                      {preset.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                          Apply
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Import / Export JSON */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Real-Time Live Preview Canvas (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sticky top-20">
          
          {/* Canvas Toolbar & Viewport Controls */}
          <div className="glass-panel p-3 rounded-2xl border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Canvas Preview</span>
            </div>

            {/* Viewport Toggles */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewViewport("desktop")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  previewViewport === "desktop" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport("tablet")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  previewViewport === "tablet" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport("mobile")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  previewViewport === "mobile" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 overflow-hidden flex justify-center shadow-inner min-h-[600px] max-h-[820px] overflow-y-auto">
            <div 
              className={`transition-all duration-300 w-full ${
                previewViewport === "desktop"
                  ? "max-w-full"
                  : previewViewport === "tablet"
                    ? "max-w-[768px] border-x border-slate-800 px-4 py-2 bg-slate-950 rounded-2xl shadow-2xl"
                    : "max-w-[390px] border-2 border-slate-800 px-3 py-4 bg-slate-950 rounded-[40px] shadow-2xl"
              }`}
            >
              {/* Dynamic Live Schedule Preview with Real-time Configuration */}
              <DailySchedule
                protocols={protocols}
                logs={logs}
                onLogSaved={() => {}}
                onProtocolsChanged={() => {}}
                customLayoutConfig={draftConfig}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
