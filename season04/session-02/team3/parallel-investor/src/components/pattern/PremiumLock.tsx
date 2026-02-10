"use client";

import { useState } from "react";
import BadgeUI from "@/components/ui/Badge";
import { MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PremiumLockProps {
  children: React.ReactNode;
  title?: string;
}

export default function PremiumLock({ children, title }: PremiumLockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (MOCK_USER.isPremium) {
    return <>{children}</>;
  }

  if (isUnlocked) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <BadgeUI label="관리자 모드" variant="warning" />
          <button
            onClick={() => setIsUnlocked(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            잠금
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={cn("pointer-events-none select-none blur-sm")}>
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-zinc-900/60 backdrop-blur-sm">
        <button
          onClick={() => setIsUnlocked(true)}
          className="absolute top-2 right-2 text-xs text-zinc-400 hover:text-zinc-600 z-10"
        >
          관리자: 잠금 해제
        </button>
        {title && (
          <p className="text-sm font-medium text-zinc-300 mb-2">{title}</p>
        )}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mb-3">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <p className="text-base font-bold text-white mb-1">
          프리미엄 회원 전용 콘텐츠
        </p>
        <p className="text-sm text-zinc-300">1주일 무료 체험으로 잠금 해제</p>
      </div>
    </div>
  );
}
