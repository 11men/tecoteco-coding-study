import { MOCK_USER, MOCK_BADGES } from "@/lib/mock-data";
import LevelProfileCard from "@/components/level/LevelProfileCard";
import BadgeCollection from "@/components/level/BadgeCollection";

export default function LevelPage() {
  return (
    <div className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-0">
      <section>
        <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">내 레벨</h1>
        <p className="mt-1 text-sm text-zinc-400">안 사면 안 살수록 레벨업.</p>
      </section>

      <section>
        <LevelProfileCard level={MOCK_USER.level} nickname={MOCK_USER.nickname} />
      </section>

      <section>
        <BadgeCollection badges={MOCK_BADGES} />
      </section>
    </div>
  );
}
