"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Star, MapPin, MessageSquare, X, ChevronUp, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_BUILDINGS, MOCK_REVIEWS } from "@/lib/mock-data";
import { NOISE_TYPE_LABELS, NoiseType } from "@/lib/types";
import type { Building } from "@/lib/types";
import "leaflet/dist/leaflet.css";

function getScoreColor(score: number): string {
    if (score <= 2) return "#22c55e";
    if (score <= 3.5) return "#eab308";
    return "#ef4444";
}

function getScoreLabel(score: number) {
    if (score <= 2) return "조용";
    if (score <= 3.5) return "보통";
    return "시끄러움";
}

function getScoreBadgeClass(score: number) {
    if (score <= 2) return "bg-noise-quiet/15 text-noise-quiet";
    if (score <= 3.5) return "bg-noise-moderate/15 text-noise-moderate";
    return "bg-noise-loud/15 text-noise-loud";
}

function getTopNoiseTypes(buildingId: string): NoiseType[] {
    const reviews = MOCK_REVIEWS.filter((r) => r.buildingId === buildingId);
    const counts: Record<string, number> = {};
    reviews.forEach((r) =>
        r.noiseTypes.forEach((t) => (counts[t] = (counts[t] || 0) + 1))
    );
    return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([k]) => k as NoiseType);
}

function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15, { duration: 0.8 });
    }, [map, center]);
    return null;
}

export default function MapContent() {
    const [selected, setSelected] = useState<Building | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [center, setCenter] = useState<[number, number]>([37.5326, 126.9906]);

    const handleMarkerClick = (building: Building) => {
        setSelected(building);
        setSheetOpen(true);
        setCenter([building.lat, building.lng]);
    };

    return (
        <div className="relative h-[calc(100dvh-64px)] w-full overflow-hidden">
            {/* Map */}
            <MapContainer
                center={center}
                zoom={12}
                className="h-full w-full z-0"
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {selected && <RecenterMap center={[selected.lat, selected.lng]} />}

                {MOCK_BUILDINGS.map((building) => (
                    <CircleMarker
                        key={building.id}
                        center={[building.lat, building.lng]}
                        radius={selected?.id === building.id ? 14 : 10}
                        pathOptions={{
                            fillColor: getScoreColor(building.avgNoiseScore),
                            fillOpacity: 0.9,
                            color: "#fff",
                            weight: selected?.id === building.id ? 3 : 2,
                        }}
                        eventHandlers={{
                            click: () => handleMarkerClick(building),
                        }}
                    >
                        <Popup className="noise-popup">
                            <div className="p-3">
                                <p className="text-xs font-bold text-gray-900">
                                    {building.buildingName || building.address}
                                </p>
                                <div className="mt-1 flex items-center gap-1">
                                    <Star size={10} className="text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-semibold" style={{ color: getScoreColor(building.avgNoiseScore) }}>
                                        {building.avgNoiseScore.toFixed(1)}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                        · 리뷰 {building.reviewCount}개
                                    </span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute left-3 top-3 z-[500] flex gap-2 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 border border-card-border shadow-sm">
                <span className="flex items-center gap-1 text-[10px]">
                    <span className="h-2 w-2 rounded-full bg-noise-quiet" />
                    조용
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                    <span className="h-2 w-2 rounded-full bg-noise-moderate" />
                    보통
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                    <span className="h-2 w-2 rounded-full bg-noise-loud" />
                    시끄러움
                </span>
            </div>

            {/* My location button */}
            <button
                type="button"
                onClick={() => setCenter([37.5326, 126.9906])}
                className="absolute right-3 top-3 z-[500] flex h-10 w-10 items-center justify-center rounded-full bg-background border border-card-border shadow-lg"
            >
                <Navigation size={18} className="text-primary" />
            </button>

            {/* Bottom sheet */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 z-[500] rounded-t-2xl border-t border-card-border bg-background shadow-2xl bottom-sheet",
                    sheetOpen && selected
                        ? "translate-y-0"
                        : "translate-y-full"
                )}
                style={{ maxHeight: "55dvh" }}
            >
                {selected && (
                    <>
                        {/* Handle */}
                        <div className="flex items-center justify-center py-2">
                            <div className="h-1 w-10 rounded-full bg-card-border" />
                        </div>

                        {/* Header */}
                        <div className="flex items-start justify-between px-5 pb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-foreground truncate">
                                        {selected.buildingName || selected.address}
                                    </h3>
                                    <span className={cn("noise-badge shrink-0", getScoreBadgeClass(selected.avgNoiseScore))}>
                                        <Star size={10} />
                                        {selected.avgNoiseScore.toFixed(1)}
                                    </span>
                                </div>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted truncate">
                                    <MapPin size={10} />
                                    {selected.address}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setSheetOpen(false); setSelected(null); }}
                                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card-border text-muted"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto no-scrollbar">
                            {getTopNoiseTypes(selected.id).map((type) => (
                                <span key={type} className="noise-tag text-[10px] whitespace-nowrap">
                                    {NOISE_TYPE_LABELS[type]}
                                </span>
                            ))}
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                <MessageSquare size={10} />
                                리뷰 {selected.reviewCount}개
                            </span>
                        </div>

                        {/* Score summary */}
                        <div className="mx-5 mb-4 flex items-center gap-3 rounded-xl bg-card border border-card-border p-3">
                            <div className="text-center">
                                <span className="text-2xl font-extrabold" style={{ color: getScoreColor(selected.avgNoiseScore) }}>
                                    {selected.avgNoiseScore.toFixed(1)}
                                </span>
                                <p className="text-[10px] text-muted">/ 5.0</p>
                            </div>
                            <div className="h-8 w-px bg-card-border" />
                            <div className="flex-1 text-xs text-muted">
                                <p>소음 수준: <strong className="text-foreground">{getScoreLabel(selected.avgNoiseScore)}</strong></p>
                                {selected.predictedNoiseScore && (
                                    <p className="mt-0.5">🤖 AI 예측: {selected.predictedNoiseScore.toFixed(1)}</p>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5">
                            <Link
                                href={`/building/${selected.id}`}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98]"
                            >
                                상세 정보 보기
                                <ChevronUp size={16} className="rotate-90" />
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Building list pills */}
            {!sheetOpen && (
                <div className="absolute bottom-4 left-0 right-0 z-[400] flex gap-2 overflow-x-auto px-3 no-scrollbar">
                    {MOCK_BUILDINGS.map((b) => (
                        <button
                            key={b.id}
                            type="button"
                            onClick={() => handleMarkerClick(b)}
                            className="flex shrink-0 items-center gap-2 rounded-full border border-card-border bg-background/95 backdrop-blur-sm px-4 py-2 shadow-lg transition-all active:scale-95"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: getScoreColor(b.avgNoiseScore) }}
                            />
                            <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                                {b.buildingName}
                            </span>
                            <span className="text-[10px] text-muted">{b.avgNoiseScore.toFixed(1)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
