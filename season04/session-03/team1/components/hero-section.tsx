"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

interface HeroSectionProps {
  onSearch: (query: string) => void
  searchQuery: string
}

export function HeroSection({ onSearch, searchQuery }: HeroSectionProps) {
  const [query, setQuery] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  const quickSearches = [
    "제곱근 하트",
    "~하다못해",
    "숏폼 브레인",
    "500원 갬성",
    "디깅 모먼트",
    "갈비만두",
  ]

  return (
    <section className="px-4 pt-4 pb-3">
      <form onSubmit={handleSubmit} className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value === "") onSearch("")
          }}
          placeholder="Search memes, slang, trends..."
          className="h-11 w-full rounded-xl border border-border bg-secondary pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {quickSearches.map((term) => (
          <button
            key={term}
            onClick={() => {
              setQuery(term)
              onSearch(term)
            }}
            className="shrink-0 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  )
}
