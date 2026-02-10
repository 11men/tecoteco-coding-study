"use client";

import { useState, useRef, useEffect } from "react";
import Input from "@/components/ui/Input";
import { MOCK_TICKERS } from "@/lib/mock-data";
import { StockTicker } from "@/lib/types";
import { formatKRW, formatPercent, cn } from "@/lib/utils";

interface TickerSearchProps {
  onSelect: (ticker: StockTicker) => void;
  selectedTicker: StockTicker | null;
}

export default function TickerSearch({ onSelect, selectedTicker }: TickerSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? MOCK_TICKERS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.symbol.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_TICKERS;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(ticker: StockTicker) {
    onSelect(ticker);
    setQuery(ticker.name);
    setIsOpen(false);
  }

  function handleClear() {
    setQuery("");
    onSelect(null as unknown as StockTicker);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          placeholder="종목명 또는 심볼을 검색하세요"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-sm"
          >
            초기화
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1.5 w-full rounded-xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
          {filtered.map((ticker) => (
            <li
              key={ticker.symbol}
              onClick={() => handleSelect(ticker)}
              className={cn(
                "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors",
                "hover:bg-zinc-50",
                selectedTicker?.symbol === ticker.symbol && "bg-teal-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 w-16">{ticker.symbol}</span>
                <span className="font-medium text-zinc-900">{ticker.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-700">
                  {formatKRW(ticker.currentPrice)}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    ticker.changePercent >= 0 ? "text-emerald-600" : "text-red-500"
                  )}
                >
                  {formatPercent(ticker.changePercent)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-400 shadow-lg">
          검색 결과가 없습니다
        </div>
      )}

      {selectedTicker && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-5 py-4">
          <div>
            <p className="text-xs text-teal-600 font-medium mb-0.5">선택한 종목</p>
            <p className="text-lg font-bold text-zinc-900">
              {selectedTicker.name}
              <span className="ml-2 text-sm font-normal text-zinc-400">{selectedTicker.symbol}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-zinc-900">
              {formatKRW(selectedTicker.currentPrice)}
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                selectedTicker.changePercent >= 0 ? "text-emerald-600" : "text-red-500"
              )}
            >
              {formatPercent(selectedTicker.changePercent)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
