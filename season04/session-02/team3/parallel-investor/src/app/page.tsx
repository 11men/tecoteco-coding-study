import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import BadgeUI from "@/components/ui/Badge";
import { APP_TAGLINE } from "@/lib/constants";
import { MOCK_USER, MOCK_SHADOW_RECORDS } from "@/lib/mock-data";
import { formatKRW } from "@/lib/utils";

export default function Home() {
  const user = MOCK_USER;
  const recentRecords = MOCK_SHADOW_RECORDS.slice(0, 3);
  const defenseSuccessCount = recentRecords.filter((r) => r.result?.isDefenseSuccess).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">
          안녕하세요, <span className="text-blue-600">{user.nickname}</span>님
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{APP_TAGLINE}</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <p className="text-xs text-zinc-500">누적 방어 금액</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">
            {formatKRW(user.totalDefendedAmount)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-500">참음 기록</p>
          <p className="mt-1 text-xl font-bold">{user.totalRecords}회</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-500">방어 성공률</p>
          <p className="mt-1 text-xl font-bold text-blue-600">{user.defenseSuccessRate}%</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-500">현재 레벨</p>
          <p className="mt-1 text-xl font-bold">
            Lv.{user.level.level} {user.level.title}
          </p>
        </Card>
      </section>

      {/* Level Progress */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">
              Lv.{user.level.level} {user.level.title}
            </p>
            <p className="text-xs text-zinc-500">{user.level.titleEn}</p>
          </div>
          <BadgeUI
            label={`${user.level.currentExp} / ${user.level.nextLevelExp} EXP`}
            variant="info"
          />
        </div>
        <ProgressBar
          value={user.level.currentExp}
          max={user.level.nextLevelExp}
          color="blue"
          showLabel
          className="mt-3"
        />
      </Card>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/pattern">
          <Card className="cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg dark:bg-blue-900">
                📊
              </span>
              <div>
                <p className="font-semibold">지금 사고 싶은 종목이 있나요?</p>
                <p className="text-sm text-zinc-500">
                  과거 패턴을 분석해 드릴게요
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/shadow-record">
          <Card className="cursor-pointer hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-900">
                🛡️
              </span>
              <div>
                <p className="font-semibold">FOMO를 느끼고 있나요?</p>
                <p className="text-sm text-zinc-500">
                  참음을 기록하고 결과를 확인하세요
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </section>

      {/* Recent Records */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">최근 참음 기록</h2>
          <Link
            href="/shadow-record"
            className="text-sm text-blue-600 hover:underline"
          >
            전체보기
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recentRecords.map((record) => (
            <Card key={record.id} variant={record.result?.isDefenseSuccess ? "success" : "default"}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {record.ticker.name} ({record.ticker.symbol})
                  </p>
                  <p className="text-sm text-zinc-500">
                    {formatKRW(record.intendedAmount)} 투자 예정
                  </p>
                </div>
                <div className="text-right">
                  {record.result ? (
                    <>
                      <p
                        className={
                          record.result.isDefenseSuccess
                            ? "font-bold text-emerald-600"
                            : "font-bold text-zinc-400"
                        }
                      >
                        {record.result.isDefenseSuccess
                          ? `${formatKRW(record.result.defendedAmount)} 방어!`
                          : "상승했어요"}
                      </p>
                      <BadgeUI
                        label={record.result.isDefenseSuccess ? "방어 성공" : "학습 비용"}
                        variant={record.result.isDefenseSuccess ? "success" : "warning"}
                      />
                    </>
                  ) : (
                    <BadgeUI label="결과 대기중" variant="default" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Defense Summary */}
      <Card variant="highlight">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          최근 기록 중 <span className="font-bold text-blue-600">{defenseSuccessCount}건</span> 방어 성공!
          참는 것이 곧 수익입니다.
        </p>
      </Card>
    </div>
  );
}
