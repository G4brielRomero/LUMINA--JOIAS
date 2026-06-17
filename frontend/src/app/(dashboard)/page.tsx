'use client';

import { useEffect, useState } from 'react';
import { getDashboard, DashboardData } from '@/services/dashboard';

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

interface RecentOrder {
  id: string;
  customer_name?: string;
  customer?: { name?: string };
  total?: number;
  total_amount?: number;
  status: OrderStatus;
  created_at: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  material?: string;
}

interface ExtendedDashboardData extends DashboardData {
  lowStockProducts?: LowStockProduct[];
  low_stock_products?: LowStockProduct[];
  recentOrders?: RecentOrder[];
  recent_orders?: RecentOrder[];
  totalCustomers?: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(dateStr),
  );

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; bg: string; color: string }> = {
    pending: { label: 'Pendente', bg: '#fef9c3', color: '#854d0e' },
    confirmed: { label: 'Confirmado', bg: '#dbeafe', color: '#1e40af' },
    delivered: { label: 'Entregue', bg: '#dcfce7', color: '#166534' },
    cancelled: { label: 'Cancelado', bg: '#fee2e2', color: '#991b1b' },
  };

  const cfg = map[status] ?? { label: status, bg: '#f1f5f9', color: '#475569' };

  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: '#C9A227' }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}

function KpiCard({ icon, label, value, sub }: KpiCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-start gap-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-xl shrink-0"
        style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium tracking-widest uppercase text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-light tracking-tight" style={{ color: '#C9A227' }}>
          {value}
        </p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<ExtendedDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        const result = await getDashboard();
        setData(result as ExtendedDashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar o dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <span className="text-sm tracking-widest uppercase text-slate-400">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center">
          <p className="text-sm font-medium text-red-700">Erro ao carregar dados</p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const totalOrders = data?.total_orders ?? 0;
  const totalRevenue = data?.total_revenue ?? 0;
  const totalCustomers = data?.totalCustomers ?? data?.total_customers ?? 0;

  const lowStockProducts: LowStockProduct[] =
    (data?.lowStockProducts ?? data?.low_stock_products ?? []) as LowStockProduct[];

  const recentOrders: RecentOrder[] =
    (data?.recentOrders ?? data?.recent_orders ?? []) as RecentOrder[];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-light tracking-wide" style={{ color: '#0f172a' }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">Visão geral do negócio</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon="◎" label="Total de Pedidos" value={totalOrders} />
        <KpiCard
          icon="◈"
          label="Faturamento Total"
          value={formatCurrency(totalRevenue)}
        />
        <KpiCard
          icon="◆"
          label="Produtos Estoque Baixo"
          value={lowStockProducts.length}
          sub="estoque < 5 unidades"
        />
        <KpiCard icon="◉" label="Clientes Ativos" value={totalCustomers} />
      </div>

      {/* Bottom two-column section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-700">
              Vendas Recentes
            </h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">
              Nenhum pedido recente
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-widest uppercase text-slate-400">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-widest uppercase text-slate-400">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-widest uppercase text-slate-400">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-widest uppercase text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-widest uppercase text-slate-400">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => {
                    const customerName =
                      order.customer_name ??
                      order.customer?.name ??
                      '—';
                    const total = order.total ?? order.total_amount ?? 0;
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{customerName}</td>
                        <td className="px-6 py-4 text-right font-medium" style={{ color: '#C9A227' }}>
                          {formatCurrency(total)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400 text-xs">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-700">
              Estoque Baixo
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">
              Nenhum produto com estoque crítico
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{product.name}</p>
                    {product.material && (
                      <p className="mt-0.5 text-xs text-slate-400">{product.material}</p>
                    )}
                  </div>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: product.stock === 0 ? '#fee2e2' : '#fef9c3',
                      color: product.stock === 0 ? '#991b1b' : '#854d0e',
                    }}
                  >
                    {product.stock} un.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
