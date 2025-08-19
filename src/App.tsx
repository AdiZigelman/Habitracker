import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HabitProvider } from './contexts/HabitContext';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import Achievements from './components/Achievements';
import HabitsManagement from './components/HabitsManagement';
import Header from './components/Header';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <HabitProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/add-habit" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HabitForm />
                </motion.div>
              } 
            />
            <Route 
              path="/manage-habits" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HabitsManagement />
                </motion.div>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Achievements />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </HabitProvider>
  );
};

export default App; 