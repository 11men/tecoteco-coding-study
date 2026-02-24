"use client"

import { useState, useCallback } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  CheckCircle2,
  XCircle,
  Hash,
  Calendar,
  Users,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Target,
  Copy,
  Star,
  AlertTriangle,
} from "lucide-react"
import type { MemeEntry } from "@/lib/meme-data"
import { cn } from "@/lib/utils"

interface MemeDetailProps {
  meme: MemeEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleSave?: (id: string) => void
  isSaved?: boolean
}

export function MemeDetail({ meme, open, onOpenChange, onToggleSave, isSaved }: MemeDetailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // Fallback: silently fail if clipboard is not available
    }
  }, [])

  if (!meme) return null

  const heatConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    hot: {
      color: "text-[var(--color-hot)]",
      bg: "bg-[var(--color-hot)]/10",
      icon: <Flame className="h-4 w-4" />,
      label: "HOT",
    },
    warm: {
      color: "text-[var(--color-warm)]",
      bg: "bg-[var(--color-warm)]/10",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "WARM",
    },
    cooling: {
      color: "text-muted-foreground",
      bg: "bg-muted",
      icon: <Minus className="h-4 w-4" />,
      label: "COOLING",
    },
    cold: {
      color: "text-muted-foreground/50",
      bg: "bg-muted/50",
      icon: <TrendingDown className="h-4 w-4" />,
      label: "COLD",
    },
  }

  const safetyConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string; desc: string }> = {
    safe: {
      color: "text-[var(--color-safe)]",
      bg: "bg-[var(--color-safe)]/10 border-[var(--color-safe)]/20",
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Brand Safe",
      desc: "Suitable for most brand communications.",
    },
    caution: {
      color: "text-[var(--color-caution)]",
      bg: "bg-[var(--color-caution)]/10 border-[var(--color-caution)]/20",
      icon: <ShieldAlert className="h-5 w-5" />,
      label: "Use with Caution",
      desc: "Context-dependent. Review brand guidelines before use.",
    },
    risky: {
      color: "text-[var(--color-hot)]",
      bg: "bg-[var(--color-hot)]/10 border-[var(--color-hot)]/20",
      icon: <ShieldX className="h-5 w-5" />,
      label: "High Risk",
      desc: "May cause negative reactions. Use only for specific niche audiences.",
    },
  }

  const platformColors: Record<string, string> = {
    TikTok: "bg-[var(--color-tiktok)] text-foreground",
    Instagram: "bg-[var(--color-instagram)] text-foreground",
    Threads: "bg-[var(--color-threads)] text-foreground",
    X: "bg-[var(--color-x)] text-foreground",
  }

  const heat = heatConfig[meme.heatLevel] || heatConfig.cold
  const safety = safetyConfig[meme.brandSafety] || safetyConfig.safe

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-3xl px-0 pb-0" aria-describedby="meme-detail-desc">
        <SheetHeader className="px-5 pt-1 pb-3">
          {/* Handle bar */}
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold", heat.bg, heat.color)}>
                {heat.icon}
                {heat.label}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{meme.trendScore}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary" aria-label="Share">
                <Share2 className="h-4 w-4 text-secondary-foreground" />
              </button>
              <button
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isSaved ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"
                )}
                aria-label={isSaved ? "Remove from saved" : "Save"}
                onClick={() => meme && onToggleSave?.(meme.id)}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <SheetTitle className="text-2xl font-bold text-foreground text-left">
            {meme.term}
          </SheetTitle>
          <SheetDescription id="meme-detail-desc" className="sr-only">
            {meme.term} - {meme.definition}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <div className="flex flex-col gap-5">
            {/* Definition */}
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Definition
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {meme.definition}
              </p>
            </div>

            {/* Example */}
            <div className="rounded-xl bg-secondary/50 p-3.5 border border-border">
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Example
              </h4>
              <p className="text-sm text-foreground italic leading-relaxed">
                {meme.example}
              </p>
            </div>

            {/* Origin */}
            <div>
              <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Origin
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {meme.origin}
              </p>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex gap-1">
                  {meme.platforms.map((p) => (
                    <span
                      key={p}
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                        platformColors[p] || "bg-muted text-muted-foreground"
                      )}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-secondary-foreground">
                  {meme.generation === "All" ? "All Generations" : meme.generation}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-mono text-secondary-foreground">
                  {meme.addedDate}
                </span>
              </div>
            </div>

            {/* Brand Safety Card */}
            <div className={cn("rounded-xl border p-4", safety.bg)}>
              <div className={cn("flex items-center gap-2 mb-2", safety.color)}>
                {safety.icon}
                <span className="text-sm font-bold">{safety.label}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-4">
                {safety.desc}
              </p>

              <div className="flex flex-col gap-2">
                {meme.doExample && (
                  <div className="flex gap-2 rounded-lg bg-background/50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-safe)]" />
                    <div>
                      <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-[var(--color-safe)]">
                        DO
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {meme.doExample}
                      </p>
                    </div>
                  </div>
                )}
                {meme.dontExample && (
                  <div className="flex gap-2 rounded-lg bg-background/50 p-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-hot)]" />
                    <div>
                      <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-[var(--color-hot)]">
                        {"DON'T"}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {meme.dontExample}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spread Timeline */}
            {meme.spreadTimeline && meme.spreadTimeline.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Spread Timeline
                </h4>
                <div className="relative ml-2">
                  {/* Vertical line */}
                  <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px border-l-2 border-border" />
                  <div className="flex flex-col gap-4">
                    {meme.spreadTimeline.map((evt, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 pl-5">
                        {/* Circle marker */}
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-background" />
                        <div className="flex flex-1 flex-col gap-0.5">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {evt.date}
                          </span>
                          <p className="text-xs text-foreground leading-relaxed">
                            {evt.event}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            platformColors[evt.platform] || "bg-muted text-muted-foreground"
                          )}
                        >
                          {evt.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Marketing Guide */}
            {meme.marketingGuide && (
              <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  Marketing Guide
                </h4>
                <div className="flex flex-col gap-3">
                  {/* Suitable Industries */}
                  {meme.marketingGuide.suitableIndustries.length > 0 && (
                    <div className="rounded-xl bg-secondary/50 p-3.5 border border-border">
                      <div className="mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-safe)]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-safe)]">
                          Suitable Industries
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meme.marketingGuide.suitableIndustries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="secondary"
                            className="border-[var(--color-safe)]/20 bg-[var(--color-safe)]/10 text-[var(--color-safe)] text-[10px]"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unsuitable Industries */}
                  {meme.marketingGuide.unsuitableIndustries.length > 0 && (
                    <div className="rounded-xl bg-secondary/50 p-3.5 border border-border">
                      <div className="mb-2 flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          Unsuitable Industries
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {meme.marketingGuide.unsuitableIndustries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="secondary"
                            className="border-[var(--color-hot)]/20 bg-[var(--color-hot)]/10 text-[var(--color-hot)] text-[10px]"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Examples */}
                  {meme.marketingGuide.copyExamples.length > 0 && (
                    <div className="rounded-xl bg-secondary/50 p-3.5 border border-border">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          Copy Examples
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {meme.marketingGuide.copyExamples.map((example, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCopy(example, idx)}
                            className="group flex items-start gap-2 rounded-lg bg-background/50 p-3 text-left transition-colors hover:bg-background/80"
                          >
                            <span className="flex-1 text-[11px] text-foreground italic leading-relaxed">
                              &ldquo;{example}&rdquo;
                            </span>
                            <span className="shrink-0 mt-0.5">
                              {copiedIndex === idx ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-safe)]" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Season Tags */}
                  {meme.marketingGuide.seasonTags.length > 0 && (
                    <div className="rounded-xl bg-secondary/50 p-3.5 border border-border">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          Season Fit
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {meme.marketingGuide.seasonTags.map((tag) => (
                          <div key={tag.season} className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2">
                            <span className="text-[11px] font-medium text-foreground">
                              {tag.season}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < tag.fit
                                      ? "fill-[var(--color-warm)] text-[var(--color-warm)]"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Note */}
                  {meme.marketingGuide.riskNote && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <div>
                          <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-amber-500">
                            Risk Note
                          </span>
                          <p className="text-[11px] text-amber-500/80 leading-relaxed">
                            {meme.marketingGuide.riskNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Terms */}
            {meme.relatedTerms.length > 0 && (
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Related
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {meme.relatedTerms.map((term) => (
                    <Badge key={term} variant="secondary" className="text-[10px]">
                      #{term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
