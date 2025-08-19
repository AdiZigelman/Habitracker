export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  selectedDay?: number; // 0-6 for Sunday-Saturday (only for weekly habits)
  createdAt: Date;
  streak: number;
  totalCompletions: number;
  lastCompleted?: Date;
  isActive: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
}

export interface Streak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompleted: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  requirement: number;
  type: 'streak' | 'completion' | 'level';
}

export interface UserStats {
  totalXP: number;
  level: number;
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  averageStreak: number;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  type: 'browser' | 'email' | 'push';
} 