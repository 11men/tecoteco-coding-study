"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { MOCK_TICKERS } from "@/lib/mock-data";
import { StockTicker } from "@/lib/types";
import { formatKRW, formatPercent, cn } from "@/lib/utils";

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = query.length > 0
    ? MOCK_TICKERS.filter(
        (t) =>
          t.name.includes(query) ||
          t.symbol.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_TICKERS;

  return (
    <div className="flex min-h-[80vh] flex-col gap-6 px-4 pt-4 sm:gap-8 sm:px-0">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          또 사고 싶어졌어?
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          이거 전에도 본 적 있는데.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="뭐가 사고 싶어? 종목 검색..."
          className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-base outline-none transition-all placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      {/* Ticker List */}
      <div className="flex flex-col gap-2">
        {filtered.map((ticker) => (
          <TickerRow key={ticker.symbol} ticker={ticker} />
        ))}
      </div>

      {/* Bottom Links */}
      <div className="sticky bottom-4 mt-auto flex gap-3 pb-4">
        <Link href="/shadow-record" className="flex-1">
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-center text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200">
            참음 기록
          </div>
        </Link>
        <Link href="/level" className="flex-1">
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-center text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200">
            내 레벨
          </div>
        </Link>
      </div>
    </div>
  );
}

function TickerRow({ ticker }: { ticker: StockTicker }) {
  const isUp = ticker.changePercent >= 0;

  return (
    <Link href={`/pattern?symbol=${ticker.symbol}`}>
      <div className="flex min-h-[56px] items-center justify-between rounded-2xl border border-zinc-100 bg-white px-5 py-4 transition-all active:scale-[0.98] hover:border-zinc-200 hover:shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600">
            {ticker.symbol.slice(0, 2)}
          </span>
          <div>
            <p className="font-semibold">{ticker.name}</p>
            <p className="text-xs text-zinc-400">{ticker.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums">{formatKRW(ticker.currentPrice)}</p>
          <p
            className={cn(
              "text-xs font-medium tabular-nums",
              isUp ? "text-red-500" : "text-blue-500"
            )}
          >
            {formatPercent(ticker.changePercent)}
          </p>
        </div>
      </div>
    </Link>
  );
}
