"use client"

import { useState } from "react"
import { Calendar, Flame, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react"
import type { MemeEntry, Era } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  memes: MemeEntry[]
  onSelect: (meme: MemeEntry) => void
}

const eras: { value: Era; label: string; color: string; bg: string; border: string }[] = [
  { value: "2025", label: "2025", color: "text-[var(--color-hot)]", bg: "bg-[var(--color-hot)]", border: "border-[var(--color-hot)]/30" },
  { value: "2024", label: "2024", color: "text-[var(--color-warm)]", bg: "bg-[var(--color-warm)]", border: "border-[var(--color-warm)]/30" },
  { value: "2020s", label: "2020s", color: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500/30" },
]

export function TimelineView({ memes, onSelect }: TimelineViewProps) {
  const [selectedEra, setSelectedEra] = useState<Era>("2025")

  const filteredMemes = memes.filter((m) => m.era === selectedEra)
  const currentEra = eras.find((e) => e.value === selectedEra)!

  const getHeatIcon = (heat: MemeEntry["heatLevel"]) => {
    switch (heat) {
      case "hot": return Flame
      case "warm": return TrendingUp
      case "cooling": return Minus
      case "cold": return TrendingDown
    }
  }

  const getHeatColor = (heat: MemeEntry["heatLevel"]) => {
    switch (heat) {
      case "hot": return "text-[var(--color-hot)]"
      case "warm": return "text-[var(--color-warm)]"
      case "cooling": return "text-muted-foreground"
      case "cold": return "text-muted-foreground/50"
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
          <Calendar className="h-4 w-4 text-secondary-foreground" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Era Timeline</h2>
      </div>

      {/* Era selector pills */}
      <div className="flex items-center gap-2">
        {eras.map((era) => {
          const count = memes.filter((m) => m.era === era.value).length
          const isActive = selectedEra === era.value
          return (
            <button
              key={era.value}
              onClick={() => setSelectedEra(era.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                isActive
                  ? cn(era.bg, "text-white")
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              <span className="font-bold font-mono">{era.label}</span>
              <span
                className={cn(
                  "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold font-mono",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Era badge + count summary */}
      <div className={cn(
        "flex items-center gap-3 rounded-2xl border p-3",
        currentEra.border,
        "bg-card"
      )}>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          currentEra.bg + "/10",
          currentEra.color
        )}>
          <span className="text-sm font-bold font-mono">{currentEra.label.replace("s", "")}</span>
        </div>
        <div>
          <h3 className={cn("text-sm font-bold", currentEra.color)}>
            {selectedEra === "2025" && "Now Trending"}
            {selectedEra === "2024" && "Last Year's Hits"}
            {selectedEra === "2020s" && "Early 2020s Classics"}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            <span className="font-bold font-mono">{filteredMemes.length}</span> memes in this era
          </p>
        </div>
      </div>

      {/* Meme list */}
      <div className="flex flex-col gap-2">
        {filteredMemes
          .sort((a, b) => b.trendScore - a.trendScore)
          .map((meme) => {
            const HeatIcon = getHeatIcon(meme.heatLevel)
            const heatColor = getHeatColor(meme.heatLevel)
            return (
              <button
                key={meme.id}
                onClick={() => onSelect(meme)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-[0.98]"
              >
                {/* Score */}
                <div className={cn("flex flex-col items-center gap-0.5", heatColor)}>
                  <HeatIcon className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-bold font-mono">{meme.trendScore}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">{meme.term}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium text-secondary-foreground">
                      {meme.category}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {meme.addedDate}
                    </span>
                  </div>
                </div>

                {/* Era badge */}
                <span className={cn(
                  "shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold font-mono",
                  currentEra.bg + "/15",
                  currentEra.color
                )}>
                  {meme.era}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
      </div>

      {/* Empty state */}
      {filteredMemes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-8">
          <Calendar className="h-8 w-8 text-muted-foreground/50 mb-2" />
          <p className="text-[11px] text-muted-foreground">No memes found for this era</p>
        </div>
      )}
    </div>
  )
}
