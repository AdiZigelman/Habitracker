import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHabits } from '../contexts/HabitContext';
import { Trophy, Home, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { state } = useHabits();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🚀</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Habitracker
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/manage-habits"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/manage-habits') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Settings size={20} />
              <span>Manage</span>
            </Link>
            
            <Link
              to="/achievements"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/achievements') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Trophy size={20} />
              <span>Achievements</span>
            </Link>
          </nav>
          
          {/* User Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <div className="text-sm text-gray-500">Level</div>
                <div className="text-xl font-bold text-purple-600">{state.stats.level}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">XP</div>
                <div className="text-xl font-bold text-blue-600">{state.stats.totalXP}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 