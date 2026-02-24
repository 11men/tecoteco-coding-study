"use client"

import { cn } from "@/lib/utils"
import type { Platform, BrandSafety, Category } from "@/lib/meme-data"
import { ShieldCheck, ShieldAlert, ShieldX, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface FilterBarProps {
  selectedPlatform: Platform | "all"
  setSelectedPlatform: (v: Platform | "all") => void
  selectedSafety: BrandSafety | "all"
  setSelectedSafety: (v: BrandSafety | "all") => void
  selectedCategory: Category
  setSelectedCategory: (v: Category) => void
  resultCount: number
}

const platforms: { value: Platform | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "TikTok", label: "TikTok" },
  { value: "Instagram", label: "Insta" },
  { value: "Threads", label: "Threads" },
  { value: "X", label: "X" },
]

const safetyOptions: { value: BrandSafety | "all"; label: string; icon?: React.ReactNode }[] = [
  { value: "all", label: "All" },
  { value: "safe", label: "Safe", icon: <ShieldCheck className="h-3 w-3" /> },
  { value: "caution", label: "Caution", icon: <ShieldAlert className="h-3 w-3" /> },
  { value: "risky", label: "Risky", icon: <ShieldX className="h-3 w-3" /> },
]

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "expression", label: "Expression" },
  { value: "reaction", label: "Reaction" },
  { value: "trend", label: "Trend" },
  { value: "slang", label: "Slang" },
  { value: "emoji", label: "Emoji" },
  { value: "item", label: "Item" },
  { value: "food", label: "Food" },
  { value: "challenge", label: "Challenge" },
  { value: "music", label: "Music" },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function FilterBar({
  selectedPlatform,
  setSelectedPlatform,
  selectedSafety,
  setSelectedSafety,
  selectedCategory,
  setSelectedCategory,
  resultCount,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false)

  const activeCount = [
    selectedPlatform !== "all",
    selectedSafety !== "all",
    selectedCategory !== "all",
  ].filter(Boolean).length

  return (
    <div className="px-4 pb-3">
      {/* Toggle + Platform row */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
            expanded || activeCount > 0
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          <SlidersHorizontal className="h-3 w-3" />
          Filter
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[9px] font-bold text-primary">
              {activeCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {platforms.map((p) => (
            <Chip
              key={p.value}
              active={selectedPlatform === p.value}
              onClick={() => setSelectedPlatform(p.value)}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Expandable section */}
      {expanded && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 mb-2 animate-in slide-in-from-top-2 duration-200">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Brand Safety
            </span>
            <div className="flex flex-wrap gap-1.5">
              {safetyOptions.map((s) => (
                <Chip
                  key={s.value}
                  active={selectedSafety === s.value}
                  onClick={() => setSelectedSafety(s.value)}
                >
                  {s.icon}
                  {s.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <Chip
                  key={c.value}
                  active={selectedCategory === c.value}
                  onClick={() => setSelectedCategory(c.value)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result count */}
      <span className="text-[11px] text-muted-foreground">
        <span className="font-bold text-foreground font-mono">{resultCount}</span> results
      </span>
    </div>
  )
}
