import Card from "@/components/ui/Card";
import { ShadowRecord } from "@/lib/types";
import { formatKRW, formatPercent } from "@/lib/utils";

interface ResultFeedbackProps {
  record: ShadowRecord;
}

export default function ResultFeedback({ record }: ResultFeedbackProps) {
  if (!record.result) return null;

  const { isDefenseSuccess, changePercent, defendedAmount } = record.result;

  if (isDefenseSuccess) {
    return (
      <Card variant="success">
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <span className="text-2xl">{"\u{1F6E1}\uFE0F"}</span>
          <p className="text-base font-bold text-emerald-700">
            안 사길 잘했다!
          </p>
          <p className="text-sm text-emerald-600">
            가격이 {formatPercent(changePercent)} 변동했어요
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            +{formatKRW(Math.abs(defendedAmount))}
          </p>
          <p className="text-xs text-emerald-500">방어 성공 금액</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <span className="text-2xl">{"\u{1F4AA}"}</span>
        <p className="text-base font-bold text-zinc-700">
          괜찮아요, 다음에는 더 잘 참을 수 있어요
        </p>
        <p className="text-sm text-zinc-500">
          가격이 {formatPercent(changePercent)} 변동했어요
        </p>
        <p className="text-2xl font-bold text-zinc-500">
          {formatPercent(changePercent)}
        </p>
        <p className="text-xs text-zinc-400">변동률</p>
      </div>
    </Card>
  );
}
