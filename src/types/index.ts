export type SyringeType = 'U-100' | 'U-50' | 'U-30';

export type PeptideCategory = 
  | 'metabolic' 
  | 'healing' 
  | 'gh_secretagogue' 
  | 'longevity' 
  | 'nootropic' 
  | 'cosmetic' 
  | 'immune' 
  | 'other';

export interface StorageGuidance {
  lyophilized: string;
  reconstituted: string;
  shelfLifeReconstitutedDays: number;
  lightSensitive: boolean;
}

export interface StandardDosing {
  minDose: number;
  maxDose: number;
  typicalDose: number;
  unit: 'mcg' | 'mg';
  frequency: string;
  timing: string;
  cycleLengthWeeks?: string;
}

export interface LiteratureReference {
  title: string;
  journal?: string;
  year?: number;
  pmid?: string;
  url?: string;
}

export interface Peptide {
  id: string;
  name: string;
  aliases: string[];
  category: PeptideCategory;
  categoryLabel: string;
  subCategory?: string;
  summary: string;
  mechanism: string;
  molecularFormula?: string;
  sequence?: string;
  commonVialSizesMg: number[];
  typicalBacWaterMl: number[];
  reconstitutionTips: string[];
  storageGuidance: StorageGuidance;
  standardDosing: StandardDosing;
  halfLifeHours: number;
  halfLifeLabel: string;
  researchIndications: string[];
  synergisticWith: string[];
  sideEffectWarnings: string[];
  literatureReferences: LiteratureReference[];
  isCustom?: boolean;
  isBlend?: boolean;
  blendComponents?: Array<{ name: string; massRatioMg?: number }>;
}

export type FrequencyType = 'days_of_week' | 'daily' | 'interval' | 'weekly' | 'custom';

export type TimingOfDay = 
  | 'fasted_morning' 
  | 'morning' 
  | 'pre_workout' 
  | 'post_workout' 
  | 'evening' 
  | 'bedtime' 
  | 'anytime';

export interface BlendComponent {
  id: string;
  peptideName: string;
  vialMassMg: number;
  targetDose: number;
  doseUnit: 'mcg' | 'mg';
  concentrationMgMl?: number;
  concentrationMcgPerUnit?: number;
  deliveredDose?: number;
  deliveredUnit?: 'mcg' | 'mg';
}

export interface Protocol {
  id: string;
  peptideId: string;
  peptideName: string;
  customPeptide?: boolean;
  isBlend?: boolean;
  blendComponents?: BlendComponent[];
  brandName: string;
  batchNumber?: string;
  vialMassMg: number;
  bacWaterMl: number;
  doseAmount: number;
  doseUnit: 'mcg' | 'mg';
  syringeType: SyringeType;
  calculatedUnits: number;
  concentrationMgMl: number;
  frequencyType: FrequencyType;
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  intervalDays?: number;
  timingOfDay: TimingOfDay;
  targetSite?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  plannedCycleWeeks: number;
  notes?: string;
  colorTag?: string;
  isActive: boolean;
  reconstitutedDate?: string; // YYYY-MM-DD
  initialVialVolumeMl?: number;
  remainingVialVolumeMl?: number;
  remainingVialUnits?: number;
  costPerVial?: number;
  isPublic?: boolean;
  shareAlias?: string;
}

export interface SubjectiveMetrics {
  recoveryScore?: number; // 1-10
  energyLevel?: number; // 1-10
  appetiteSuppression?: number; // 1-10
  sleepQuality?: number; // 1-10
  symptomPainScore?: number; // 1-10
  bodyWeightLbs?: number;
}

export interface DeliveredBlendDose {
  peptideName: string;
  doseAmount: number;
  doseUnit: 'mcg' | 'mg';
}

export interface DoseLogEntry {
  id: string;
  protocolId: string;
  peptideName: string;
  isBlend?: boolean;
  blendDelivered?: DeliveredBlendDose[];
  timestamp: string; // ISO String
  doseAmount: number;
  doseUnit: 'mcg' | 'mg';
  drawUnits: number;
  syringeType: SyringeType;
  injectionSite: string;
  reactionRating?: 'none' | 'mild_redness' | 'bruise' | 'itch' | 'sore';
  notes?: string;
  subjectiveMetrics?: SubjectiveMetrics;
  photoDataUri?: string; // Base64 encoded image
  isPublic?: boolean;
}

export interface InjectionSite {
  id: string;
  name: string;
  region: 'abdomen' | 'thigh' | 'deltoid' | 'glute' | 'flank';
  side: 'left' | 'right';
  subLocation: 'upper' | 'lower' | 'outer' | 'inner' | 'anterior' | 'lateral' | 'posterior';
  view: 'front' | 'back';
  x: number; // Percentage on visual body map (0 - 100)
  y: number; // Percentage on visual body map (0 - 100)
}

export interface StackPeptideItem {
  peptideId: string;
  peptideName: string;
  typicalDose: string;
  timing: string;
  frequency: string;
  synergyReason: string;
}

export interface CuratedStack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  goals: string[];
  peptides: StackPeptideItem[];
  warnings?: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MatcherQuizAnswers {
  primaryGoals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  administrationPreference: 'subq_daily' | 'subq_weekly' | 'nasal' | 'topical' | 'any';
  targetTimeline: 'immediate' | 'medium_term' | 'long_term';
  budgetPreference?: 'entry' | 'moderate' | 'premium';
}

export interface MatchResult {
  peptide: Peptide;
  score: number;
  matchedGoals: string[];
  rationale: string;
  suggestedProtocol: string;
  suggestedStack?: CuratedStack;
}

export interface TitrationStep {
  weekStart: number;
  weekEnd: number;
  doseAmount: number;
  doseUnit: 'mcg' | 'mg';
  notes: string;
}
