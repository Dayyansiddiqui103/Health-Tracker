export interface PlannedExercise {
  id: string;
  name: string;
  durationMinutes: number;
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'Walking' | 'Sport' | 'Other';
}

export interface DailyPlan {
  date: string;
  waterGoalGlasses: number | '';
  sleepGoalHours: number | '';
  focusNote: string;
  plannedExercises: PlannedExercise[];
  isPlanSaved: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'water' | 'sleep' | 'exercise' | 'custom';
  completed: boolean;
  completedAt?: string;
  relatedTarget?: string;
}

export interface LoggedExercise {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  intensity: 'Light' | 'Moderate' | 'High';
  notes?: string;
  timestamp: string;
}

export interface SleepLog {
  hours: number | '';
  bedTime: string;
  wakeTime: string;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Restless' | '';
  notes: string;
}

export interface HealthData {
  plan: DailyPlan;
  waterGlasses: number;
  sleep: SleepLog;
  exercises: LoggedExercise[];
  checklist: ChecklistItem[];
}
