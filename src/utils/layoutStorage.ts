import { AppLayoutConfig, DashboardSectionConfig, LayoutStyleConfig, LayoutPreset } from '../types/layout';

export const DEFAULT_DASHBOARD_SECTIONS: DashboardSectionConfig[] = [
  {
    id: 'hero_header',
    label: "Hero Date & Quick Actions",
    description: "Today's date banner, New Routine & Quick Dose buttons, and completion progress meter",
    iconName: 'Calendar',
    isVisible: true,
    category: 'core'
  },
  {
    id: 'today_schedule',
    label: "Today's Scheduled Administrations",
    description: "Compounds scheduled for injection today with one-click dose logging actions",
    iconName: 'ThermometerSnowflake',
    isVisible: true,
    category: 'core'
  },
  {
    id: 'weekly_adherence',
    label: "Weekly Adherence Timeline",
    description: "7-day routine timeline with streaks and administration consistency tracking",
    iconName: 'CalendarCheck2',
    isVisible: true,
    category: 'analytics'
  },
  {
    id: 'recent_history',
    label: "Recent Administrations Timeline",
    description: "Compact chronological feed of recently logged doses and injection sites",
    iconName: 'Activity',
    isVisible: true,
    category: 'analytics'
  },
  {
    id: 'routines_manager',
    label: "My Peptide Routines & Active Vials",
    description: "Active protocol vials, freshness shelf-life countdowns, and schedule controls",
    iconName: 'Layers',
    isVisible: true,
    category: 'routines'
  }
];

export const DEFAULT_LAYOUT_STYLES: LayoutStyleConfig = {
  accentTheme: 'cyan',
  cardRounding: 'rounded-3xl',
  glassIntensity: 'medium',
  spacingDensity: 'balanced',
  heroLayout: 'split',
  showGlowBorders: true,
  showSectionBadges: true
};

export const DEFAULT_APP_LAYOUT_CONFIG: AppLayoutConfig = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  dashboardSections: DEFAULT_DASHBOARD_SECTIONS,
  styles: DEFAULT_LAYOUT_STYLES
};

export const PRESET_TEMPLATES: LayoutPreset[] = [
  {
    id: 'default',
    name: 'Aura Luxury (Default)',
    description: 'Balanced luxury layout with Today’s tasks first, followed by analytics and active routines.',
    icon: '✨',
    config: {
      ...DEFAULT_APP_LAYOUT_CONFIG,
      dashboardSections: [...DEFAULT_DASHBOARD_SECTIONS],
      styles: { ...DEFAULT_LAYOUT_STYLES }
    }
  },
  {
    id: 'action_first',
    name: 'Action-First Minimalist',
    description: 'Streamlined task-focused layout prioritizing today’s doses and instant quick logging.',
    icon: '⚡',
    config: {
      version: 1,
      lastUpdated: new Date().toISOString(),
      dashboardSections: [
        { ...DEFAULT_DASHBOARD_SECTIONS[0], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[1], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[4], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[2], isVisible: false },
        { ...DEFAULT_DASHBOARD_SECTIONS[3], isVisible: false }
      ],
      styles: {
        accentTheme: 'emerald',
        cardRounding: 'rounded-2xl',
        glassIntensity: 'solid',
        spacingDensity: 'compact',
        heroLayout: 'compact',
        showGlowBorders: false,
        showSectionBadges: true
      }
    }
  },
  {
    id: 'vials_heavy',
    name: 'Routines & Vials Focus',
    description: 'Protocol-centric layout putting all active vials, freshness meters, and schedules at the very top.',
    icon: '🧪',
    config: {
      version: 1,
      lastUpdated: new Date().toISOString(),
      dashboardSections: [
        { ...DEFAULT_DASHBOARD_SECTIONS[0], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[4], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[1], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[2], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[3], isVisible: true }
      ],
      styles: {
        accentTheme: 'violet',
        cardRounding: 'rounded-3xl',
        glassIntensity: 'medium',
        spacingDensity: 'balanced',
        heroLayout: 'split',
        showGlowBorders: true,
        showSectionBadges: true
      }
    }
  },
  {
    id: 'analytics_focus',
    name: 'Analytics & Adherence Tracker',
    description: 'Deep data orientation with weekly adherence timelines and administration feeds upfront.',
    icon: '📊',
    config: {
      version: 1,
      lastUpdated: new Date().toISOString(),
      dashboardSections: [
        { ...DEFAULT_DASHBOARD_SECTIONS[0], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[2], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[3], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[1], isVisible: true },
        { ...DEFAULT_DASHBOARD_SECTIONS[4], isVisible: true }
      ],
      styles: {
        accentTheme: 'cyan',
        cardRounding: 'rounded-3xl',
        glassIntensity: 'deep',
        spacingDensity: 'cinematic',
        heroLayout: 'centered',
        showGlowBorders: true,
        showSectionBadges: true
      }
    }
  }
];

const STORAGE_KEY = 'aura_custom_layout_config';

export function loadLayoutConfig(): AppLayoutConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_LAYOUT_CONFIG;
    const parsed = JSON.parse(raw) as AppLayoutConfig;
    
    // Filter out obsolete/removed sections and ensure valid sections
    const validDefaultMap = new Map(DEFAULT_DASHBOARD_SECTIONS.map(s => [s.id, s]));
    const filteredSections = (parsed.dashboardSections || [])
      .filter(s => validDefaultMap.has(s.id as any))
      .map(s => {
        const def = validDefaultMap.get(s.id as any)!;
        return {
          ...def,
          ...s
        };
      });

    const existingIds = new Set(filteredSections.map(s => s.id));
    const missingSections = DEFAULT_DASHBOARD_SECTIONS.filter(s => !existingIds.has(s.id));
    
    return {
      ...DEFAULT_APP_LAYOUT_CONFIG,
      ...parsed,
      dashboardSections: [...filteredSections, ...missingSections],
      styles: {
        ...DEFAULT_LAYOUT_STYLES,
        ...(parsed.styles || {})
      }
    };
  } catch (err) {
    console.warn('Failed to parse layout config, using defaults', err);
    return DEFAULT_APP_LAYOUT_CONFIG;
  }
}

export function saveLayoutConfig(config: AppLayoutConfig): void {
  try {
    const updated = {
      ...config,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('aura_layout_changed', { detail: updated }));
  } catch (err) {
    console.error('Failed to save layout config', err);
  }
}

export function resetLayoutConfig(): AppLayoutConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('aura_layout_changed', { detail: DEFAULT_APP_LAYOUT_CONFIG }));
  } catch (err) {
    console.error('Failed to reset layout config', err);
  }
  return DEFAULT_APP_LAYOUT_CONFIG;
}
