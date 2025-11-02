import React from 'react';
import { Home, Search, BarChart3, MessageCircle, User, Brain } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'quiz' as Screen, icon: Brain, label: 'Quiz' },
    { id: 'analysis' as Screen, icon: Search, label: 'Analyze' },
    { id: 'reviews' as Screen, icon: MessageCircle, label: 'Reviews' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border-t border-pink-200 px-4 py-3 safe-area-bottom">
      <div className="flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
              currentScreen === id
                ? 'text-pink-600 bg-pink-50'
                : 'text-gray-500 hover:text-pink-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
