"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { MOCK_TICKERS, MOCK_USER } from "@/lib/mock-data";
import { formatKRW, formatPercent, cn } from "@/lib/utils";
import { StockTicker } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0
      ? MOCK_TICKERS.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.symbol.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectTicker(ticker: StockTicker) {
    setQuery("");
    setIsDropdownOpen(false);
    router.push(`/pattern?symbol=${ticker.symbol}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
      {/* HERO */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
          {APP_NAME}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-zinc-100">
          또 사고 싶어졌어?
        </h1>
        <p className="text-lg text-zinc-500 mt-2">이거 전에도 봤잖아.</p>
      </section>

      {/* SEARCH */}
      <section ref={searchRef} className="relative w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsDropdownOpen(true);
          }}
          placeholder="사고 싶은 종목 검색..."
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-800/50 px-5 py-4 text-base text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        {isDropdownOpen && filtered.length > 0 && (
          <ul className="absolute z-30 mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg shadow-black/40 overflow-hidden max-h-[50vh] overflow-y-auto">
            {filtered.map((ticker) => (
              <li
                key={ticker.symbol}
                onClick={() => handleSelectTicker(ticker)}
                className="flex items-center justify-between px-4 py-3 min-h-[48px] cursor-pointer transition-colors hover:bg-zinc-800 active:bg-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400 font-mono">
                    {ticker.symbol.slice(0, 2)}
                  </span>
                  <div>
                    <span className="font-medium text-zinc-100">
                      {ticker.name}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {ticker.symbol}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-zinc-300 tabular-nums">
                    {formatKRW(ticker.currentPrice)}
                  </span>
                  <span
                    className={cn(
                      "ml-2 text-xs font-semibold tabular-nums",
                      ticker.changePercent >= 0
                        ? "text-red-400"
                        : "text-blue-400"
                    )}
                  >
                    {formatPercent(ticker.changePercent)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {isDropdownOpen && query.trim().length > 0 && filtered.length === 0 && (
          <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-6 text-center text-sm text-zinc-500 shadow-lg shadow-black/40">
            종목을 찾을 수 없습니다
          </div>
        )}
      </section>

      {/* STREAK - minimal, only if streak > 0 */}
      {MOCK_USER.streak > 0 && (
        <p className="text-sm text-zinc-500">
          <span className="text-orange-400">🔥</span>{" "}
          <span className="text-zinc-300 font-semibold tabular-nums">{MOCK_USER.streak}일</span>{" "}
          연속 방어 중
        </p>
      )}
    </div>
  );
}
