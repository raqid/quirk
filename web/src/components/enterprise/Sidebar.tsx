'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  FolderOpen,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/enterprise', label: 'Overview', icon: LayoutDashboard },
  { href: '/enterprise/datasets', label: 'Datasets', icon: Database },
  { href: '/enterprise/collections', label: 'Collections', icon: FolderOpen },
  { href: '/enterprise/purchases', label: 'Purchases', icon: ShoppingCart },
  { href: '/enterprise/settings', label: 'Settings', icon: Settings },
];

function NavLink({ href, label, icon: Icon, active }: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: active ? '500' : '400',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        background: active ? 'var(--primary-dim)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.15s',
      }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Zap size={14} color="rgba(255,255,255,0.6)" />
        </div>
        <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>Quirk Enterprise</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/enterprise'
            ? pathname === '/enterprise'
            : pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive}
            />
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          background: 'var(--surface-elevated)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Acme Corp</p>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>Enterprise Plan</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'none',
      }} className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 50,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--text)',
          display: 'none',
        }}
        className="sidebar-mobile-toggle"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 40,
          }}
        />
      )}

      {/* Mobile drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: mobileOpen ? 0 : '-260px',
          width: '240px',
          height: '100vh',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          zIndex: 50,
          transition: 'left 0.25s ease',
          display: 'none',
        }}
        className="sidebar-mobile"
      >
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '4px',
          }}
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
        }
        @media (max-width: 767px) {
          .sidebar-mobile-toggle { display: block !important; }
          .sidebar-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}
