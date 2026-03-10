"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, ChevronRight, ArrowLeft, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import {
    NoiseType,
    TimeSlot,
    NOISE_TYPE_LABELS,
    NOISE_TYPE_ICONS,
    TIME_SLOT_LABELS,
} from "@/lib/types";

export default function ReviewPage() {
    const [score, setScore] = useState(0);
    const [hoverScore, setHoverScore] = useState(0);
    const [floor, setFloor] = useState("");
    const [noiseTypes, setNoiseTypes] = useState<NoiseType[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleNoiseType = (type: NoiseType) => {
        setNoiseTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const toggleTimeSlot = (slot: TimeSlot) => {
        setTimeSlots((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const isValid = score > 0 && description.trim().length >= 10;

    if (submitted) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-noise-quiet/15">
                        <Check size={40} className="text-noise-quiet" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">
                        리뷰가 등록되었습니다!
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        소음 정보를 공유해주셔서 감사합니다 🙏
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSubmitted(false);
                            setScore(0);
                            setFloor("");
                            setNoiseTypes([]);
                            setTimeSlots([]);
                            setDescription("");
                        }}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all active:scale-95"
                    >
                        새 리뷰 작성
                        <ChevronRight size={16} />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-card-border bg-background px-4">
                <Link href="/" className="flex h-8 w-8 items-center justify-center text-foreground">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-sm font-bold text-foreground">리뷰 작성</h1>
            </header>

            <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6">
                {/* Address */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-foreground">
                        📍 건물 주소
                    </label>
                    <SearchBar placeholder="주소를 검색하세요" />
                </div>

                {/* Floor */}
                <div>
                    <label htmlFor="floor" className="mb-2 block text-sm font-bold text-foreground">
                        🏢 층수 (선택)
                    </label>
                    <input
                        id="floor"
                        type="number"
                        min={-5}
                        max={100}
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder="예: 8"
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
                    />
                </div>

                {/* Score */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-foreground">
                        ⭐ 소음 점수 <span className="text-noise-loud">*</span>
                    </label>
                    <p className="mb-3 text-[11px] text-muted">
                        1점 = 매우 조용, 5점 = 매우 시끄러움
                    </p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setScore(s)}
                                onMouseEnter={() => setHoverScore(s)}
                                onMouseLeave={() => setHoverScore(0)}
                                className="transition-transform active:scale-90"
                            >
                                <Star
                                    size={32}
                                    className={
                                        s <= (hoverScore || score)
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-[#e5e7eb]"
                                    }
                                />
                            </button>
                        ))}
                        {score > 0 && (
                            <span className={cn("ml-2 text-xs font-bold",
                                score <= 2 ? "text-noise-quiet" : score <= 3 ? "text-noise-moderate" : "text-noise-loud"
                            )}>
                                {score <= 1 ? "매우 조용" : score <= 2 ? "조용한 편" : score <= 3 ? "보통" : score <= 4 ? "시끄러운 편" : "매우 시끄러움"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Noise types */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-foreground">
                        🏷️ 소음 유형
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(NoiseType).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => toggleNoiseType(type)}
                                className={cn(
                                    "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                                    noiseTypes.includes(type)
                                        ? "border-primary bg-primary text-white"
                                        : "border-card-border bg-background text-muted"
                                )}
                            >
                                {NOISE_TYPE_ICONS[type]} {NOISE_TYPE_LABELS[type]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time slots */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-foreground">
                        🕐 소음 시간대
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(TimeSlot).map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => toggleTimeSlot(slot)}
                                className={cn(
                                    "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                                    timeSlots.includes(slot)
                                        ? "border-primary bg-primary text-white"
                                        : "border-card-border bg-background text-muted"
                                )}
                            >
                                {TIME_SLOT_LABELS[slot]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-bold text-foreground">
                        📝 상세 설명 <span className="text-noise-loud">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="소음 상황을 자세히 설명해주세요 (최소 10자)"
                        rows={4}
                        className="w-full resize-none rounded-xl border border-card-border bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary placeholder:text-muted-foreground"
                    />
                    <p className="mt-1 text-right text-[10px] text-muted">{description.length}자</p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!isValid}
                    className={cn(
                        "w-full rounded-xl py-3.5 text-sm font-bold transition-all",
                        isValid
                            ? "bg-primary text-white active:scale-[0.98]"
                            : "bg-[#f0f0f0] text-muted-foreground cursor-not-allowed"
                    )}
                >
                    리뷰 등록하기
                </button>
                {!isValid && (
                    <p className="text-center text-[10px] text-muted">
                        소음 점수와 상세 설명(10자 이상)을 입력해주세요
                    </p>
                )}
            </form>
        </div>
    );
}
