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
  - Playful and colorful interface inspired by Duolingo/Habitica
  - Responsive design for all devices
  - Smooth animations with Framer Motion
  - Beautiful gradients and shadows

- **Interactive Elements**
  - Hover effects and micro-interactions
  - Smooth transitions and transforms
  - Visual feedback for all actions

### 🚀 Advanced Features

- **Data Persistence**
  - Local storage for habits and progress
  - Automatic data saving
  - No account required

- **Smart Suggestions**
  - Automatic icon selection based on habit keywords
  - Color themes that match habit types
  - Intelligent streak calculations

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

## 📱 Usage

### Creating Your First Habit

1. Click "Add Habit" from the dashboard
2. Enter a habit name (e.g., "Morning workout", "Read 30 minutes")
3. Choose an icon and color (or let the app suggest them)
4. Set frequency and reminder time
5. Click "Create Habit"

### Tracking Progress

- **Daily Check-ins**: Click the habit card to mark it complete
- **Streak Building**: Maintain daily consistency to build streaks
- **Level Up**: Watch your habits grow from seeds to trees
- **Achievements**: Unlock badges for milestones

### Dashboard Features

- **Overview Tab**: See all your active habits with current stats
- **Calendar Tab**: Monthly view of completion patterns
- **Stats Tab**: Detailed analytics and progress tracking

## 🎯 Achievement System

- **Week Warrior**: 7-day streak 🔥
- **Monthly Master**: 30-day streak ⭐
- **Century Champion**: 100-day streak 🏆
- **Growth Guru**: Level 3 🌳
- **Legendary**: Level 5 👑
- **XP Hunter**: 1000 XP ⚡
- **XP Master**: 5000 XP 🚀

## 🎨 Customization

### Adding New Icons
Edit `src/utils/habitUtils.ts` to add more icon mappings:

```typescript
const iconMap: { [key: string]: string } = {
  'workout': '🏋️',
  'meditation': '🧘',
  // Add your custom icons here
  'custom-habit': '🎯'
};
```

### Custom Colors
Modify the color schemes in `tailwind.config.js`:

```javascript
extend: {
  colors: {
    custom: {
      500: '#your-color-here'
    }
  }
}
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

## 🚀 Future Enhancements

- [ ] **Social Features**: Share streaks with friends
- [ ] **AI Suggestions**: Smart habit recommendations
- [ ] **Dark Mode**: 🌙 theme toggle
- [ ] **Push Notifications**: Browser notifications
- [ ] **Data Export**: Backup and restore functionality
- [ ] **Mobile App**: React Native version
- [ ] **Cloud Sync**: Multi-device synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by habit tracking apps like Habitica and Duolingo
- Built with modern web technologies for the best user experience
- Designed with accessibility and usability in mind

---

**Start building positive habits today! 🌱✨** 