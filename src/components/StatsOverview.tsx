import React from 'react';
import { useHabits } from '../contexts/HabitContext';
import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';
import { calculateCompletionRatio } from '../utils/habitUtils';

const StatsOverview: React.FC = () => {
  const { state } = useHabits();
  
  const activeHabits = state.habits.filter(habit => habit.isActive);
  
  const completedToday = activeHabits.filter(habit => {
    const today = new Date();
    return state.completions.some(comp => 
      comp.habitId === habit.id && 
      comp.date.toDateString() === today.toDateString() && 
      comp.completed
    );
  }).length;
  
  const topHabits = [...activeHabits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);
  
  const streakDistribution = {
    '0-6 days': activeHabits.filter(h => h.streak < 7).length,
    '7-29 days': activeHabits.filter(h => h.streak >= 7 && h.streak < 30).length,
    '30+ days': activeHabits.filter(h => h.streak >= 30).length
  };
  
  return (
    <div className="space-y-6">
      {/* Top Performing Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Award className="text-yellow-500" />
          <span>Top Performing Habits</span>
        </h3>
        
        {topHabits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No habits yet. Start building some positive habits!</p>
        ) : (
          <div className="space-y-4">
            {topHabits.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div className={`w-10 h-10 ${habit.color} rounded-lg flex items-center justify-center text-xl`}>
                    {habit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{habit.name}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="streak-badge">
                    🔥 {habit.streak} days
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {calculateCompletionRatio(habit)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Streak Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp className="text-green-500" />
          <span>Streak Distribution</span>
        </h3>
        
        <div className="space-y-4">
          {Object.entries(streakDistribution).map(([range, count]) => (
            <div key={range} className="flex items-center justify-between">
              <span className="text-gray-600">{range}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${activeHabits.length > 0 ? (count / activeHabits.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsOverview; 