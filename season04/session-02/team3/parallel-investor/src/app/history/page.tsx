"use client";

import { useState } from "react";
import { MOCK_SHADOW_RECORDS, MOCK_USER } from "@/lib/mock-data";
import { calculateJomo, formatKRW } from "@/lib/utils";
import { ShadowRecord } from "@/lib/types";
import JomoSummary from "@/components/jomo/JomoSummary";
import JomoConversionGrid from "@/components/jomo/JomoConversionGrid";
import PersonaStats from "@/components/persona/PersonaStats";
import PremiumBadge from "@/components/premium/PremiumBadge";
import FomoRecordForm from "@/components/shadow-record/FomoRecordForm";
import ShadowRecordList from "@/components/shadow-record/ShadowRecordList";

export default function HistoryPage() {
  const [records, setRecords] = useState<ShadowRecord[]>(MOCK_SHADOW_RECORDS);
  const [showForm, setShowForm] = useState(false);

  const { totalDefendedAmount, totalRecords, defenseSuccessRate } = MOCK_USER;
  const jomo = calculateJomo(totalDefendedAmount);
  const defenseSuccessCount = Math.round(
    (MOCK_USER.totalRecords * MOCK_USER.defenseSuccessRate) / 100
  );

  const handleSubmit = (newRecord: ShadowRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-0 pb-8">
      {/* 1. Header */}
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">기록</h1>
        <p className="mt-1 text-sm text-zinc-400">
          참은 기록과 세이브한 금액, 전부 여기.
        </p>
      </section>

      {/* 2. Defense Stats Row */}
      <section className="flex gap-3">
        <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
          <p className="text-xl font-bold text-zinc-100 tabular-nums">
            {defenseSuccessCount}회
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">방어 성공</p>
        </div>
        <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
          <p className="text-xl font-bold text-zinc-100 tabular-nums">
            {formatKRW(totalDefendedAmount)}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">세이브</p>
        </div>
        <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
          <p className="text-xl font-bold text-zinc-100 tabular-nums">
            {defenseSuccessRate}%
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">방어율</p>
        </div>
      </section>

      {/* 3. JOMO Summary + Conversion Grid */}
      <section className="flex flex-col gap-4">
        <JomoSummary
          totalDefendedAmount={totalDefendedAmount}
          totalRecords={totalRecords}
          defenseSuccessRate={defenseSuccessRate}
        />
        <JomoConversionGrid items={jomo.items} />
      </section>

      {/* 4. 투자 패턴 (Persona Stats) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-mono">
            투자 패턴
          </p>
          {!MOCK_USER.isPremium && <PremiumBadge size="sm" />}
        </div>
        <PersonaStats
          stats={MOCK_USER.personaStats}
          isPremium={MOCK_USER.isPremium}
        />
      </section>

      {/* 5. Divider */}
      <div className="border-t border-zinc-800" />

      {/* 6. 참음 기록 + Form + List */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-mono">
            참음 기록
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
          >
            {showForm ? "닫기" : "새 기록"}
          </button>
        </div>

        {showForm && <FomoRecordForm onSubmit={handleSubmit} />}

        <ShadowRecordList records={records} />
      </section>
    </div>
  );
}
