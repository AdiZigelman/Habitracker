import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Habit, HabitCompletion, Achievement, UserStats } from '../types';
import { calculateXP } from '../utils/habitUtils';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  achievements: Achievement[];
  stats: UserStats;
}

type HabitAction =
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT'; payload: { habitId: string; date: Date } }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_STATS' }
  | { type: 'SET_INITIAL_DATA'; payload: { habits: Habit[]; completions: HabitCompletion[]; achievements: Achievement[]; stats: UserStats } };

const initialState: HabitState = {
  habits: [],
  completions: [],
  achievements: [],
  stats: {
    totalXP: 0,
    level: 0,
    totalHabits: 0,
    activeHabits: 0,
    totalCompletions: 0,
    averageStreak: 0
  }
};

const habitReducer = (state: HabitState, action: HabitAction): HabitState => {
  switch (action.type) {
    case 'ADD_HABIT': {
      return {
        ...state,
        habits: [...state.habits, action.payload]
      };
    }
    
    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        )
      };
    }
    
    case 'DELETE_HABIT': {
      const currentStats = state.stats;
      const updatedHabits = state.habits.filter(habit => habit.id !== action.payload);
      const updatedCompletions = state.completions.filter(comp => comp.habitId !== action.payload);
      
      const newTotalHabits = updatedHabits.length;
      const newActiveHabits = updatedHabits.filter(habit => habit.isActive).length;
      const newTotalCompletions = updatedCompletions.filter(comp => comp.completed).length;
      const newAverageStreak = updatedHabits.length > 0 
        ? updatedHabits.reduce((sum, habit) => sum + (habit.streak || 0), 0) / updatedHabits.length
        : 0;
      
      return {
        ...state,
        habits: updatedHabits,
        completions: updatedCompletions,
        stats: {
          ...currentStats,
          totalHabits: newTotalHabits,
          activeHabits: newActiveHabits,
          totalCompletions: newTotalCompletions,
          averageStreak: Math.round(newAverageStreak) || 0,
          level: Math.max(currentStats.level, 1),
          totalXP: Math.max(currentStats.totalXP, 0)
        }
      };
    }
    
    case 'TOGGLE_HABIT': {
      const { habitId, date } = action.payload;
      const existingCompletion = state.completions.find(
        comp => comp.habitId === habitId && 
        comp.date.toDateString() === date.toDateString()
      );
      
      let newCompletions = [...state.completions];
      let updatedHabits = [...state.habits];
      
      if (existingCompletion) {
        newCompletions = state.completions.map(comp =>
          comp.id === existingCompletion.id
            ? { ...comp, completed: !comp.completed }
            : comp
        );
      } else {
        const newCompletion: HabitCompletion = {
          id: Date.now().toString(),
          habitId,
          date,
          completed: true
        };
        newCompletions.push(newCompletion);
      }
      
      updatedHabits = state.habits.map(habit => {
        if (habit.id === habitId) {
          const habitCompletions = newCompletions.filter(
            comp => comp.habitId === habitId && comp.completed
          );
          
          let newStreak = habit.streak;
          if (habitCompletions.length > 0) {
            const lastCompleted = new Date(Math.max(...habitCompletions.map(c => c.date.getTime())));
            const today = new Date();
            const diffTime = today.getTime() - lastCompleted.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              newStreak = habit.streak;
            } else if (diffDays === 1) {
              newStreak = habit.streak + 1;
            } else {
              newStreak = 0;
            }
          } else {
            newStreak = 0;
          }
          
          return {
            ...habit,
            streak: newStreak,
            totalCompletions: habitCompletions.length,
            lastCompleted: habitCompletions.length > 0 
              ? new Date(Math.max(...habitCompletions.map(c => c.date.getTime())))
              : undefined
          };
        }
        return habit;
      });
      
      return {
        ...state,
        habits: updatedHabits,
        completions: newCompletions
      };
    }
    
    case 'ADD_ACHIEVEMENT': {
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      };
    }
    
    case 'UPDATE_STATS': {
      const totalXP = state.habits.reduce((sum, habit) => {
        const habitXP = calculateXP(habit, state.stats.level || 0);
        return sum + (isNaN(habitXP) ? 0 : habitXP);
      }, 0);
      
      const totalHabits = state.habits.length;
      const activeHabits = state.habits.filter(habit => habit.isActive).length;
      const totalCompletions = state.completions.filter(comp => comp.completed).length;
      const averageStreak = state.habits.length > 0 
        ? state.habits.reduce((sum, habit) => sum + (habit.streak || 0), 0) / state.habits.length
        : 0;
      
      const currentLevel = state.stats.level || 1;
      const currentTotalXP = state.stats.totalXP || 0;
      
      const calculatedLevel = Math.max(currentLevel, Math.max(1, Math.floor((totalXP || 0) / 1000) + 1));
      const preservedTotalXP = Math.max(currentTotalXP, totalXP || 0);
      
      return {
        ...state,
        stats: {
          totalXP: preservedTotalXP,
          level: calculatedLevel,
          totalHabits,
          activeHabits,
          totalCompletions,
          averageStreak: Math.round(averageStreak) || 0
        }
      };
    }

    case 'SET_INITIAL_DATA': {
      return {
        ...state,
        habits: action.payload.habits,
        completions: action.payload.completions,
        achievements: action.payload.achievements,
        stats: action.payload.stats
      };
    }
    
    default:
      return state;
  }
};

