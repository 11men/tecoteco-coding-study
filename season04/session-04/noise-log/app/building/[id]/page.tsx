"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Star,
    MapPin,
    Car,
    Construction,
    Train,
    Store,
    Clock,
    Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    MOCK_BUILDINGS,
    MOCK_REVIEWS,
    MOCK_OBJECTIVE_DATA,
} from "@/lib/mock-data";
import {
    NoiseType,
    NOISE_TYPE_LABELS,
    NOISE_TYPE_ICONS,
    TIME_SLOT_LABELS,
} from "@/lib/types";

const TABS = ["홈", "소음 지표", "리뷰"];

function getScoreColor(score: number) {
    if (score <= 2) return "text-noise-quiet";
    if (score <= 3.5) return "text-noise-moderate";
    return "text-noise-loud";
}

function getScoreBg(score: number) {
    if (score <= 2) return "bg-noise-quiet";
    if (score <= 3.5) return "bg-noise-moderate";
    return "bg-noise-loud";
}

function getScoreLabel(score: number) {
    if (score <= 2) return "조용";
    if (score <= 3.5) return "보통";
    return "시끄러움";
}

export default function BuildingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const building = MOCK_BUILDINGS.find((b) => b.id === id);
    const reviews = MOCK_REVIEWS.filter((r) => r.buildingId === id);
    const objectiveData = MOCK_OBJECTIVE_DATA[id];
    const [activeTab, setActiveTab] = useState("홈");

    if (!building) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold">건물을 찾을 수 없습니다</p>
                    <Link href="/map" className="mt-4 text-sm text-primary">
                        지도로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // Score distribution
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
        if (r.noiseScore >= 1 && r.noiseScore <= 5) {
            distribution[r.noiseScore - 1]++;
        }
    });
    const maxDist = Math.max(...distribution, 1);

    const buildingTypeLabel =
        building.buildingType === "APARTMENT"
            ? "아파트"
            : building.buildingType === "OFFICETEL"
                ? "오피스텔"
                : building.buildingType === "VILLA"
                    ? "빌라"
                    : "기타";

    return (
        <div className="bg-background min-h-dvh">
            {/* ─── Sticky header ─── */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-card-border bg-background px-4">
                <Link
                    href="/map"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-foreground max-w-[200px] truncate">
                    {building.buildingName}
                </h1>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-muted">
                    <Share2 size={18} />
                </button>
            </header>

            {/* ─── Building header ─── */}
            <div className="px-4 pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium text-muted px-1.5 py-0.5 rounded bg-[#f5f5f5]">
                        {buildingTypeLabel}
                    </span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                    {building.buildingName || building.address}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                        <span className={cn("text-lg font-bold", getScoreColor(building.avgNoiseScore))}>
                            {building.avgNoiseScore.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-xs text-muted">
                        후기 {building.reviewCount}개 &gt;
                    </span>
                </div>
                {/* Noise type badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {(() => {
                        const counts: Record<string, number> = {};
                        reviews.forEach((r) =>
                            r.noiseTypes.forEach((t) => (counts[t] = (counts[t] || 0) + 1))
                        );
                        return Object.entries(counts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 4)
                            .map(([type]) => (
                                <span
                                    key={type}
                                    className="rounded-md bg-primary-light px-2 py-1 text-[10px] font-medium text-primary"
                                >
                                    {NOISE_TYPE_LABELS[type as NoiseType]}
                                </span>
                            ));
                    })()}
                </div>
            </div>

            {/* ─── Tab bar ─── */}
            <div className="tab-bar px-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn("tab-item", activeTab === tab && "active")}
                    >
                        {tab}
                        {tab === "리뷰" && (
                            <span className="ml-1 text-primary text-[10px] font-bold">
                                {reviews.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ─── Tab Content ─── */}
            {activeTab === "홈" && (
                <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Score distribution */}
                    <div className="px-4 py-5">
                        <h3 className="text-sm font-bold text-foreground mb-4">소음 점수 분포</h3>
                        <div className="space-y-2.5">
                            {[5, 4, 3, 2, 1].map((score) => {
                                const count = distribution[score - 1];
                                const pct = (count / maxDist) * 100;
                                return (
                                    <div key={score} className="flex items-center gap-2.5">
                                        <span className="w-4 text-xs font-medium text-muted text-right">{score}</span>
                                        <div className="flex-1 h-5 rounded bg-[#f5f5f5] overflow-hidden">
                                            <motion.div
                                                className={cn("h-full rounded", getScoreBg(score))}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.5, delay: (5 - score) * 0.08 }}
                                            />
                                        </div>
                                        <span className="w-6 text-[11px] text-muted text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="section-divider" />

                    {/* Building info table */}
                    <div className="px-4 py-4">
                        <div className="info-row">
                            <span className="info-label">건물</span>
                            <span className="info-value">{buildingTypeLabel}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">주소</span>
                            <span className="info-value flex items-center gap-1">
                                <MapPin size={11} className="text-muted shrink-0" />
                                {building.address}
                            </span>
                        </div>
                        {building.predictedNoiseScore && (
                            <div className="info-row">
                                <span className="info-label">AI 예측</span>
                                <span className="info-value flex items-center gap-1">
                                    🤖 {building.predictedNoiseScore.toFixed(1)} / 5.0
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="section-divider" />

                    {/* Recent reviews preview */}
                    <div className="px-4 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-foreground">최근 리뷰</h3>
                            <button
                                type="button"
                                onClick={() => setActiveTab("리뷰")}
                                className="text-xs text-primary font-medium"
                            >
                                전체보기 &gt;
                            </button>
                        </div>
                        {reviews.slice(0, 2).map((review) => (
                            <div key={review.id} className="mb-4 last:mb-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f5f5] text-[10px] font-bold text-muted">
                                        {(review.nickname || "익명")[0]}
                                    </div>
                                    <span className="text-xs font-medium text-foreground">
                                        {review.nickname || "익명"}
                                    </span>
                                    {review.floor && (
                                        <span className="text-[10px] text-muted">{review.floor}층</span>
                                    )}
                                    <div className="flex items-center gap-0.5 ml-auto">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={10}
                                                className={s <= review.noiseScore ? "text-amber-400 fill-amber-400" : "text-[#e5e7eb]"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs leading-relaxed text-foreground line-clamp-2">
                                    {review.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === "소음 지표" && objectiveData && (
                <motion.div
                    key="data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 py-5"
                >
                    <h3 className="text-sm font-bold text-foreground mb-4">📊 객관적 지표 분석</h3>

                    <div className="space-y-0">
                        <div className="info-row">
                            <span className="info-label flex items-center gap-1.5">
                                <Car size={13} className="text-accent-orange" /> 차도
                            </span>
                            <span className="info-value">
                                {objectiveData.roadDistance}m
                                {objectiveData.roadLanes && ` · ${objectiveData.roadLanes}차선`}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label flex items-center gap-1.5">
                                <Construction size={13} className="text-noise-loud" /> 공사
                            </span>
                            <span className="info-value">
                                {objectiveData.nearbyConstruction ? "있음" : "없음"}
                                {objectiveData.constructionEndDate &&
                                    ` · ${objectiveData.constructionEndDate} 종료 예정`}
                            </span>
                        </div>
                        {objectiveData.subwayDistance && (
                            <div className="info-row">
                                <span className="info-label flex items-center gap-1.5">
                                    <Train size={13} className="text-primary" /> 지하철
                                </span>
                                <span className="info-value">
                                    {objectiveData.subwayDistance}m
                                    {objectiveData.subwayLine && ` · ${objectiveData.subwayLine}`}
                                </span>
                            </div>
                        )}
                        <div className="info-row">
                            <span className="info-label flex items-center gap-1.5">
                                <Store size={13} className="text-accent-teal" /> 상가
                            </span>
                            <span className="info-value">
                                밀집도{" "}
                                {objectiveData.commercialDensity === "HIGH"
                                    ? "높음"
                                    : objectiveData.commercialDensity === "MEDIUM"
                                        ? "보통"
                                        : "낮음"}
                                {objectiveData.commercialCount &&
                                    ` · 반경 100m 내 ${objectiveData.commercialCount}개`}
                            </span>
                        </div>
                    </div>

                    {building.predictedNoiseScore && (
                        <div className="mt-5 rounded-xl bg-accent-purple/5 border border-accent-purple/10 p-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">🤖</span>
                                <span className="text-xs font-bold text-foreground">AI 소음 예측 점수</span>
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-accent-purple">
                                    {building.predictedNoiseScore.toFixed(1)}
                                </span>
                                <span className="text-xs text-muted">/ 5.0</span>
                            </div>
                            <p className="mt-1 text-[10px] text-muted">
                                도로, 공사, 지하철, 상가 데이터 기반 예측
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === "리뷰" && (
                <motion.div
                    key="reviews"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Filter chips */}
                    <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar border-b border-card-border">
                        {Object.values(NoiseType).map((type) => {
                            const count = reviews.filter((r) =>
                                r.noiseTypes.includes(type)
                            ).length;
                            if (count === 0) return null;
                            return (
                                <span
                                    key={type}
                                    className="shrink-0 noise-tag text-[10px]"
                                >
                                    {NOISE_TYPE_ICONS[type]} {NOISE_TYPE_LABELS[type]} {count}
                                </span>
                            );
                        })}
                    </div>

                    {/* Review list */}
                    <div className="px-4 py-3">
                        {reviews.map((review, i) => (
                            <div
                                key={review.id}
                                className={cn(
                                    "py-4",
                                    i < reviews.length - 1 && "border-b border-card-border"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f5] text-[10px] font-bold text-muted">
                                        {(review.nickname || "익명")[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-foreground">
                                                {review.nickname || "익명"}
                                            </span>
                                            {review.floor && (
                                                <span className="rounded bg-[#f5f5f5] px-1.5 py-0.5 text-[9px] text-muted">
                                                    {review.floor}층
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">
                                            {review.createdAt}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={11}
                                                className={
                                                    s <= review.noiseScore
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-[#e5e7eb]"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-sm leading-relaxed text-foreground">
                                    {review.description}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-1">
                                    {review.noiseTypes.map((type) => (
                                        <span key={type} className="noise-tag text-[9px]">
                                            {NOISE_TYPE_LABELS[type]}
                                        </span>
                                    ))}
                                    {review.timeOfDay.map((time) => (
                                        <span
                                            key={time}
                                            className="inline-flex items-center gap-0.5 rounded-md bg-[#f5f5f5] px-1.5 py-0.5 text-[9px] text-muted"
                                        >
                                            <Clock size={8} />
                                            {TIME_SLOT_LABELS[time]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ─── FAB ─── */}
            <Link href="/review" className="fab">
                + 리뷰 쓰기
            </Link>
        </div>
    );
}
