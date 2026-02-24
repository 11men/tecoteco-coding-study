"use client"

import { Flame, Search, LayoutGrid, Bookmark, User } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = "trending" | "search" | "categories" | "saved" | "profile"

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "trending", label: "Trending", icon: <Flame className="h-5 w-5" /> },
  { id: "search", label: "Search", icon: <Search className="h-5 w-5" /> },
  { id: "categories", label: "Browse", icon: <LayoutGrid className="h-5 w-5" /> },
  { id: "saved", label: "Saved", icon: <Bookmark className="h-5 w-5" /> },
  { id: "profile", label: "My", icon: <User className="h-5 w-5" /> },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
