export type DashboardSectionId = 
  | 'hero_header'
  | 'today_schedule'
  | 'weekly_adherence'
  | 'recent_history'
  | 'routines_manager'
  | 'supplier_banner';

export interface DashboardSectionConfig {
  id: DashboardSectionId;
  label: string;
  description: string;
  iconName: string;
  isVisible: boolean;
  category: 'core' | 'routines' | 'analytics' | 'sourcing';
}

export type AccentTheme = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' | 'slate';
export type CardRounding = 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-none';
export type GlassIntensity = 'subtle' | 'medium' | 'deep' | 'solid';
export type SpacingDensity = 'compact' | 'balanced' | 'cinematic';
export type HeroLayout = 'split' | 'centered' | 'compact';

export interface LayoutStyleConfig {
  accentTheme: AccentTheme;
  cardRounding: CardRounding;
  glassIntensity: GlassIntensity;
  spacingDensity: SpacingDensity;
  heroLayout: HeroLayout;
  showGlowBorders: boolean;
  showSectionBadges: boolean;
}

export interface AppLayoutConfig {
  version: number;
  lastUpdated: string;
  dashboardSections: DashboardSectionConfig[];
  styles: LayoutStyleConfig;
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: AppLayoutConfig;
}
