import { Habit } from '../types';

export const calculateStreak = (completions: Date[]): number => {
  if (completions.length === 0) return 0;
  
  const sortedCompletions = [...completions].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i]);
    completionDate.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - completionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, maintain streak
      streak = streak;
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      streak++;
      currentDate = completionDate;
    } else {
      // Gap in streak, break
      break;
    }
  }
  
  return streak;
};

export const checkAchievements = (habits: any[], completions: any[], stats: any): any[] => {
  const achievements = [];
  
  // First habit achievement
  if (habits.length >= 1) {
    achievements.push({
      id: 'first-habit',
      name: 'First Steps',
      description: 'Create your first habit',
      icon: '🌱',
      type: 'completion',
      requirement: 1,
      current: Math.min(habits.length, 1),
      isUnlocked: habits.length >= 1
    });
  }
  
  // Streak achievements
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  if (maxStreak >= 7) {
    achievements.push({
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      type: 'streak',
      requirement: 7,
      current: maxStreak,
      isUnlocked: maxStreak >= 7
    });
  }
  
  if (maxStreak >= 30) {
    achievements.push({
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '🏆',
      type: 'streak',
      requirement: 30,
      current: maxStreak,
      isUnlocked: maxStreak >= 30
    });
  }
  
  if (maxStreak >= 100) {
    achievements.push({
      id: 'streak-100',
      name: 'Century Club',
      description: 'Maintain a 100-day streak',
      icon: '💎',
      type: 'streak',
      requirement: 100,
      current: maxStreak,
      isUnlocked: maxStreak >= 100
    });
  }
  
  // Completion achievements
  const totalCompletions = completions.filter(c => c.completed).length;
  if (totalCompletions >= 10) {
    achievements.push({
      id: 'completions-10',
      name: 'Getting Started',
      description: 'Complete 10 habits',
      icon: '✅',
      type: 'completion',
      requirement: 10,
      current: totalCompletions,
      isUnlocked: totalCompletions >= 10
    });
  }
  
  if (totalCompletions >= 100) {
    achievements.push({
      id: 'completions-100',
      name: 'Habit Hero',
      description: 'Complete 100 habits',
      icon: '👑',
      type: 'completion',
      requirement: 100,
      current: totalCompletions,
      isUnlocked: totalCompletions >= 100
    });
  }
  
  // User level achievements
  if (stats.level >= 3) {
    achievements.push({
      id: 'user-level-3',
      name: 'Level Up',
      description: 'Reach level 3',
      icon: '⭐',
      type: 'user-level',
      requirement: 3,
      current: stats.level,
      isUnlocked: stats.level >= 3
    });
  }
  
  if (stats.level >= 5) {
    achievements.push({
      id: 'user-level-5',
      name: 'High Achiever',
      description: 'Reach level 5',
      icon: '🌟',
      type: 'user-level',
      requirement: 5,
      current: stats.level,
      isUnlocked: stats.level >= 5
    });
  }
  
  return achievements;
};

export const calculateXP = (habit: any, userLevel: number): number => {
  const baseXP = 10;
  const streakBonus = Math.floor((habit.streak || 0) / 7) * 5;
  const levelMultiplier = Math.max(1, (userLevel || 1) * 0.1);
  
  const totalXP = (baseXP + streakBonus) * levelMultiplier;
  return isNaN(totalXP) ? 0 : Math.round(totalXP);
};

export const calculateCompletionRatio = (habit: Habit): string => {
  if (habit.frequency === 'daily') {
    const daysSinceCreation = Math.ceil((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const totalOpportunities = Math.max(daysSinceCreation, 1);
    return `${habit.totalCompletions}/${totalOpportunities}`;
  }
  
  if (habit.frequency === 'weekly' && habit.selectedDay !== undefined) {
    const creationDate = new Date(habit.createdAt);
    const today = new Date();
    
    // Find the first occurrence of the selected day after creation
    let firstOpportunity = new Date(creationDate);
    while (firstOpportunity.getDay() !== habit.selectedDay) {
      firstOpportunity.setDate(firstOpportunity.getDate() + 1);
    }
    
    // If the first opportunity is in the future, return 0/0
    if (firstOpportunity > today) {
      return '0/0';
    }
    
    // Calculate weeks between first opportunity and today
    const weeksSinceFirstOpportunity = Math.ceil((today.getTime() - firstOpportunity.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const totalOpportunities = Math.max(weeksSinceFirstOpportunity + 1, 1);
    
    return `${habit.totalCompletions}/${totalOpportunities}`;
  }
  
  return `${habit.totalCompletions}/1`;
}; 