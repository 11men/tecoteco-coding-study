"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SEARCH_SUGGESTIONS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    className?: string;
    size?: "default" | "large";
    placeholder?: string;
}

export function SearchBar({
    className,
    size = "default",
    placeholder = "주소를 검색하세요 (예: 강남구 역삼동)",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.length > 0) {
            const filtered = MOCK_SEARCH_SUGGESTIONS.filter((s) =>
                s.includes(query)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [query]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSelect = (address: string) => {
        setQuery(address);
        setFocused(false);
        router.push("/map");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push("/map");
        }
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full", className)}>
            <form onSubmit={handleSubmit}>
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-card shadow-sm transition-all",
                        focused
                            ? "border-primary shadow-lg shadow-primary/10"
                            : "border-card-border",
                        size === "large" ? "px-5 py-4" : "px-4 py-3"
                    )}
                >
                    <Search
                        size={size === "large" ? 22 : 18}
                        className="shrink-0 text-muted"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setFocused(true)}
                        placeholder={placeholder}
                        className={cn(
                            "w-full bg-transparent outline-none placeholder:text-muted-foreground",
                            size === "large" ? "text-lg" : "text-sm"
                        )}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="shrink-0 text-muted transition-colors hover:text-foreground"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            {/* Suggestions dropdown */}
            {focused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-card-border bg-card p-2 shadow-xl">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => handleSelect(s)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary-light hover:text-primary"
                        >
                            <Search size={14} className="shrink-0 text-muted" />
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {focused && query.length > 0 && suggestions.length === 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-card-border bg-card p-4 shadow-xl">
                    <p className="text-center text-sm text-muted">
                        검색 결과가 없습니다
                    </p>
                </div>
            )}
        </div>
    );
}
