"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  ChevronRight,
  Volume2,
  Mic,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_BUILDINGS, MOCK_REVIEWS } from "@/lib/mock-data";
import { NOISE_TYPE_LABELS, NoiseType } from "@/lib/types";
import { NoiseRecorder } from "@/components/NoiseRecorder";

const REGIONS = ["전국", "서울", "경기", "인천", "부산", "대구", "광주"];

function getTopNoiseTypes(buildingId: string): NoiseType[] {
  const reviews = MOCK_REVIEWS.filter((r) => r.buildingId === buildingId);
  const counts: Record<string, number> = {};
  reviews.forEach((r) =>
    r.noiseTypes.forEach((t) => (counts[t] = (counts[t] || 0) + 1))
  );
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([k]) => k as NoiseType);
}

function getScoreColor(score: number) {
  if (score <= 2) return "text-noise-quiet";
  if (score <= 3.5) return "text-noise-moderate";
  return "text-noise-loud";
}

export default function Home() {
  const [activeRegion, setActiveRegion] = useState("전국");
  const [showRecorder, setShowRecorder] = useState(false);

  const sortedBuildings = [...MOCK_BUILDINGS].sort(
    (a, b) => b.reviewCount - a.reviewCount
  );

  return (
    <div className="min-h-dvh bg-background">
      {/* ─── App Header ─── */}
      <header className="sticky top-0 z-40 bg-background border-b border-card-border">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Volume2 size={15} />
            </div>
            <span className="text-base font-bold text-foreground">소음지도</span>
          </div>
        </div>
        {/* Search bar */}
        <div className="px-4 pb-3">
          <Link
            href="/map"
            className="flex items-center gap-2.5 rounded-xl border border-card-border bg-[#f8f8f8] px-4 py-3"
          >
            <Search size={16} className="text-muted" />
            <span className="text-sm text-muted">주소, 건물명으로 검색!</span>
          </Link>
        </div>
      </header>

      {/* ─── Noise Recorder Toggle ─── */}
      <div className="px-4 py-3 border-b border-card-border">
        <button
          type="button"
          onClick={() => setShowRecorder(!showRecorder)}
          className="flex w-full items-center gap-3 rounded-xl bg-primary-light px-4 py-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Mic size={16} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-primary">🎙️ 실시간 소음 측정</p>
            <p className="text-[10px] text-primary/70">마이크로 주변 소음을 측정해보세요</p>
          </div>
          <ChevronRight
            size={16}
            className={cn(
              "text-primary transition-transform",
              showRecorder && "rotate-90"
            )}
          />
        </button>
        {showRecorder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 overflow-hidden"
          >
            <NoiseRecorder />
          </motion.div>
        )}
      </div>

      {/* ─── Region Chips ─── */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar border-b border-card-border">
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setActiveRegion(region)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              activeRegion === region
                ? "bg-foreground text-background"
                : "bg-[#f5f5f5] text-muted"
            )}
          >
            {region}
          </button>
        ))}
      </div>

      {/* ─── Popular Buildings ─── */}
      <section className="px-4 pt-5 pb-2">
        <h2 className="text-base font-bold text-foreground">
          후기 많은 아파트, 오피스텔이에요
        </h2>
        <p className="mt-1 text-xs text-muted">
          거주자가 직접 남긴 소음 후기를 살펴보세요
        </p>
      </section>

      <div className="px-4 pb-3">
        {sortedBuildings.map((building, i) => (
          <Link
            key={building.id}
            href={`/building/${building.id}`}
            className="flex items-center gap-3 py-3.5 border-b border-card-border card-hover"
          >
            {/* Rank + Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]">
              <span className="text-sm font-bold text-muted">{i + 1}</span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">
                {building.buildingName}
              </h3>
              <p className="mt-0.5 text-xs text-muted truncate">
                {building.address}
              </p>
            </div>
            {/* Score */}
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className={cn("text-sm font-bold", getScoreColor(building.avgNoiseScore))}>
                  {building.avgNoiseScore.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] text-primary font-medium">
                {building.reviewCount}명 작성
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="px-4 pb-4">
        <Link
          href="/map"
          className="flex w-full items-center justify-center gap-1 rounded-xl border border-card-border py-3 text-xs font-medium text-muted"
        >
          후기 많은 인기 건물 더보기
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* ─── Section divider ─── */}
      <div className="section-divider" />

      {/* ─── Noise Level Rankings ─── */}
      <section className="px-4 py-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-noise-quiet" />
          <h2 className="text-base font-bold text-foreground">
            조용한 동네 추천
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sortedBuildings
            .filter((b) => b.avgNoiseScore <= 3)
            .slice(0, 4)
            .map((building) => {
              const tags = getTopNoiseTypes(building.id);
              return (
                <Link
                  key={building.id}
                  href={`/building/${building.id}`}
                  className="rounded-xl border border-card-border p-3 card-hover"
                >
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {building.buildingName}
                  </h4>
                  <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-muted">
                    <MapPin size={8} />
                    <span className="truncate">{building.address}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-foreground">
                      {building.avgNoiseScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted">★★★★</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-primary-light px-1.5 py-0.5 text-[9px] font-medium text-primary"
                      >
                        #{NOISE_TYPE_LABELS[t]}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* ─── FAB ─── */}
      <Link href="/review" className="fab">
        + 리뷰 쓰기
      </Link>
    </div>
  );
}
