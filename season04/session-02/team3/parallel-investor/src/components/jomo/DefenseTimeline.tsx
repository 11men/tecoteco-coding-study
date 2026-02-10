import BadgeUI from "@/components/ui/Badge";
import { ShadowRecord } from "@/lib/types";
import { cn, formatKRW, getRelativeTime } from "@/lib/utils";

interface DefenseTimelineProps {
  records: ShadowRecord[];
}

export default function DefenseTimeline({ records }: DefenseTimelineProps) {
  const sorted = [...records]
    .filter((r) => r.result)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (sorted.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">방어 히스토리</h2>
      <div className="relative">
        {sorted.map((record, index) => {
          const isLast = index === sorted.length - 1;
          const isSuccess = record.result?.isDefenseSuccess ?? false;

          return (
            <div key={record.id} className="relative flex gap-4 pb-6">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-zinc-200" />
              )}

              {/* Timeline dot */}
              <div
                className={cn(
                  "relative z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2",
                  isSuccess
                    ? "border-emerald-500 bg-emerald-100"
                    : "border-zinc-400 bg-zinc-100"
                )}
              />

              {/* Content */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {record.ticker.name}
                  </span>
                  {isSuccess ? (
                    <BadgeUI label="방어 성공" variant="success" />
                  ) : (
                    <BadgeUI label="상승" variant="default" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  {isSuccess && record.result ? (
                    <span className="font-bold text-emerald-600">
                      +{formatKRW(Math.abs(record.result.defendedAmount))}
                    </span>
                  ) : (
                    <span className="font-bold text-zinc-500">
                      {formatKRW(record.intendedAmount)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400">
                  {getRelativeTime(record.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
