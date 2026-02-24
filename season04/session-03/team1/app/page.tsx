"use client"

import { useState, useMemo } from "react"
import { User } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { HeroSection } from "@/components/hero-section"
import { FilterBar } from "@/components/filter-bar"
import { MemeCard } from "@/components/meme-card"
import { MemeDetail } from "@/components/meme-detail"
import { TrendingView } from "@/components/trending-view"
import { CategoriesView } from "@/components/categories-view"
import { SavedView } from "@/components/saved-view"
import { EmptyView } from "@/components/empty-view"
import { useSavedMemes } from "@/hooks/use-saved-memes"
import { memeData } from "@/lib/meme-data"
import type { MemeEntry, Platform, BrandSafety, Category } from "@/lib/meme-data"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [selectedSafety, setSelectedSafety] = useState<BrandSafety | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [selectedMeme, setSelectedMeme] = useState<MemeEntry | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const { savedIds, toggleSave, isSaved, clearAll } = useSavedMemes()

  const filteredMemes = useMemo(() => {
    let results = [...memeData]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      results = results.filter(
        (m) =>
          m.term.toLowerCase().includes(q) ||
          m.definition.toLowerCase().includes(q) ||
          m.relatedTerms.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedPlatform !== "all") {
      results = results.filter((m) => m.platforms.includes(selectedPlatform))
    }

    if (selectedSafety !== "all") {
      results = results.filter((m) => m.brandSafety === selectedSafety)
    }

    if (selectedCategory !== "all") {
      results = results.filter((m) => m.category === selectedCategory)
    }

    results.sort((a, b) => b.trendScore - a.trendScore)
    return results
  }, [searchQuery, selectedPlatform, selectedSafety, selectedCategory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      setActiveTab("search")
    }
  }

  const handleMemeClick = (meme: MemeEntry) => {
    setSelectedMeme(meme)
    setDetailOpen(true)
  }

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat)
    setSelectedPlatform("all")
    setSelectedSafety("all")
    setSearchQuery("")
    setActiveTab("search")
  }

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    if (tab === "trending") {
      setSearchQuery("")
      setSelectedPlatform("all")
      setSelectedSafety("all")
      setSelectedCategory("all")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Trending Tab */}
        {activeTab === "trending" && (
          <div className="pt-4">
            {/* Hero banner */}
            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Daily Meme Brief
                </p>
                <h2 className="text-lg font-bold text-foreground leading-snug mb-1 text-balance">
                  {"오늘의 밈, 모르면"}
                  <br />
                  <span className="text-primary">{"마케터 실격"}</span>
                </h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {"트렌드 밈부터 플랫폼별 용어까지, 브랜드 톤앤매너에 맞는 밈 활용법을 확인하세요."}
                </p>
              </div>
            </div>
            <TrendingView memes={memeData} onSelect={handleMemeClick} />
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div>
            <HeroSection onSearch={handleSearch} searchQuery={searchQuery} />
            <FilterBar
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              selectedSafety={selectedSafety}
              setSelectedSafety={setSelectedSafety}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              resultCount={filteredMemes.length}
            />

            <div className="flex flex-col gap-2 px-4 pb-4">
              {filteredMemes.length > 0 ? (
                filteredMemes.map((meme) => (
                  <MemeCard key={meme.id} meme={meme} onClick={handleMemeClick} isSaved={isSaved(meme.id)} onToggleSave={toggleSave} />
                ))
              ) : (
                <EmptyView
                  icon={<span className="text-xl">{"?"}</span>}
                  title="No results found"
                  description="Try adjusting your search or filters to discover more memes."
                />
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="pt-4">
            <CategoriesView
              memes={memeData}
              onSelect={handleMemeClick}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && (
          <SavedView
            memes={memeData}
            savedIds={savedIds}
            onSelect={handleMemeClick}
            onToggleSave={toggleSave}
            onClearAll={clearAll}
          />
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <EmptyView
            icon={<User className="h-6 w-6" />}
            title="Profile"
            description="Sign in to personalize your meme dictionary experience and track your favorite terms."
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <MemeDetail
        meme={selectedMeme}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onToggleSave={toggleSave}
        isSaved={selectedMeme ? isSaved(selectedMeme.id) : false}
      />
    </div>
  )
}
