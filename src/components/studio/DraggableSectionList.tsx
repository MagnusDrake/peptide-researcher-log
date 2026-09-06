import React, { useState } from 'react';
import { DashboardSectionConfig } from '../../types/layout';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  ThermometerSnowflake, 
  CalendarCheck2, 
  Activity, 
  Layers, 
  ShieldCheck
} from 'lucide-react';

interface DraggableSectionListProps {
  sections: DashboardSectionConfig[];
  onReorder: (newSections: DashboardSectionConfig[]) => void;
  onToggleVisibility: (sectionId: string) => void;
}

export const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  sections,
  onReorder,
  onToggleVisibility,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar': return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'ThermometerSnowflake': return <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />;
      case 'CalendarCheck2': return <CalendarCheck2 className="w-4 h-4 text-blue-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-purple-400" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-teal-400" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...sections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onReorder(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    onReorder(updated);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-1">
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Drag handle to reorder modules
        </span>
        <span className="text-[10px] text-cyan-400 font-mono">
          {sections.filter(s => s.isVisible).length} / {sections.length} Visible
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {sections.map((section, idx) => {
          const isDragging = draggedIndex === idx;
          const isOver = dragOverIndex === idx;

          return (
            <div
              key={section.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 select-none ${
                isDragging
                  ? 'opacity-40 border-cyan-500/50 bg-cyan-950/20 scale-[0.98]'
                  : isOver
                  ? 'border-cyan-400 bg-slate-800/90 scale-[1.01] shadow-lg shadow-cyan-500/10'
                  : section.isVisible
                  ? 'border-slate-800/80 bg-slate-900/80 hover:border-slate-700'
                  : 'border-slate-800/40 bg-slate-950/50 opacity-60'
              }`}
            >
              {/* Left Drag Grip & Icon & Label */}
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400 p-1 rounded-lg hover:bg-slate-800 transition"
                  title="Click and drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                  {getIcon(section.iconName)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold truncate ${section.isVisible ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                      {section.label}
                    </span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                      section.category === 'core' 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                        : section.category === 'analytics'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : section.category === 'routines'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {section.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 hidden sm:block">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Right Order Arrows & Visibility Toggle */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Up / Down Quick Arrow Controls */}
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Eye Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleVisibility(section.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    section.isVisible
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                      : 'border-slate-800 bg-slate-900 text-slate-600 hover:text-slate-400'
                  }`}
                  title={section.isVisible ? 'Hide this section from page' : 'Show this section on page'}
                >
                  {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
