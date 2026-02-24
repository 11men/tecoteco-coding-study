"use client"

import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  Flame,
  TrendingUp,
  Minus,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ChevronRight,
} from "lucide-react"
import type { MemeEntry } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface SavedViewProps {
  memes: MemeEntry[]
  savedIds: string[]
  onSelect: (meme: MemeEntry) => void
  onToggleSave: (id: string) => void
  onClearAll?: () => void
}

export function SavedView({ memes, savedIds, onSelect, onToggleSave, onClearAll }: SavedViewProps) {
  const savedMemes = memes.filter((m) => savedIds.includes(m.id))

  if (savedMemes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Bookmark className="h-6 w-6" />
        </div>
        <h3 className="mb-1.5 text-base font-bold text-foreground text-center">
          아직 저장한 밈이 없어요
        </h3>
        <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed">
          밈 카드의 북마크 아이콘을 눌러 저장해보세요
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <BookmarkCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Saved Memes</h2>
            <p className="text-[10px] text-muted-foreground">
              {savedMemes.length}개 저장됨
            </p>
          </div>
        </div>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors active:bg-secondary/80"
          >
            <Trash2 className="h-3 w-3" />
            전체 삭제
          </button>
        )}
      </div>

      {/* Saved meme list */}
      <div className="flex flex-col gap-2">
        {savedMemes.map((meme) => (
          <SavedMemeItem
            key={meme.id}
            meme={meme}
            onSelect={onSelect}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </div>
  )
}

function SavedMemeItem({
  meme,
  onSelect,
  onToggleSave,
}: {
  meme: MemeEntry
  onSelect: (meme: MemeEntry) => void
  onToggleSave: (id: string) => void
}) {
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
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all">
      {/* Left: Score */}
      <button
        onClick={() => onSelect(meme)}
        className="flex flex-col items-center gap-0.5 pt-0.5"
      >
        <HeatIcon className={cn("h-4 w-4", heatColor)} />
        <span className={cn("text-[10px] font-bold font-mono", heatColor)}>{meme.trendScore}</span>
      </button>

      {/* Center: Content (clickable to open detail) */}
      <button
        onClick={() => onSelect(meme)}
        className="flex-1 min-w-0 text-left"
      >
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
      </button>

      {/* Right: Unbookmark button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleSave(meme.id)
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors active:bg-primary/20 mt-1"
        aria-label="Remove from saved"
      >
        <BookmarkCheck className="h-4 w-4" />
      </button>
    </div>
  )
}
