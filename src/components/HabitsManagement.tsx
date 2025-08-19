import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../contexts/HabitContext';
import { Habit } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Trash2, Save, X, Palette, Calendar } from 'lucide-react';
import { calculateCompletionRatio } from '../utils/habitUtils';

const HabitsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateHabit, deleteHabit, addHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    icon: '',
    color: '',
    frequency: 'daily' as 'daily' | 'weekly',
    selectedDay: new Date().getDay()
  });
  
  const habitIcons = ['🏋️', '🏃', '🧘', '📚', '💧', '😴', '🚶', '🧘‍♀️', '📝', '📖', '🎯', '🧹', '👨‍🍳', '🌱', '🎨', '🎵', '💃', '💻', '✍️', '🌟'];
  const habitColors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
  ];
  
  // Deduplicate habits by ID to prevent showing duplicates
  const activeHabits = useMemo(() => {
    const uniqueHabits = new Map<string, Habit>();
    state.habits
      .filter(habit => habit.isActive)
      .forEach(habit => {
        if (!uniqueHabits.has(habit.id)) {
          uniqueHabits.set(habit.id, habit);
        }
      });
    return Array.from(uniqueHabits.values());
  }, [state.habits]);
  
  const startEditing = (habit: Habit) => {
    setEditingHabit(habit);
    setEditForm({
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      selectedDay: habit.frequency === 'weekly' ? (habit.selectedDay ?? new Date().getDay()) : new Date().getDay()
    });
  };
  
  const cancelEditing = () => {
    setEditingHabit(null);
  };
  
  const startAddingHabit = () => {
    setShowAddHabit(true);
    setEditForm({
      name: '',
      icon: '🌟',
      color: 'bg-blue-500',
      frequency: 'daily',
      selectedDay: new Date().getDay()
    });
  };
  
  const cancelAddingHabit = () => {
    setShowAddHabit(false);
  };
  
  const saveChanges = () => {
    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        name: editForm.name,
        icon: editForm.icon,
        color: editForm.color,
        frequency: editForm.frequency,
        selectedDay: editForm.frequency === 'weekly' ? editForm.selectedDay : undefined
      });
      setEditingHabit(null);
    }
  };
  
  const saveNewHabit = () => {
    if (editForm.name.trim()) {
      addHabit({
        name: editForm.name.trim(),
        icon: editForm.icon,
        color: editForm.color,
        frequency: editForm.frequency,
        selectedDay: editForm.frequency === 'weekly' ? editForm.selectedDay : undefined,
        createdAt: new Date()
      });
      setShowAddHabit(false);
    }
  };
  
  const handleDelete = (habit: Habit) => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
      deleteHabit(habit.id);
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
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Manage Your Habits</h1>
          <p className="text-xl text-gray-600">
            Customize colors, names, frequencies, and reminders for all your habits
          </p>
          <button
            onClick={startAddingHabit}
            className="mt-6 btn-primary"
          >
            + Add New Habit
          </button>
        </div>
      </motion.div>
      
      {/* Habits List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {activeHabits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No habits to manage!</h3>
            <p className="text-gray-600 mb-6">Create some habits first to customize them.</p>
            <button
              onClick={startAddingHabit}
              className="btn-primary"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {activeHabits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                {/* Habit Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${habit.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {habit.frequency === 'weekly' && habit.selectedDay !== undefined 
                          ? `${habit.frequency} - ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][habit.selectedDay]}`
                          : habit.frequency
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(habit)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit habit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(habit)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Habit Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-sm text-gray-500">Streak</div>
                    <div className="text-xl font-bold text-orange-600">🔥 {habit.streak}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-sm text-gray-500">Completion Ratio</div>
                    <div className="text-xl font-bold text-blue-600">
                      {calculateCompletionRatio(habit)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Edit Modal */}
      {editingHabit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Habit</h3>
                <button
                  onClick={cancelEditing}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveChanges(); }} className="space-y-4">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {habitIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, icon }))}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                          editForm.icon === icon
                            ? 'border-blue-500 bg-blue-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {habitColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          editForm.color === color
                            ? 'border-gray-800 scale-110 ring-2 ring-gray-300'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, frequency: 'daily' }))}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        editForm.frequency === 'daily'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Daily</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, frequency: 'weekly' }))}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        editForm.frequency === 'weekly'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Weekly</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Day Selection for Weekly */}
                {editForm.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of the Week
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, selectedDay: index }))}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            editForm.selectedDay === index
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add New Habit Modal */}
      {showAddHabit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Habit</h3>
                <button
                  onClick={cancelAddingHabit}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveNewHabit(); }} className="space-y-4">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {habitIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, icon }))}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                          editForm.icon === icon
                            ? 'border-blue-500 bg-blue-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {habitColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          editForm.color === color
                            ? 'border-gray-800 scale-110 ring-2 ring-gray-300'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, frequency: 'daily' }))}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        editForm.frequency === 'daily'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Daily</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, frequency: 'weekly' }))}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        editForm.frequency === 'weekly'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Weekly</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Day Selection for Weekly */}
                {editForm.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of the Week
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, selectedDay: index }))}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            editForm.selectedDay === index
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelAddingHabit}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save Habit</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HabitsManagement; 