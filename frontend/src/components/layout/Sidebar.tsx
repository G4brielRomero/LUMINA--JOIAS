'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: '◈' },
  { label: 'Produtos', href: '/products', icon: '◆' },
  { label: 'Clientes', href: '/customers', icon: '◉' },
  { label: 'Pedidos', href: '/orders', icon: '◎' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{ backgroundColor: '#0f172a' }}
      className="flex flex-col w-64 min-h-screen shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700">
        <span className="text-2xl leading-none" style={{ color: '#d4af37' }}>
          ✦
        </span>
        <div className="flex flex-col">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#d4af37' }}
          >
            LUMINA
          </span>
          <span className="text-xs font-light tracking-widest text-slate-400 uppercase">
            JOIAS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                active
                  ? {
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#d4af37',
                      borderLeft: '3px solid #d4af37',
                    }
                  : {
                      color: '#94a3b8',
                      borderLeft: '3px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-400 transition-all duration-150 cursor-pointer"
          style={{ borderLeft: '3px solid transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'rgba(248, 113, 113, 0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          <span className="text-base w-5 text-center">⎋</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
