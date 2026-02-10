"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/": "",
  "/pattern": "패턴 분석",
  "/shadow-record": "참음의 기록",
  "/jomo": "방어 현황",
  "/level": "내 레벨",
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "";
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex h-12 max-w-lg items-center px-4">
        <Link href="/" className="flex items-center gap-1 text-gray-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
          {title}
        </h1>
        <div className="w-5" />
      </div>
    </header>
  );
}
