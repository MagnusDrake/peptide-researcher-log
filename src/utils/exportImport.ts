import { db } from '../db';
import { Protocol, DoseLogEntry } from '../types';

export interface ExportDataPayload {
  version: number;
  exportedAt: string;
  protocols: Protocol[];
  doseLogs: DoseLogEntry[];
  customPeptides: any[];
  settings: any[];
}

export async function exportDatabaseToJson(): Promise<string> {
  const protocols = await db.protocols.toArray();
  const doseLogs = await db.doseLogs.toArray();
  const customPeptides = await db.customPeptides.toArray();
  const settings = await db.settings.toArray();

  const payload: ExportDataPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    protocols,
    doseLogs,
    customPeptides,
    settings
  };

  return JSON.stringify(payload, null, 2);
}

export function triggerDownload(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportLogsToCsv(): Promise<string> {
  const logs = await db.doseLogs.orderBy('timestamp').reverse().toArray();
  if (logs.length === 0) return '';

  const headers = [
    'Timestamp',
    'Peptide',
    'Dose Amount',
    'Dose Unit',
    'Draw Units',
    'Syringe Type',
    'Injection Site',
    'Reaction Rating',
    'Body Weight (lbs)',
    'Recovery Score (1-10)',
    'Energy Level (1-10)',
    'Appetite Suppression (1-10)',
    'Sleep Quality (1-10)',
    'Symptom Score (1-10)',
    'Notes'
  ];

  const rows = logs.map(log => [
    `"${log.timestamp}"`,
    `"${log.peptideName || ''}"`,
    log.doseAmount || '',
    `"${log.doseUnit || ''}"`,
    log.drawUnits || '',
    `"${log.syringeType || ''}"`,
    `"${log.injectionSite || ''}"`,
    `"${log.reactionRating || 'none'}"`,
    log.subjectiveMetrics?.bodyWeightLbs || '',
    log.subjectiveMetrics?.recoveryScore || '',
    log.subjectiveMetrics?.energyLevel || '',
    log.subjectiveMetrics?.appetiteSuppression || '',
    log.subjectiveMetrics?.sleepQuality || '',
    log.subjectiveMetrics?.symptomPainScore || '',
    `"${(log.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export async function importDatabaseFromJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data: ExportDataPayload = JSON.parse(jsonString);
    if (!data.version || !Array.isArray(data.protocols) || !Array.isArray(data.doseLogs)) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    await db.transaction('rw', [db.protocols, db.doseLogs, db.customPeptides, db.settings], async () => {
      if (data.protocols.length > 0) {
        await db.protocols.bulkPut(data.protocols);
      }
      if (data.doseLogs.length > 0) {
        await db.doseLogs.bulkPut(data.doseLogs);
      }
      if (data.customPeptides && data.customPeptides.length > 0) {
        await db.customPeptides.bulkPut(data.customPeptides);
      }
      if (data.settings && data.settings.length > 0) {
        await db.settings.bulkPut(data.settings);
      }
    });

    return { success: true, message: `Successfully imported ${data.protocols.length} protocols and ${data.doseLogs.length} logs.` };
  } catch (err: any) {
    return { success: false, message: `Import error: ${err.message}` };
  }
}

export function generateShareableProtocolText(protocol: Protocol, logsCount: number = 0): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStr = protocol.frequencyType === 'daily'
    ? 'Everyday'
    : protocol.daysOfWeek.map(d => days[d]).join(', ');

  return `🔬 **Peptide Routine Summary**
----------------------------------------
**Peptide:** ${protocol.peptideName}
**Brand/Source:** ${protocol.brandName || 'Standard'}
**Vial Size:** ${protocol.vialMassMg} mg | **BAC Water:** ${protocol.bacWaterMl} mL
**Dose:** ${protocol.doseAmount} ${protocol.doseUnit} (${protocol.calculatedUnits} units on ${protocol.syringeType})
**Schedule:** ${dayStr} | Timing: ${protocol.timingOfDay.replace('_', ' ')}
**Cycle Length:** ${protocol.plannedCycleWeeks} weeks
**Total Doses Logged:** ${logsCount}
${protocol.notes ? `**Notes:** ${protocol.notes}` : ''}
----------------------------------------
*Generated via Aura Peptide Tracker*`;
}
