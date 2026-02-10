"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PatternAnalysisResult } from "@/lib/types";

interface ActionGuideProps {
  analysis: PatternAnalysisResult;
}

export default function ActionGuide({ analysis }: ActionGuideProps) {
  const { buyScenario, waitScenario } = analysis;

  return (
    <Card>
      <div className="text-center">
        <h3 className="text-lg font-bold text-zinc-900 mb-2">
          지금 사시겠습니까? 2주 후 타점을 예약하시겠습니까?
        </h3>
        <p className="text-sm text-zinc-500 mb-6">
          과거 유사 패턴 기준, 지금 매수 시 손실 확률 {buyScenario.lossRate}%
          &middot; {waitScenario.optimalEntryDays}일 후 진입 시 수익 확률{" "}
          {waitScenario.gainRate}%
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button variant="danger">그래도 산다</Button>
          <Link href="/shadow-record">
            <Button variant="primary">참겠습니다</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
