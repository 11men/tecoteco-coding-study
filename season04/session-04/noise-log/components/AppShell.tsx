"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, PenSquare, MessageCircle, Home, Volume2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
    { href: "/", label: "홈", icon: Home },
    { href: "/map", label: "지도", icon: Map },
    { href: "/review", label: "리뷰", icon: PenSquare },
    { href: "/community", label: "커뮤니티", icon: MessageCircle },
    { href: "/mypage", label: "MY", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-background/95 backdrop-blur-xl safe-area-bottom">
            <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
                {TABS.map((tab) => {
                    const isActive =
                        tab.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <tab.icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 1.8}
                            />
                            <span>{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export function AppHeader({ title, showLogo }: { title?: string; showLogo?: boolean }) {
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center border-b border-card-border bg-background/95 backdrop-blur-xl px-4">
            {showLogo ? (
                <Link href="/" className="flex items-center gap-2 text-base font-bold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                        <Volume2 size={15} />
                    </div>
                    <span>소음지도</span>
                </Link>
            ) : (
                <h1 className="text-base font-bold text-foreground">{title}</h1>
            )}
        </header>
    );
}
