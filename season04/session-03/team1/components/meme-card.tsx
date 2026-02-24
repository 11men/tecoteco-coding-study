"use client"

import { Flame, TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert, ShieldX, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react"
import type { MemeEntry } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface MemeCardProps {
  meme: MemeEntry
  onClick: (meme: MemeEntry) => void
  isSaved?: boolean
  onToggleSave?: (id: string) => void
}

export function MemeCard({ meme, onClick, isSaved, onToggleSave }: MemeCardProps) {
  const heatColor = {
    hot: "text-[var(--color-hot)]",
    warm: "text-[var(--color-warm)]",
    cooling: "text-muted-foreground",
    cold: "text-muted-foreground/50",
  }[meme.heatLevel]

  const HeatIcon = {
    hot: Flame,
    warm: TrendingUp,
    cooling: Minus,
    cold: TrendingDown,
  }[meme.heatLevel]

  const safetyConfig = {
    safe: { bg: "bg-[var(--color-safe)]/15", text: "text-[var(--color-safe)]", icon: ShieldCheck, label: "SAFE" },
    caution: { bg: "bg-[var(--color-caution)]/15", text: "text-[var(--color-caution)]", icon: ShieldAlert, label: "CAUTION" },
    risky: { bg: "bg-[var(--color-hot)]/15", text: "text-[var(--color-hot)]", icon: ShieldX, label: "RISKY" },
  }[meme.brandSafety]

  const SafetyIcon = safetyConfig.icon

  return (
    <button
      onClick={() => onClick(meme)}
      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] active:bg-card/80"
    >
      {/* Left: Score */}
      <div className={cn("flex flex-col items-center gap-0.5 pt-0.5", heatColor)}>
        <HeatIcon className="h-4 w-4" />
        <span className="text-[10px] font-bold font-mono">{meme.trendScore}</span>
      </div>

      {/* Center: Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-foreground truncate">{meme.term}</h3>
          <span className={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[8px] font-bold",
            safetyConfig.bg, safetyConfig.text
          )}>
            <SafetyIcon className="h-2.5 w-2.5" />
            {safetyConfig.label}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
          {meme.definition}
        </p>
        <div className="flex items-center gap-1">
          {meme.platforms.map((p) => (
            <span
              key={p}
              className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-secondary-foreground"
            >
              {p}
            </span>
          ))}
          <span className="ml-auto text-[9px] text-muted-foreground font-mono">
            {meme.generation === "All" ? "All Gen" : meme.generation}
          </span>
        </div>
      </div>

      {/* Right: Bookmark + Arrow */}
      <div className="flex shrink-0 items-center gap-1 mt-1">
        {onToggleSave && (
          <span
            role="button"
            tabIndex={0}
            aria-label={isSaved ? "Remove from saved" : "Save"}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave(meme.id)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation()
                e.preventDefault()
                onToggleSave(meme.id)
              }
            }}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
              isSaved
                ? "text-primary"
                : "text-muted-foreground/40 hover:text-muted-foreground"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  )
}
