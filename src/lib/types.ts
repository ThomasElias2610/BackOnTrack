export interface CheckinEntry {
  id: string;
  date: string; // ISO date string
  energy: 1 | 2 | 3 | 4 | 5;
  brainFog: 1 | 2 | 3 | 4 | 5;
  mood: string; // emoji
  note?: string;
}

export interface ExerciseScore {
  id: string;
  date: string; // ISO date string
  gameType: 'memory' | 'wordrecall';
  score: number;
  duration: number; // seconds
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedDate?: string; // ISO date string
  isCustom: boolean;
  order: number;
}

export interface InsightResult {
  text: string;
  significance: number;
}
