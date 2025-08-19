import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useHabits();
  
  const activeHabits = state.habits.filter(habit => habit.isActive);
  
  // Calculate potential achievements
  const potentialAchievements = [
    {
      id: 'first-habit',
      name: 'First Steps',
      description: 'Create your first habit',
      icon: '🌱',
      requirement: 1,
      current: Math.min(state.habits.length, 1), // Cap at 1 to prevent "2/1" display
      type: 'creation'
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak on any habit',
      icon: '🔥',
      requirement: 7,
      current: Math.max(...activeHabits.map(h => h.streak), 0),
      type: 'streak'
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak on any habit',
      icon: '⭐',
      requirement: 30,
      current: Math.max(...activeHabits.map(h => h.streak), 0),
      type: 'streak'
    },
    {
      id: 'streak-100',
      name: 'Century Champion',
      description: 'Maintain a 100-day streak on any habit',
      icon: '🏆',
      requirement: 100,
      current: Math.max(...activeHabits.map(h => h.streak), 0),
      type: 'streak'
    },
    {
      id: 'user-level-3',
      name: 'Growth Guru',
      description: 'Reach user level 3',
      icon: '🌳',
      requirement: 3,
      current: state.stats.level,
      type: 'user-level'
    },
    {
      id: 'user-level-5',
      name: 'Legendary',
      description: 'Reach user level 5',
      icon: '👑',
      requirement: 5,
      current: state.stats.level,
      type: 'user-level'
    },
    {
      id: 'total-completions-100',
      name: 'Hundred Club',
      description: 'Complete 100 total habit sessions',
      icon: '💯',
      requirement: 100,
      current: state.stats.totalCompletions,
      type: 'completion'
    },
    {
      id: 'total-completions-500',
      name: 'Five Hundred',
      description: 'Complete 500 total habit sessions',
      icon: '🎯',
      requirement: 500,
      current: state.stats.totalCompletions,
      type: 'completion'
    },
    {
      id: 'xp-1000',
      name: 'XP Hunter',
      description: 'Earn 1000 total XP',
      icon: '⚡',
      requirement: 1000,
      current: state.stats.totalXP,
      type: 'xp'
    },
    {
      id: 'xp-5000',
      name: 'XP Master',
      description: 'Earn 5000 total XP',
      icon: '🚀',
      requirement: 5000,
      current: state.stats.totalXP,
      type: 'xp'
    }
  ];
  
  const getAchievementStatus = (achievement: any) => {
    const isUnlocked = state.achievements.some(a => a.id === achievement.id);
    const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
    
    // Achievement is complete if progress is 100% or if it's already unlocked
    const isComplete = progress >= 100 || isUnlocked;
    
    // Show "In Progress" only if there's actual progress (not 0) but not complete
    const showInProgress = achievement.current > 0 && !isComplete;
    
    return { isUnlocked, progress, isComplete, showInProgress };
  };
  
  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'streak': return 'from-orange-400 to-red-500';
      case 'user-level': return 'from-purple-400 to-pink-500';
      case 'completion': return 'from-blue-400 to-cyan-500';
      case 'xp': return 'from-green-400 to-emerald-500';
      case 'creation': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Achievements</h1>
          <p className="text-xl text-gray-600">
            Track your progress and unlock amazing achievements!
          </p>
        </div>
      </motion.div>
      
      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-green-600">
            {potentialAchievements.filter(a => getAchievementStatus(a).isComplete).length}
          </div>
          <div className="text-gray-600">Achievements Complete</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-purple-600">
            {Math.round((potentialAchievements.filter(a => getAchievementStatus(a).isComplete).length / potentialAchievements.length) * 100)}%
          </div>
          <div className="text-gray-600">Completion Rate</div>
        </div>
      </motion.div>
      
      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">All Achievements</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {potentialAchievements.map((achievement, index) => {
            const { isUnlocked, progress, isComplete, showInProgress } = getAchievementStatus(achievement);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:scale-105 ${
                  isComplete 
                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                    : 'border-gray-100'
                }`}
              >
                <div className="p-6">
                  {/* Achievement Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`text-3xl ${isComplete ? 'animate-bounce' : ''}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${
                        isComplete ? 'text-yellow-700' : 'text-gray-800'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {isComplete && (
                      <div className="text-2xl">✅</div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {achievement.current}/{achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isComplete 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : `bg-gradient-to-r ${getAchievementColor(achievement.type)}`
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="text-center">
                    {isComplete ? (
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        <Trophy size={16} />
                        <span>Complete!</span>
                      </div>
                    ) : showInProgress ? (
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        <Target size={16} />
                        <span>In Progress</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-medium">
                        <Target size={16} />
                        <span>Not Started</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Motivation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center"
      >
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold mb-4">Keep Going!</h3>
        <p className="text-xl text-blue-100 mb-6">
          Every habit you complete brings you closer to your next achievement. 
          Consistency is the key to success!
        </p>
        <button
          onClick={() => navigate('/add-habit')}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          Add New Habit
        </button>
      </motion.div>
    </div>
  );
};

export default Achievements; 