'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Car, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/carpool', icon: Users, label: '카풀' },
  { href: '/taxi', icon: Car, label: '택시' },
  { href: '/community', icon: MessageSquare, label: '커뮤니티' },
  { href: '/settings', icon: User, label: '내 정보' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 온보딩 페이지에서는 숨김
  if (pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
