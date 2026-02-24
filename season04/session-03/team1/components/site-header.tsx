"use client"

import { BookOpen, Bell } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground font-mono leading-none">
              MEME DICT
            </span>
            <span className="text-[9px] text-muted-foreground leading-none mt-0.5">
              for marketers
            </span>
          </div>
        </div>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-secondary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-secondary-foreground" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-hot)] text-[8px] font-bold text-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  )
}
