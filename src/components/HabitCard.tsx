import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Confetti from 'react-confetti';

const HabitCard: React.FC<{ habit: any }> = ({ habit }) => {
  const { toggleHabit, isHabitCompleted } = useHabits();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const today = new Date();
  const isCompletedToday = isHabitCompleted(habit.id, today);
  
  const handleToggle = () => {
    toggleHabit(habit.id, today);
    
    if (!isCompletedToday) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };
  
  const getProgressPercentage = () => {
    if (isCompletedToday) {
      return 100;
    }
    
    if (habit.frequency === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const weekCompletions = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return isHabitCompleted(habit.id, date);
      });
      
      const completedThisWeek = weekCompletions.filter(Boolean).length;
      return Math.round((completedThisWeek / 7) * 100);
    }
    
    return 0;
  };
  
  const progressPercentage = getProgressPercentage();
  
  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          wind={0.05}
          tweenDuration={5000}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`habit-card relative overflow-hidden ${
          isCompletedToday ? 'ring-2 ring-green-200 bg-green-50' : ''
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className={`w-full h-full ${habit.color} rounded-full`}></div>
        </div>
        
        {/* Habit Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${habit.color} rounded-xl flex items-center justify-center text-2xl`}>
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="streak-badge">
            🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
          </div>
          <div className="streak-badge bg-blue-100 text-blue-700">
            ✅ {habit.totalCompletions}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {habit.frequency === 'weekly' ? 'This Week' : 'Today'}
            </span>
            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Completion Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
            isCompletedToday
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {!isCompletedToday ? (
              <>
                <Check size={20} />
                <span>Mark Complete</span>
              </>
            ) : (
              <>
                <X size={20} />
                <span>Mark Incomplete</span>
              </>
            )}
          </div>
        </button>
        
        {/* Last Completed Info */}
        {habit.lastCompleted && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Last completed: {habit.lastCompleted.toLocaleDateString()}
            </p>
          </div>
        )}
        
        {/* Frequency Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            habit.frequency === 'daily' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {habit.frequency === 'weekly' && habit.selectedDay !== undefined ? (
              <span>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][habit.selectedDay]}
              </span>
            ) : (
              habit.frequency
            )}
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default HabitCard; 