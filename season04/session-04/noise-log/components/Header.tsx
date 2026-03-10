"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Volume2 } from "lucide-react";

const NAV_ITEMS = [
    { href: "/map", label: "소음 지도" },
    { href: "/review", label: "리뷰 작성" },
    { href: "/community", label: "커뮤니티" },
];

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold text-foreground transition-colors hover:text-primary"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <Volume2 size={18} />
                    </div>
                    <span>소음지도</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-primary-light hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card hover:text-foreground md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="메뉴"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={cn(
                    "overflow-hidden border-t border-card-border transition-all duration-300 md:hidden",
                    mobileOpen ? "max-h-60" : "max-h-0 border-t-0"
                )}
            >
                <nav className="flex flex-col gap-1 px-4 py-3">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary-light hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
