export type LightPalette = 'alabaster' | 'platinum' | 'ceramic' | 'glacier';
export type DarkPalette = 'obsidian' | 'stealth' | 'emerald' | 'nebula';

export interface ThemePaletteConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  canvasHex: string;
  cardHex: string;
  borderHex: string;
  textHex: string;
  accentHex: string;
  icon: string;
}

export type LightPaletteConfig = ThemePaletteConfig;
export type DarkPaletteConfig = ThemePaletteConfig;

export const LIGHT_PALETTES: Record<LightPalette, LightPaletteConfig> = {
  alabaster: {
    id: 'alabaster',
    name: 'Warm Alabaster',
    tagline: 'Quiet Luxury & Organic Warmth',
    description: 'Creamy Nordic travertine with deep espresso typography. Gentle on the eyes, calming, and glare-free.',
    canvasHex: '#EFECE6',
    cardHex: '#F8F6F0',
    borderHex: '#DDD6CA',
    textHex: '#1C1917',
    accentHex: '#0E7490',
    icon: '🌾',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Slate',
    tagline: 'Precision High-Tech Alloy',
    description: 'Milled aerospace platinum with midnight slate ink. Modern, crisp, and high-contrast.',
    canvasHex: '#E4E7EC',
    cardHex: '#F2F4F7',
    borderHex: '#CDD3DC',
    textHex: '#0F172A',
    accentHex: '#0284C7',
    icon: '⚙️',
  },
  ceramic: {
    id: 'ceramic',
    name: 'Oatmeal Ceramic',
    tagline: 'Earthy Bio-Apothecary Clay',
    description: 'Unglazed tactile pottery tones with obsidian ink. Warm, relaxed, and distinctively grounded.',
    canvasHex: '#E9E6DF',
    cardHex: '#F4F2EC',
    borderHex: '#D4CFC4',
    textHex: '#18181B',
    accentHex: '#B45309',
    icon: '🏺',
  },
  glacier: {
    id: 'glacier',
    name: 'Glacier Mist',
    tagline: 'Clean Cryo-Lab Frosted Mist',
    description: 'Cool frosted titanium and ice crystal surfaces with deep marine ink. Clean, clinical, and refreshing.',
    canvasHex: '#DEE5ED',
    cardHex: '#EDF3F9',
    borderHex: '#C4D1DE',
    textHex: '#0A1120',
    accentHex: '#0891B2',
    icon: '🧊',
  },
};

export const DARK_PALETTES: Record<DarkPalette, DarkPaletteConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Cyan',
    tagline: 'Iconic Aura Bioluminescence',
    description: 'Deep space navy-obsidian with electric cyan highlights and glowing bioluminescent readouts.',
    canvasHex: '#090D16',
    cardHex: '#0F172A',
    borderHex: '#1E293B',
    textHex: '#F8FAFC',
    accentHex: '#06B6D4',
    icon: '🌌',
  },
  stealth: {
    id: 'stealth',
    name: 'Onyx Stealth',
    tagline: 'Pure Carbon & Arctic Ice',
    description: 'Pitch-black aerospace carbon with razor-sharp arctic ice highlights. Ultra-minimalist and tactical.',
    canvasHex: '#09090B',
    cardHex: '#121216',
    borderHex: '#27272A',
    textHex: '#FAFAFA',
    accentHex: '#38BDF8',
    icon: '🗡️',
  },
  emerald: {
    id: 'emerald',
    name: 'Bio-Emerald',
    tagline: 'Subterranean Botanical Nocturne',
    description: 'Deep forest mineral black with glowing peptides, jade gradients, and vibrant emerald cellular accents.',
    canvasHex: '#060F0B',
    cardHex: '#0B1A13',
    borderHex: '#143325',
    textHex: '#ECFDF5',
    accentHex: '#10B981',
    icon: '🌿',
  },
  nebula: {
    id: 'nebula',
    name: 'Velvet Nebula',
    tagline: 'Deep Cosmic Royal Violet',
    description: 'Midnight galactic amethyst with neon purple and ultraviolet telemetry. Luxurious, moody, and futuristic.',
    canvasHex: '#0C0A17',
    cardHex: '#151128',
    borderHex: '#2A2048',
    textHex: '#FAF5FF',
    accentHex: '#A855F7',
    icon: '🔮',
  },
};
