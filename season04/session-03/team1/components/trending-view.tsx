"use client"

import { Flame, TrendingUp, Zap, ArrowUpRight } from "lucide-react"
import type { MemeEntry } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface TrendingViewProps {
  memes: MemeEntry[]
  onSelect: (meme: MemeEntry) => void
}

function HotCard({ meme, rank, onSelect }: { meme: MemeEntry; rank: number; onSelect: (m: MemeEntry) => void }) {
  return (
    <button
      onClick={() => onSelect(meme)}
      className="relative flex flex-col rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-hot)]/15 text-[10px] font-bold text-[var(--color-hot)] font-mono">
            {rank}
          </span>
          <div className="flex items-center gap-1 text-[var(--color-hot)]">
            <Flame className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold font-mono">{meme.trendScore}</span>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <h3 className="mb-1.5 text-base font-bold text-foreground">{meme.term}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{meme.definition}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {meme.platforms.map((p) => (
          <span key={p} className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-secondary-foreground">
            {p}
          </span>
        ))}
      </div>
    </button>
  )
}

function TrendItem({ meme, rank, onSelect }: { meme: MemeEntry; rank: number; onSelect: (m: MemeEntry) => void }) {
  const heat = meme.heatLevel
  return (
    <button
      onClick={() => onSelect(meme)}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-[0.98]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground font-mono">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground truncate">{meme.term}</h4>
        <p className="text-[11px] text-muted-foreground truncate">{meme.definition}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className={cn(
          "flex items-center gap-0.5 text-[10px] font-bold font-mono",
          heat === "hot" ? "text-[var(--color-hot)]" : heat === "warm" ? "text-[var(--color-warm)]" : "text-muted-foreground"
        )}>
          {heat === "hot" ? <Flame className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
          {meme.trendScore}
        </div>
        <span className={cn(
          "rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase",
          meme.brandSafety === "safe" ? "bg-[var(--color-safe)]/15 text-[var(--color-safe)]"
            : meme.brandSafety === "caution" ? "bg-[var(--color-caution)]/15 text-[var(--color-caution)]"
            : "bg-[var(--color-hot)]/15 text-[var(--color-hot)]"
        )}>
          {meme.brandSafety}
        </span>
      </div>
    </button>
  )
}

export function TrendingView({ memes, onSelect }: TrendingViewProps) {
  const sorted = [...memes].sort((a, b) => b.trendScore - a.trendScore)
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-hot)]/15">
          <Flame className="h-4 w-4 text-[var(--color-hot)]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Trending Now</h2>
          <p className="text-[10px] text-muted-foreground">Updated in real-time</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Zap className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-medium text-accent">Live</span>
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="flex flex-col gap-3">
        {top3.map((meme, i) => (
          <HotCard key={meme.id} meme={meme} rank={i + 1} onSelect={onSelect} />
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          All Rankings
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Rest of the list */}
      <div className="flex flex-col gap-2">
        {rest.map((meme, i) => (
          <TrendItem key={meme.id} meme={meme} rank={i + 4} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
