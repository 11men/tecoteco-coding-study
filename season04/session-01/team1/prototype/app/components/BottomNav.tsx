'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Car, Bus, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/carpool', icon: Users, label: '카풀' },
  { href: '/taxi', icon: Car, label: '택시' },
  { href: '/charter', icon: Bus, label: '버스대절' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 온보딩 페이지에서는 숨김
  if (pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
