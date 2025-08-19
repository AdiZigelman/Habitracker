import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from './HabitCard.tsx';
import CalendarView from './CalendarView.tsx';
import StatsOverview from './StatsOverview.tsx';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state } = useHabits();
  const [activeTab, setActiveTab] = useState<'habits' | 'calendar' | 'stats'>('habits');
  
  const activeHabits = state.habits.filter(habit => {
    if (!habit.isActive) return false;
    
    if (habit.frequency === 'daily') return true;
    
    if (habit.frequency === 'weekly' && habit.selectedDay !== undefined) {
      const today = new Date();
      const currentDay = today.getDay();
      
      if (currentDay !== habit.selectedDay) {
        return false;
      }
      
      const habitCreatedDate = new Date(habit.createdAt);
      return today >= habitCreatedDate;
    }
    
    return false;
  });
  
  const completedToday = activeHabits.filter(habit => {
    const today = new Date();
    return state.completions.some(comp => 
      comp.habitId === habit.id && 
      comp.date.toDateString() === today.toDateString() && 
      comp.completed
    );
  }).length;
  
  const tabs = [
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: BarChart3 }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome back! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Keep building those positive habits! 
        </p>
      </motion.div>
      
      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Habits</p>
              <p className="text-3xl font-bold text-blue-600">{state.stats.activeHabits}</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Progress</p>
              <p className="text-3xl font-bold text-green-600">
                {activeHabits.length > 0 ? Math.round((completedToday / activeHabits.length) * 100) : 0}%
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total XP</p>
              <p className="text-3xl font-bold text-purple-600">{state.stats.totalXP}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Level</p>
              <p className="text-3xl font-bold text-orange-600">{state.stats.level}</p>
            </div>
            <div className="text-3xl">🚀</div>
          </div>
        </div>
      </motion.div>
      
      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8"
      >
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'habits' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {activeHabits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">No habits yet!</h3>
                  <p className="text-gray-600 mb-6">Start building positive habits by creating your first one.</p>
                  <Link
                    to="/manage-habits"
                    className="btn-primary inline-block"
                  >
                    Create Your First Habit
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Habits Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {activeHabits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView />
            </motion.div>
          )}
          
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StatsOverview />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 