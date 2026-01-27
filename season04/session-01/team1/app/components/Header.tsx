'use client';

import { Settings, Bell } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🚌</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">파업 출근 비서</h1>
            <p className="text-xs text-muted-foreground">Strike Commute Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Settings size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
