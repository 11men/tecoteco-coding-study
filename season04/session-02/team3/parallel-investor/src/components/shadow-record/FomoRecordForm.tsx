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
      <h2 className="text-lg font-bold mb-5">FOMO 기록하기</h2>

      <div className="flex flex-col gap-5">
        {/* 종목 선택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">
            종목 선택
          </label>
          <select
            value={selectedTicker?.symbol ?? ""}
            onChange={(e) => {
              const ticker = MOCK_TICKERS.find((t) => t.symbol === e.target.value);
              setSelectedTicker(ticker ?? null);
            }}
            className={cn(
              "rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-base outline-none transition-colors",
              "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
              ""
            )}
          >
            <option value="">종목을 선택하세요</option>
            {MOCK_TICKERS.map((ticker) => (
              <option key={ticker.symbol} value={ticker.symbol}>
                {ticker.name} ({ticker.symbol}) - {formatKRW(ticker.currentPrice)}
              </option>
            ))}
          </select>
        </div>

        {/* 투자 예정 금액 */}
        <Input
          label="투자 예정 금액"
          type="number"
          placeholder="금액을 입력하세요 (원)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* FOMO 강도 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700">
            FOMO 강도
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as FomoIntensity[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFomoIntensity(level)}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
                  fomoIntensity === level
                    ? "bg-teal-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                )}
              >
                {level}
              </button>
            ))}
          </div>
          {fomoIntensity && (
            <p className="text-sm text-teal-500 font-medium">
              {FOMO_INTENSITY_LABELS[fomoIntensity]}
            </p>
          )}
        </div>

        {/* 메모 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700">
            메모
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="왜 사고 싶었는지 적어보세요..."
            rows={3}
            className={cn(
              "rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-base outline-none transition-colors resize-none",
              "placeholder:text-zinc-400",
              "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
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
          className="w-full"
        >
          참겠습니다
        </Button>
      </div>
    </Card>
  );
}