interface HabitContextType {
  state: HabitState;
  dispatch: React.Dispatch<HabitAction>;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'totalCompletions' | 'isActive'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date: Date) => void;
  getHabitCompletions: (habitId: string) => HabitCompletion[];
  isHabitCompleted: (habitId: string, date: Date) => boolean;
  clearAllData: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  // Load data from localStorage on mount (only once)
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      const savedHabits = localStorage.getItem('habits');
      const savedCompletions = localStorage.getItem('completions');
      const savedAchievements = localStorage.getItem('achievements');
      const savedStats = localStorage.getItem('stats');
      
      let loadedHabits: Habit[] = [];
      let loadedCompletions: HabitCompletion[] = [];
      let loadedAchievements: Achievement[] = [];
      let loadedStats: UserStats = initialState.stats;
      
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        // Deduplicate habits by ID to prevent duplicates
        const uniqueHabits = new Map<string, Habit>();
        parsedHabits.forEach((habit: any) => {
          if (!uniqueHabits.has(habit.id)) {
            uniqueHabits.set(habit.id, {
              ...habit,
              createdAt: new Date(habit.createdAt),
              lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined
            });
          }
        });
        loadedHabits = Array.from(uniqueHabits.values());
      }
      
      if (savedCompletions) {
        const parsedCompletions = JSON.parse(savedCompletions);
        // Deduplicate completions by ID to prevent duplicates
        const uniqueCompletions = new Map<string, HabitCompletion>();
        parsedCompletions.forEach((comp: any) => {
          if (!uniqueCompletions.has(comp.id)) {
            uniqueCompletions.set(comp.id, {
              ...comp,
              date: new Date(comp.date)
            });
          }
        });
        loadedCompletions = Array.from(uniqueCompletions.values());
      }
      
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        // Deduplicate achievements by ID to prevent duplicates
        const uniqueAchievements = new Map<string, Achievement>();
        parsedAchievements.forEach((ach: any) => {
          if (!uniqueAchievements.has(ach.id)) {
            uniqueAchievements.set(ach.id, {
              ...ach,
              unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined
            });
          }
        });
        loadedAchievements = Array.from(uniqueAchievements.values());
      }
      
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        // Ensure stats have valid numbers
        loadedStats = {
          totalXP: parsedStats.totalXP || 0,
          level: parsedStats.level || 1,
          totalHabits: parsedStats.totalHabits || 0,
          activeHabits: parsedStats.activeHabits || 0,
          totalCompletions: parsedStats.totalCompletions || 0,
          averageStreak: parsedStats.averageStreak || 0
        };
      }
      
      // Set initial data with deduplicated values
      dispatch({
        type: 'SET_INITIAL_DATA',
        payload: {
          habits: loadedHabits,
          completions: loadedCompletions,
          achievements: loadedAchievements,
          stats: loadedStats
        }
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  // Save data to localStorage whenever state changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('habits', JSON.stringify(state.habits));
      localStorage.setItem('completions', JSON.stringify(state.completions));
      localStorage.setItem('achievements', JSON.stringify(state.achievements));
      localStorage.setItem('stats', JSON.stringify(state.stats));
      
      // Update stats whenever habits or completions change
      dispatch({ type: 'UPDATE_STATS' });
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state.habits, state.completions, state.achievements, state.stats, isInitialized]);
  
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'totalCompletions' | 'isActive'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      totalCompletions: 0,
      isActive: true,
      selectedDay: habitData.frequency === 'weekly' ? (habitData.selectedDay ?? new Date().getDay()) : undefined
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };
  
  const updateHabit = (habit: Habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };
  
  const deleteHabit = (id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  };
  
  const toggleHabit = (habitId: string, date: Date) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: { habitId, date } });
  };
  
  const getHabitCompletions = (habitId: string): HabitCompletion[] => {
    return state.completions.filter(comp => comp.habitId === habitId);
  };
  
  const isHabitCompleted = (habitId: string, date: Date): boolean => {
    return state.completions.some(comp =>
      comp.habitId === habitId &&
      comp.date.toDateString() === date.toDateString() &&
      comp.completed
    );
  };
  
  const clearAllData = () => {
    if (window.confirm('This will clear all your data and reset the app. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  const value: HabitContextType = {
    state,
    dispatch,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHabitCompletions,
    isHabitCompleted,
    clearAllData
  };
  
  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}; 