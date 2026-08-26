import { TimingOfDay, SyringeType } from '../types';

export function formatTiming(timing: TimingOfDay): string {
  switch (timing) {
    case 'fasted_morning':
      return 'Fasted (Morning)';
    case 'morning':
      return 'Morning';
    case 'pre_workout':
      return 'Pre-Workout (30-45m)';
    case 'post_workout':
      return 'Post-Workout';
    case 'evening':
      return 'Evening';
    case 'bedtime':
      return 'Bedtime (Before Sleep)';
    case 'anytime':
    default:
      return 'Any Time';
  }
}

export function formatDaysOfWeek(daysOfWeek: number[]): string {
  if (!daysOfWeek || daysOfWeek.length === 0) return 'None';
  if (daysOfWeek.length === 7) return 'Everyday (7 days/wk)';
  if (daysOfWeek.length === 5 && daysOfWeek.every(d => [1, 2, 3, 4, 5].includes(d))) {
    return 'Mon - Fri (5 on / 2 off)';
  }

  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek.map(d => names[d]).join(', ');
}

export function formatSyringeLabel(type: SyringeType): string {
  switch (type) {
    case 'U-100':
      return 'U-100 (1.0 mL / 100 units)';
    case 'U-50':
      return 'U-50 (0.5 mL / 50 units)';
    case 'U-30':
      return 'U-30 (0.3 mL / 30 units)';
  }
}

export function formatRelativeDate(isoDateString: string): string {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  const now = new Date();
  const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function parseDoseString(doseStr: string, fallbackDose: number = 250): { doseAmount: number; doseUnit: 'mcg' | 'mg' } {
  if (!doseStr) return { doseAmount: fallbackDose, doseUnit: 'mcg' };
  const isMg = doseStr.toLowerCase().includes('mg');
  // Match first numerical group (e.g. "250 - 500 mcg" -> 250, "2.0 - 2.5 mg" -> 2.0)
  const match = doseStr.match(/([0-9]+(?:\.[0-9]+)?)/);
  const doseAmount = match ? parseFloat(match[1]) : fallbackDose;
  return {
    doseAmount: isNaN(doseAmount) || doseAmount <= 0 ? fallbackDose : doseAmount,
    doseUnit: isMg ? 'mg' : 'mcg'
  };
}
