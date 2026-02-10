// ============================================
// Feature B: Shadow Record (참음의 기록)
// Owner: Team 2
// ============================================
// 이 페이지와 src/components/shadow-record/ 디렉토리는 Team 2가 담당합니다.
// 다른 팀은 이 파일을 수정하지 마세요.

"use client";

import { useState } from "react";
import { MOCK_SHADOW_RECORDS } from "@/lib/mock-data";
import { ShadowRecord } from "@/lib/types";
import FomoRecordForm from "@/components/shadow-record/FomoRecordForm";
import ShadowRecordList from "@/components/shadow-record/ShadowRecordList";

export default function ShadowRecordPage() {
  const [records, setRecords] = useState<ShadowRecord[]>(MOCK_SHADOW_RECORDS);

  const handleSubmit = (newRecord: ShadowRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl text-zinc-100">참음 기록</h1>
        <p className="mt-1 text-sm text-zinc-400">
          사고 싶었는데 참은 거, 여기 적어.
        </p>
      </section>

      <FomoRecordForm onSubmit={handleSubmit} />

      <ShadowRecordList records={records} />
    </div>
  );
}
