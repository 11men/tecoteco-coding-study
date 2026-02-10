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
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold">참음의 기록</h1>
        <p className="mt-1 text-sm text-zinc-500">
          FOMO를 느꼈지만 참은 종목을 기록하고, 결과를 확인하세요.
        </p>
      </section>

      <FomoRecordForm onSubmit={handleSubmit} />

      <ShadowRecordList records={records} />
    </div>
  );
}
