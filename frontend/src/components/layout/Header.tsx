'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PageMeta {
  title: string;
  breadcrumb: string[];
}

function getPageMeta(pathname: string): PageMeta {
  if (pathname === '/') {
    return { title: 'Dashboard', breadcrumb: ['Dashboard'] };
  }
  if (pathname.startsWith('/products')) {
    if (pathname === '/products/new') {
      return { title: 'Novo Produto', breadcrumb: ['Produtos', 'Novo'] };
    }
    if (pathname.match(/^\/products\/[^/]+\/edit$/)) {
      return { title: 'Editar Produto', breadcrumb: ['Produtos', 'Editar'] };
    }
    if (pathname.match(/^\/products\/[^/]+$/)) {
      return { title: 'Detalhes do Produto', breadcrumb: ['Produtos', 'Detalhes'] };
    }
    return { title: 'Produtos', breadcrumb: ['Produtos'] };
  }
  if (pathname.startsWith('/customers')) {
    if (pathname === '/customers/new') {
      return { title: 'Novo Cliente', breadcrumb: ['Clientes', 'Novo'] };
    }
    if (pathname.match(/^\/customers\/[^/]+\/edit$/)) {
      return { title: 'Editar Cliente', breadcrumb: ['Clientes', 'Editar'] };
    }
    if (pathname.match(/^\/customers\/[^/]+\/orders$/)) {
      return { title: 'Pedidos do Cliente', breadcrumb: ['Clientes', 'Pedidos'] };
    }
    if (pathname.match(/^\/customers\/[^/]+$/)) {
      return { title: 'Detalhes do Cliente', breadcrumb: ['Clientes', 'Detalhes'] };
    }
    return { title: 'Clientes', breadcrumb: ['Clientes'] };
  }
  if (pathname.startsWith('/orders')) {
    if (pathname === '/orders/new') {
      return { title: 'Novo Pedido', breadcrumb: ['Pedidos', 'Novo'] };
    }
    if (pathname.match(/^\/orders\/[^/]+$/)) {
      return { title: 'Detalhes do Pedido', breadcrumb: ['Pedidos', 'Detalhes'] };
    }
    return { title: 'Pedidos', breadcrumb: ['Pedidos'] };
  }
  return { title: 'Lumina Joias', breadcrumb: [] };
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { title, breadcrumb } = getPageMeta(pathname);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
      <div className="flex flex-col">
        {breadcrumb.length > 1 && (
          <div className="flex items-center gap-1.5 mb-0.5">
            {breadcrumb.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-slate-300 text-xs select-none">/</span>
                )}
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? 'text-xs text-slate-500 font-medium'
                      : 'text-xs text-slate-400'
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700 leading-tight">
              {user.name}
            </span>
            {user.role && (
              <span className="text-xs text-slate-400 capitalize">{user.role}</span>
            )}
          </div>
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold text-white select-none"
            style={{ backgroundColor: '#d4af37' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
