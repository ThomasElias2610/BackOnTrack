import type { CheckinEntry, ExerciseScore, InsightResult } from './types';
import { calculateStreak } from './storage';

/**
 * Calculates the arithmetic mean of a numeric array.
 * Returns 0 for an empty array.
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Returns checkins sorted chronologically (oldest first).
 */
function sortedByDate(checkins: CheckinEntry[]): CheckinEntry[] {
  return [...checkins].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Detects a week-over-week trend in energy or brainFog.
 *
 * Compares the rolling average of the most recent 7 days against the 7 days
 * before that. Flags the change if the absolute percentage difference exceeds
 * 15 %.
 */
function detectWeekOverWeekTrend(checkins: CheckinEntry[]): InsightResult | null {
  const sorted = sortedByDate(checkins);
  if (sorted.length < 14) return null;

  const recent = sorted.slice(-7);
  const previous = sorted.slice(-14, -7);

  const metrics: Array<{ key: keyof Pick<CheckinEntry, 'energy' | 'brainFog'>; label: string }> = [
    { key: 'energy', label: 'energy' },
    { key: 'brainFog', label: 'brain fog' },
  ];

  let bestInsight: InsightResult | null = null;

  for (const { key, label } of metrics) {
    const recentAvg = mean(recent.map((c) => c[key] as number));
    const prevAvg = mean(previous.map((c) => c[key] as number));

    if (prevAvg === 0) continue;

    const pctChange = (recentAvg - prevAvg) / prevAvg;

    if (Math.abs(pctChange) <= 0.15) continue;

    const direction = pctChange > 0 ? 'increased' : 'decreased';
    const absPct = Math.round(Math.abs(pctChange) * 100);
    const significance = Math.min(Math.abs(pctChange) * 100, 100);

    const insight: InsightResult = {
      text: `Your ${label} has ${direction} by ${absPct}% compared to the previous week (${recentAvg.toFixed(1)} vs ${prevAvg.toFixed(1)} average).`,
      significance,
    };

    if (!bestInsight || insight.significance > bestInsight.significance) {
      bestInsight = insight;
    }
  }

  return bestInsight;
}

/**
 * Checks whether days logged with a happy mood emoji (😊) have above-average
 * energy compared to all other days.
 */
function detectMoodEnergyCorrelation(checkins: CheckinEntry[]): InsightResult | null {
  if (checkins.length < 7) return null;

  const happyDays = checkins.filter((c) => c.mood === '😊');
  const otherDays = checkins.filter((c) => c.mood !== '😊');

  if (happyDays.length < 2 || otherDays.length < 2) return null;

  const happyAvgEnergy = mean(happyDays.map((c) => c.energy));
  const otherAvgEnergy = mean(otherDays.map((c) => c.energy));

  if (otherAvgEnergy === 0) return null;

  const diff = happyAvgEnergy - otherAvgEnergy;
  const pctDiff = diff / otherAvgEnergy;

  if (pctDiff <= 0.1) return null; // less than 10 % difference — not notable

  const significance = Math.min(pctDiff * 100, 95);

  return {
    text: `On days you feel happy (😊) your energy averages ${happyAvgEnergy.toFixed(1)}/5, which is ${Math.round(pctDiff * 100)}% higher than on other days (${otherAvgEnergy.toFixed(1)}/5).`,
    significance,
  };
}

/**
 * Detects an upward trajectory in exercise scores.
 * Flags improvement if at least 3 of the last 4 sessions show a higher score
 * than the session before them.
 */
function detectExerciseImprovement(scores: ExerciseScore[]): InsightResult | null {
  if (scores.length < 4) return null;

  const sorted = [...scores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const last4 = sorted.slice(-4);
  let improvements = 0;

  for (let i = 1; i < last4.length; i++) {
    if (last4[i].score > last4[i - 1].score) improvements++;
  }

  if (improvements < 3) return null;

  const first = last4[0].score;
  const latest = last4[last4.length - 1].score;
  const pctGain = first > 0 ? ((latest - first) / first) * 100 : 0;
  const significance = Math.min(50 + pctGain, 90);

  return {
    text: `Your cognitive exercise scores have been improving — ${improvements} of the last 3 sessions were better than the one before (${first} → ${latest} points).`,
    significance,
  };
}

/**
 * Acknowledges a check-in streak of 7 or more days.
 */
function detectStreakAcknowledgment(checkins: CheckinEntry[]): InsightResult | null {
  const streak = calculateStreak(checkins);
  if (streak < 7) return null;

  const significance = Math.min(40 + streak, 85);

  return {
    text: `You've checked in for ${streak} days in a row. Consistent tracking is a strong predictor of recovery progress.`,
    significance,
  };
}

/**
 * Alerts if energy has been 1 or 2 for 3 or more consecutive days ending today.
 */
function detectLowEnergyAlert(checkins: CheckinEntry[]): InsightResult | null {
  const sorted = sortedByDate(checkins);

  let consecutiveLowDays = 0;

  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].energy <= 2) {
      consecutiveLowDays++;
    } else {
      break;
    }
  }

  if (consecutiveLowDays < 3) return null;

  const avgLowEnergy = mean(
    sorted.slice(-consecutiveLowDays).map((c) => c.energy)
  );
  const significance = Math.min(60 + consecutiveLowDays * 5, 100);

  return {
    text: `Your energy has been low (average ${avgLowEnergy.toFixed(1)}/5) for the past ${consecutiveLowDays} consecutive days. Consider discussing this with your care team.`,
    significance,
  };
}

/**
 * Generates a ranked list of insights from check-in and exercise data.
 *
 * Returns an empty array if fewer than 7 check-ins are available.
 * Up to 3 insights are returned, sorted by significance (highest first).
 *
 * @param checkins - All check-in entries for the user.
 * @param scores   - All exercise score entries for the user.
 * @returns        Array of up to 3 InsightResult objects.
 */
export function generateInsights(
  checkins: CheckinEntry[],
  scores: ExerciseScore[]
): InsightResult[] {
  if (checkins.length < 7) return [];

  const candidates: InsightResult[] = [];

  const detectors = [
    () => detectLowEnergyAlert(checkins),
    () => detectWeekOverWeekTrend(checkins),
    () => detectMoodEnergyCorrelation(checkins),
    () => detectExerciseImprovement(scores),
    () => detectStreakAcknowledgment(checkins),
  ];

  for (const detect of detectors) {
    const result = detect();
    if (result) candidates.push(result);
  }

  return candidates
    .sort((a, b) => b.significance - a.significance)
    .slice(0, 3);
}
