"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  home: (active) => (
    <svg className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  shield: (active) => (
    <svg className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  star: (active) => (
    <svg className="h-6 w-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full max-w-[390px] border-t border-zinc-800 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-evenly pt-1.5 pb-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-4 py-1 transition-colors ${
                isActive ? "text-blue-400" : "text-zinc-600"
              }`}
            >
              <span>
                {ICONS[item.icon]?.(isActive)}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
