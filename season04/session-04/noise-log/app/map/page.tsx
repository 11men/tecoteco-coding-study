"use client";

import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";

const MapContent = dynamic(() => import("@/components/map/MapContent"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[calc(100dvh-64px)] items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Navigation size={32} className="text-primary animate-pulse" />
                <p className="text-sm text-muted">지도를 불러오는 중...</p>
            </div>
        </div>
    ),
});

export default function MapPage() {
    return <MapContent />;
}
