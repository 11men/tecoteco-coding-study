"use client";

import { Lock, Crown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProLockProps {
    children: React.ReactNode;
    label?: string;
    className?: string;
}

export function ProLock({ children, label = "Pro 전용 기능", className }: ProLockProps) {
    const [showToast, setShowToast] = useState(false);

    const handleClick = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className={cn("relative", className)}>
            <div className="pointer-events-none select-none opacity-40">
                {children}
            </div>
            <button
                type="button"
                onClick={handleClick}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-foreground/5 backdrop-blur-[1px] cursor-pointer"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
                    <Lock size={18} className="text-foreground/60" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-accent-purple/10 px-2.5 py-1 text-[10px] font-bold text-accent-purple">
                    <Crown size={10} />
                    {label}
                </span>
            </button>

            {showToast && (
                <div className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 animate-bounce">
                    <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-lg">
                        <Crown size={14} className="text-amber-400" />
                        Pro 구독으로 모든 기능을 이용하세요
                    </div>
                </div>
            )}
        </div>
    );
}
