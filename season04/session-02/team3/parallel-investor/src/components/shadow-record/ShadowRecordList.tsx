"use client";

import Card from "@/components/ui/Card";
import BadgeUI from "@/components/ui/Badge";
import { ShadowRecord } from "@/lib/types";
import { FOMO_INTENSITY_LABELS } from "@/lib/constants";
import { formatKRW, formatPercent, getRelativeTime } from "@/lib/utils";

interface ShadowRecordListProps {
  records: ShadowRecord[];
}

export default function ShadowRecordList({ records }: ShadowRecordListProps) {
  if (records.length === 0) {
    return (
      <Card>
        <p className="text-center text-zinc-500 py-12">
          아직 기록 없음. 첫 D&eacute;j&agrave; Buy를 기록해봐.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-zinc-100">기록 목록</h2>
      {records.map((record) => (
        <ShadowRecordItem key={record.id} record={record} />
      ))}
    </div>
  );
}

function ShadowRecordItem({ record }: { record: ShadowRecord }) {
  const hasResult = !!record.result;
  const isDefenseSuccess = record.result?.isDefenseSuccess ?? false;

  return (
    <Card
      variant={
        hasResult
          ? isDefenseSuccess
            ? "success"
            : "default"
          : "default"
      }
    >
      <div className="flex flex-col gap-3">
        {/* 상단: 종목명 + 뱃지 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-zinc-100">{record.ticker.name}</span>
            <span className="text-sm text-zinc-400">{record.ticker.symbol}</span>
          </div>
          {hasResult ? (
            isDefenseSuccess ? (
              <BadgeUI label="Déjà Buy 차단" variant="success" />
            ) : (
              <BadgeUI label="올랐네..." variant="default" />
            )
          ) : (
            <BadgeUI label="결과 대기중" variant="warning" />
          )}
        </div>

        {/* 중단: 금액 + FOMO 강도 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">넣으려던 금액</p>
            <p className="text-xl font-bold text-zinc-100">{formatKRW(record.intendedAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">사고 싶던 강도</p>
            <p className="text-base font-semibold text-zinc-100">
              {record.fomoIntensity}/5{" "}
              <span className="text-sm font-normal text-zinc-400">
                {FOMO_INTENSITY_LABELS[record.fomoIntensity]}
              </span>
            </p>
          </div>
        </div>

        {/* 결과가 있을 때 변동률 표시 */}
        {hasResult && record.result && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <div>
              <p className="text-sm text-zinc-400">결과</p>
              <p
                className={
                  record.result.changePercent < 0
                    ? "text-emerald-400 font-bold"
                    : "text-zinc-400 font-bold"
                }
              >
                {formatPercent(record.result.changePercent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">세이브한 금액</p>
              <p
                className={
                  record.result.defendedAmount > 0
                    ? "text-emerald-400 font-bold"
                    : "text-zinc-400 font-bold"
                }
              >
                {record.result.defendedAmount > 0 ? "+" : ""}
                {formatKRW(Math.abs(record.result.defendedAmount))}
              </p>
            </div>
          </div>
        )}

        {/* 하단: 메모 + 경과시간 */}
        <div className="flex items-end justify-between pt-1">
          {record.memo && (
            <p className="text-sm text-zinc-400 italic truncate max-w-[70%]">
              &ldquo;{record.memo}&rdquo;
            </p>
          )}
          <p className="text-xs text-zinc-500 shrink-0">
            {getRelativeTime(record.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
