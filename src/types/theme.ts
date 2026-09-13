export type LightPalette = 'alabaster' | 'platinum' | 'ceramic' | 'glacier';

export interface LightPaletteConfig {
  id: LightPalette;
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
