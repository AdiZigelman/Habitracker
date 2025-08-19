import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView: React.FC = () => {
  const { state, isHabitCompleted } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = monthStart.getDay();
  
  // Create array of all days to display (including empty cells for days before month starts)
  const allDays = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    allDays.push(null);
  }
  
  // Add all days of the month
  allDays.push(...daysInMonth);
  
  const activeHabits = state.habits.filter(habit => habit.isActive);
  
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const getDayCompletionStatus = (date: Date) => {
    const completions = activeHabits
      .filter(habit => {
        const habitCreatedDate = new Date(habit.createdAt);
        habitCreatedDate.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        
        if (habit.frequency === 'weekly' && habit.selectedDay !== undefined) {
          const dayOfWeek = compareDate.getDay();
          if (dayOfWeek !== habit.selectedDay) {
            return false;
          }
          
          if (compareDate < habitCreatedDate) {
            return false;
          }
        }
        
        return habitCreatedDate <= compareDate;
      })
      .map(habit => ({
        habitId: habit.id,
        completed: isHabitCompleted(habit.id, date),
        icon: habit.icon,
        color: habit.color
      }));
    
    const completedCount = completions.filter(c => c.completed).length;
    const totalCount = completions.length;
    
    return {
      completions,
      completedCount,
      totalCount,
      percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0
    };
  };
  
  const getDayColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-400';
    if (percentage >= 25) return 'bg-orange-400';
    if (percentage > 0) return 'bg-red-400';
    return 'bg-gray-200';
  };
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">Monthly Progress</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h4 className="text-xl font-semibold text-gray-700">
            {format(currentDate, 'MMMM yyyy')}
          </h4>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {allDays.map((date, index) => {
            if (date === null) {
              return (
                <div key={`empty-${index}`} className="aspect-square p-2 rounded-lg border-2 border-gray-100" />
              );
            }

            const dayStatus = getDayCompletionStatus(date);
            const isToday = isSameDay(date, new Date());
            const isCurrentMonth = isSameMonth(date, currentDate);
            
            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`
                  aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer hover:scale-105
                  ${isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
              >
                {/* Date Number */}
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {format(date, 'd')}
                </div>
                
                {/* Completion Status */}
                {dayStatus.totalCount > 0 && (
                  <div className="space-y-1">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getDayColor(dayStatus.percentage)}`}
                        style={{ width: `${dayStatus.percentage}%` }}
                      />
                    </div>
                    
                    {/* Completion Count */}
                    <div className="text-xs text-gray-600 text-center">
                      {dayStatus.completedCount}/{dayStatus.totalCount}
                    </div>
                    
                    {/* Habit Icons */}
                    {dayStatus.completions.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {dayStatus.completions.slice(0, 3).map((completion, idx) => (
                          <div
                            key={idx}
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                              completion.completed ? completion.color : 'bg-gray-200'
                            }`}
                          >
                            {completion.icon}
                          </div>
                        ))}
                        {dayStatus.completions.length > 3 && (
                          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                            +{dayStatus.completions.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Celebration Icon for 100% Completion */}
                    {dayStatus.percentage === 100 && (
                      <div className="text-center">
                        <div className="text-lg animate-bounce">🎉</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Empty State */}
                {dayStatus.totalCount === 0 && (
                  <div className="text-xs text-gray-400 text-center mt-2">
                    No habits
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView; 