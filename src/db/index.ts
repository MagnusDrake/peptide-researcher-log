import Dexie, { Table } from 'dexie';
import { Protocol, DoseLogEntry, Peptide } from '../types';

export interface UserSettings {
  id: string;
  theme: 'dark' | 'light' | 'system';
  defaultSyringeType: 'U-100' | 'U-50' | 'U-30';
  defaultBacWaterMl: number;
  weightUnit: 'lbs' | 'kg';
  researcherAlias: string;
  allowCommunitySharing: boolean;
}

export interface SharedCommunityFinding {
  id: string;
  researcherAlias: string;
  peptideName: string;
  protocolSummary: string;
  durationWeeks: number;
  outcomesSummary: string;
  subjectiveRatings: {
    recoveryAvg: number;
    energyAvg: number;
    sideEffects: string;
  };
  dateShared: string;
  upvotes: number;
}

export class PeptideDatabase extends Dexie {
  protocols!: Table<Protocol, string>;
  doseLogs!: Table<DoseLogEntry, string>;
  customPeptides!: Table<Peptide, string>;
  settings!: Table<UserSettings, string>;
  sharedCommunityFindings!: Table<SharedCommunityFinding, string>;

  constructor() {
    super('PeptideResearcherDB');
    this.version(1).stores({
      protocols: 'id, peptideId, peptideName, brandName, isActive, startDate, frequencyType',
      doseLogs: 'id, protocolId, peptideName, timestamp, injectionSite',
      customPeptides: 'id, name, category',
      settings: 'id',
      sharedCommunityFindings: 'id, peptideName, dateShared'
    });
  }
}

export const db = new PeptideDatabase();

let initPromise: Promise<void> | null = null;

// Default seed data for initial load (Idempotent with singleton promise lock and bulkPut)
export async function initializeDatabase(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await db.open();

      const existingSettings = await db.settings.get('user-settings');
      if (!existingSettings) {
        await db.settings.put({
          id: 'user-settings',
          theme: 'dark',
          defaultSyringeType: 'U-100',
          defaultBacWaterMl: 2.0,
          weightUnit: 'lbs',
          researcherAlias: 'Researcher_' + Math.floor(1000 + Math.random() * 9000),
          allowCommunitySharing: true
        });
      }

      // Seed sample community research findings for the Community Hub (using bulkPut to avoid ConstraintError)
      const findingsCount = await db.sharedCommunityFindings.count();
      if (findingsCount === 0) {
        await db.sharedCommunityFindings.bulkPut([
          {
            id: 'comm-finding-1',
            researcherAlias: 'BioDr_Alpha',
            peptideName: 'BPC-157 + TB-500',
            protocolSummary: 'BPC-157 (350mcg 2x/day) + TB-500 (2.5mg 2x/wk) for 6 weeks',
            durationWeeks: 6,
            outcomesSummary: 'Accelerated post-patellar tendon rehabilitation in animal athletic model. Ultrasound verified 40% faster tensile matrix remodeling compared to control.',
            subjectiveRatings: {
              recoveryAvg: 9.4,
              energyAvg: 8.0,
              sideEffects: 'None reported'
            },
            dateShared: '2026-08-10',
            upvotes: 42
          },
          {
            id: 'comm-finding-2',
            researcherAlias: 'EndoResearchLab',
            peptideName: 'Tirzepatide',
            protocolSummary: '2.5mg weeks 1-4 -> 5.0mg weeks 5-12 (once weekly)',
            durationWeeks: 12,
            outcomesSummary: 'Consistent 18.5% visceral adipose reduction with complete preservation of lean mass when combined with resistance training and 1.6g/kg protein intake.',
            subjectiveRatings: {
              recoveryAvg: 8.2,
              energyAvg: 7.8,
              sideEffects: 'Mild nausea on day 2 post-injection during dose escalation'
            },
            dateShared: '2026-08-14',
            upvotes: 68
          },
          {
            id: 'comm-finding-3',
            researcherAlias: 'MitoGenesis',
            peptideName: 'MOTS-c + SS-31',
            protocolSummary: 'SS-31 2mg daily for 4 weeks, followed by MOTS-c 5mg 3x/wk for 4 weeks',
            durationWeeks: 8,
            outcomesSummary: 'Notable increase in cellular oxygen consumption rate (OCR) and 25% elevation in mitochondrial ATP output markers.',
            subjectiveRatings: {
              recoveryAvg: 9.1,
              energyAvg: 9.6,
              sideEffects: 'Mild localized SubQ sting from SS-31 if injected rapidly'
            },
            dateShared: '2026-08-17',
            upvotes: 35
          }
        ]);
      }
    } catch (err: any) {
      if (err.name !== 'ConstraintError') {
        console.warn('Database initialization warning:', err);
      }
    }
  })();

  return initPromise;
}
