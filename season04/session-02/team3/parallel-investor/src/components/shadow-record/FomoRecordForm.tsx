"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MOCK_TICKERS } from "@/lib/mock-data";
import { FomoIntensity, ShadowRecord, StockTicker } from "@/lib/types";
import { FOMO_INTENSITY_LABELS } from "@/lib/constants";
import { cn, formatKRW } from "@/lib/utils";

interface FomoRecordFormProps {
  onSubmit: (record: ShadowRecord) => void;
}

export default function FomoRecordForm({ onSubmit }: FomoRecordFormProps) {
  const [selectedTicker, setSelectedTicker] = useState<StockTicker | null>(null);
  const [amount, setAmount] = useState("");
  const [fomoIntensity, setFomoIntensity] = useState<FomoIntensity | null>(null);
  const [memo, setMemo] = useState("");

  const isValid = selectedTicker && amount && Number(amount) > 0 && fomoIntensity;

  const handleSubmit = () => {
    if (!isValid || !selectedTicker || !fomoIntensity) return;

    const record: ShadowRecord = {
      id: `sr-${Date.now()}`,
      ticker: selectedTicker,
      priceAtRecord: selectedTicker.currentPrice,
      intendedAmount: Number(amount),
      fomoIntensity,
      memo,
      createdAt: new Date().toISOString(),
    };

    onSubmit(record);
    setSelectedTicker(null);
    setAmount("");
    setFomoIntensity(null);
    setMemo("");
  };

  return (
    <Card>
      <h2 className="text-lg font-bold mb-5 text-zinc-100">기록하기</h2>

      <div className="flex flex-col gap-5">
        {/* 종목 선택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            뭘 사고 싶었어?
          </label>
          <select
            value={selectedTicker?.symbol ?? ""}
            onChange={(e) => {
              const ticker = MOCK_TICKERS.find((t) => t.symbol === e.target.value);
              setSelectedTicker(ticker ?? null);
            }}
            className={cn(
              "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-base text-zinc-100 outline-none transition-colors",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              ""
            )}
          >
            <option value="">종목 선택</option>
            {MOCK_TICKERS.map((ticker) => (
              <option key={ticker.symbol} value={ticker.symbol}>
                {ticker.name} ({ticker.symbol}) - {formatKRW(ticker.currentPrice)}
              </option>
            ))}
          </select>
        </div>

        {/* 투자 예정 금액 */}
        <Input
          label="얼마나 넣으려고 했어?"
          type="number"
          placeholder="금액 (원)"
          className="w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* FOMO 강도 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">
            얼마나 사고 싶어?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as FomoIntensity[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFomoIntensity(level)}
                className={cn(
                  "rounded-xl py-3 text-sm font-semibold transition-all min-h-[44px]",
                  fomoIntensity === level
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 active:bg-zinc-600"
                )}
              >
                {level}
              </button>
            ))}
          </div>
          {fomoIntensity && (
            <p className="text-sm text-blue-400 font-medium">
              {FOMO_INTENSITY_LABELS[fomoIntensity]}
            </p>
          )}
        </div>

        {/* 메모 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            왜 사고 싶었어?
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="친구가 그러는데... / 뉴스에서 봤는데..."
            rows={3}
            className={cn(
              "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-base text-zinc-100 outline-none transition-colors resize-none",
              "placeholder:text-zinc-500",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              ""
            )}
          />
        </div>

        {/* 제출 버튼 */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full mt-2 py-4 text-base font-bold"
        >
          이번엔 안 산다
        </Button>
      </div>
    </Card>
  );
}
