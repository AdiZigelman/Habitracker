# 🚀 Habitracker - Gamified Habit Formation Assistant

A beautiful, gamified web application to help users build and maintain positive habits in a visual, engaging way. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🔑 Core Features

- **Habit Creation & Management**
  - Add new habits with custom names, icons, and colors
  - Set frequency (daily/weekly)
  - Automatic icon and color suggestions based on habit name
  - Reminder time settings

- **Streak Tracking**
  - Visual streak counters with fire emojis 🔥
  - Automatic streak calculation and reset
  - Progress visualization

- **Gamification System**
  - Level progression (🌱 → 🌿 → 🌳 → 🌲 → 🎋)
  - XP system for completed habits
  - Achievement badges for milestones
  - Confetti celebrations on completions

- **Progress Visualization**
  - Interactive calendar view with completion tracking
  - Progress bars and statistics
  - Beautiful dashboard with overview cards
  - Detailed analytics and insights

### 🎨 UI/UX Features

- **Modern Design**
  - Playful and colorful interface
  - Smooth animations with Framer Motion
  - Beautiful gradients and shadows

- **Interactive Elements**
  - Hover effects and micro-interactions
  - Smooth transitions and transforms
  - Visual feedback for all actions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habitracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── HabitCard.tsx   # Individual habit display
│   ├── HabitForm.tsx   # Habit creation form
│   ├── CalendarView.tsx # Calendar visualization
│   ├── StatsOverview.tsx # Statistics display
│   ├── Achievements.tsx # Achievement system
│   └── Header.tsx      # Navigation header
├── contexts/           # React contexts
│   └── HabitContext.tsx # Habit state management
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type interfaces
├── utils/              # Utility functions
│   └── habitUtils.ts   # Habit-related calculations
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

### Key Components

- **HabitContext**: Central state management for habits, completions, and achievements
- **Dashboard**: Main interface with tabbed navigation
- **HabitCard**: Individual habit display with completion tracking
- **CalendarView**: Monthly progress visualization
- **StatsOverview**: Detailed analytics and progress charts
---

**Start building positive habits today! 🌱✨** 
