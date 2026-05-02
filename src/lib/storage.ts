import type { CheckinEntry, ExerciseScore, Milestone } from './types';

const KEYS = {
  CHECKINS: 'backontrack_checkins',
  EXERCISE_SCORES: 'backontrack_exercise_scores',
  MILESTONES: 'backontrack_milestones',
  ONBOARDING_COMPLETE: 'backontrack_onboarding_complete',
} as const;

// ── Checkins ──────────────────────────────────────────────────────────────────

export function getCheckins(): CheckinEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.CHECKINS);
    return raw ? (JSON.parse(raw) as CheckinEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveCheckin(entry: CheckinEntry): void {
  try {
    const existing = getCheckins();
    const idx = existing.findIndex((c) => c.id === entry.id);
    if (idx !== -1) {
      existing[idx] = entry;
    } else {
      existing.push(entry);
    }
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(existing));
  } catch {
    // storage unavailable — silently ignore
  }
}

export function deleteCheckin(id: string): void {
  try {
    const filtered = getCheckins().filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(filtered));
  } catch {
    // storage unavailable — silently ignore
  }
}

// ── Exercise Scores ───────────────────────────────────────────────────────────

export function getExerciseScores(): ExerciseScore[] {
  try {
    const raw = localStorage.getItem(KEYS.EXERCISE_SCORES);
    return raw ? (JSON.parse(raw) as ExerciseScore[]) : [];
  } catch {
    return [];
  }
}

export function saveExerciseScore(score: ExerciseScore): void {
  try {
    const existing = getExerciseScores();
    existing.push(score);
    localStorage.setItem(KEYS.EXERCISE_SCORES, JSON.stringify(existing));
  } catch {
    // storage unavailable — silently ignore
  }
}

// ── Milestones ────────────────────────────────────────────────────────────────

export function getMilestones(): Milestone[] {
  try {
    const raw = localStorage.getItem(KEYS.MILESTONES);
    return raw ? (JSON.parse(raw) as Milestone[]) : [];
  } catch {
    return [];
  }
}

export function saveMilestones(milestones: Milestone[]): void {
  try {
    localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
  } catch {
    // storage unavailable — silently ignore
  }
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export function getOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(KEYS.ONBOARDING_COMPLETE) === 'true';
  } catch {
    return false;
  }
}

export function setOnboardingComplete(): void {
  try {
    localStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
  } catch {
    // storage unavailable — silently ignore
  }
}

// ── Streak ────────────────────────────────────────────────────────────────────

/**
 * Returns the number of consecutive days (ending today) for which a check-in
 * exists. Each calendar date is counted at most once regardless of how many
 * entries share that date.
 */
export function calculateStreak(checkins: CheckinEntry[]): number {
  if (checkins.length === 0) return 0;

  // Build a set of unique YYYY-MM-DD date strings that have a check-in
  const checkedDates = new Set(
    checkins.map((c) => c.date.slice(0, 10))
  );

  const today = new Date();
  let streak = 0;

  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (checkedDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
