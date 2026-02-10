"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/": "",
  "/history": "기록",
  "/level": "내 레벨",
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "";
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 w-full max-w-[390px] bg-[#0a0a0f]/80 backdrop-blur-md border-b border-zinc-800" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex h-12 items-center px-4">
        <Link href="/" className="flex items-center justify-center gap-1 text-zinc-400 min-w-[44px] min-h-[44px]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold text-zinc-100">
          {title}
        </h1>
        <div className="w-[44px]" />
      </div>
    </header>
  );
}
