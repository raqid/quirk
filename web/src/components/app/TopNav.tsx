'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const TABS = [
  { href: '/app', label: 'home' },
  { href: '/app/tasks', label: 'tasks' },
  { href: '/app/capture', label: 'capture' },
  { href: '/app/earn', label: 'earn' },
  { href: '/app/wallet', label: 'wallet' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  const initials = user?.display_name?.charAt(0).toUpperCase() || '?';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 backdrop-blur-md"
      style={{
        background: 'rgba(10, 10, 10, 0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Link href="/app" className="no-underline flex items-center gap-2">
        <span
          className="text-[22px]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}
        >
          Quirk
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="no-underline px-3 py-2 text-[13px] tracking-wide transition-colors duration-150"
              style={{
                color: active ? 'var(--color-olive)' : 'rgba(255,255,255,0.25)',
                fontWeight: active ? 400 : 300,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px]"
          style={{
            background: 'var(--color-olive-dim)',
            border: '1px solid rgba(139, 154, 91, 0.15)',
            color: 'var(--color-olive)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
          }}
        >
          {initials}
        </div>
        <button
          onClick={signOut}
          className="bg-transparent border-none cursor-pointer p-1 flex items-center"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
