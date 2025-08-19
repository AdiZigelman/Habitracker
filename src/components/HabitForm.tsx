import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../contexts/HabitContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Calendar } from 'lucide-react';

const HabitForm: React.FC = () => {
  const navigate = useNavigate();
  const { addHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    icon: '🌟',
    color: 'bg-blue-500',
    frequency: 'daily' as 'daily' | 'weekly'
  });
  
  const habitIcons = ['🏋️', '🏃', '🧘', '📚', '💧', '😴', '🚶', '🧘‍♀️', '📝', '📖', '🎯', '🧹', '👨‍🍳', '🌱', '🎨', '🎵', '💃', '💻', '✍️', '🌟'];
  const habitColors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    addHabit({
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      frequency: formData.frequency,
      createdAt: new Date()
    });
    
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto px-8 py-8">
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
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Create New Habit</h1>
          <p className="text-xl text-gray-600">
            Start building positive habits that will transform your life
          </p>
        </div>
      </motion.div>
      
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning workout, Read 30 minutes"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            />
          </div>
          
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose an Icon
            </label>
            <div className="grid grid-cols-10 gap-3">
              {habitIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                    formData.icon === icon
                      ? 'border-blue-500 bg-blue-50 scale-110'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
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
              Choose a Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {habitColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-800 scale-110 ring-2 ring-gray-300'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
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
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, frequency: 'daily' }))}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.frequency === 'daily'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar size={20} />
                  <span className="font-medium">Daily</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, frequency: 'weekly' }))}
                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                  formData.frequency === 'weekly'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar size={20} />
                  <span className="font-medium">Weekly</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg font-semibold"
          >
            <Save size={20} className="inline mr-2" />
            Create Habit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HabitForm; 