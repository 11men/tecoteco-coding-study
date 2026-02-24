"use client"

import { LayoutGrid, MessageCircle, Repeat, TrendingUp, Hash, SmilePlus, ShoppingBag, UtensilsCrossed, Trophy, Music } from "lucide-react"
import type { MemeEntry, Category } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface CategoriesViewProps {
  memes: MemeEntry[]
  onSelect: (meme: MemeEntry) => void
  onCategorySelect: (cat: Category) => void
}

const categoryCards: { cat: Category; label: string; labelKo: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { cat: "expression", label: "Expression", labelKo: "표현", icon: <MessageCircle className="h-6 w-6" />, color: "text-primary", bg: "bg-primary/10" },
  { cat: "reaction", label: "Reaction", labelKo: "리액션", icon: <Repeat className="h-6 w-6" />, color: "text-accent", bg: "bg-accent/10" },
  { cat: "trend", label: "Trend", labelKo: "트렌드", icon: <TrendingUp className="h-6 w-6" />, color: "text-[var(--color-hot)]", bg: "bg-[var(--color-hot)]/10" },
  { cat: "slang", label: "Slang", labelKo: "신조어", icon: <Hash className="h-6 w-6" />, color: "text-[var(--color-x)]", bg: "bg-[var(--color-x)]/10" },
  { cat: "emoji", label: "Emoji / Symbol", labelKo: "이모지", icon: <SmilePlus className="h-6 w-6" />, color: "text-[var(--color-warm)]", bg: "bg-[var(--color-warm)]/10" },
  { cat: "item", label: "Item", labelKo: "유행템", icon: <ShoppingBag className="h-6 w-6" />, color: "text-[var(--color-instagram)]", bg: "bg-[var(--color-instagram)]/10" },
  { cat: "food", label: "Food", labelKo: "유행 음식", icon: <UtensilsCrossed className="h-6 w-6" />, color: "text-[var(--color-warm)]", bg: "bg-[var(--color-warm)]/10" },
  { cat: "challenge", label: "Challenge", labelKo: "챌린지", icon: <Trophy className="h-6 w-6" />, color: "text-[var(--color-tiktok)]", bg: "bg-[var(--color-tiktok)]/10" },
  { cat: "music", label: "Music", labelKo: "유행 음악", icon: <Music className="h-6 w-6" />, color: "text-primary", bg: "bg-primary/10" },
]

export function CategoriesView({ memes, onSelect, onCategorySelect }: CategoriesViewProps) {
  const getCatCount = (cat: Category) =>
    memes.filter((m) => m.category === cat).length

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
          <LayoutGrid className="h-4 w-4 text-secondary-foreground" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Browse by Category</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categoryCards.map((c) => {
          const count = getCatCount(c.cat)
          return (
            <button
              key={c.cat}
              onClick={() => onCategorySelect(c.cat)}
              className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.97]"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", c.bg, c.color)}>
                {c.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{c.label}</h3>
                <p className="text-[10px] text-muted-foreground">{c.labelKo}</p>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground font-mono">
                {count} memes
              </span>
            </button>
          )
        })}
      </div>

      {/* Recent additions */}
      <div className="mt-2">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Recently Added
        </h3>
        <div className="flex flex-col gap-2">
          {[...memes]
            .sort((a, b) => b.addedDate.localeCompare(a.addedDate))
            .slice(0, 5)
            .map((meme) => (
              <button
                key={meme.id}
                onClick={() => onSelect(meme)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">{meme.term}</h4>
                  <p className="text-[10px] text-muted-foreground">{meme.addedDate}</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium text-secondary-foreground">
                  {meme.category}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
