'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders, Order, OrderStatus } from '@/services/orders';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: '#fef3c7', text: '#92400e' },
  confirmed: { label: 'Confirmado', bg: '#dbeafe', text: '#1e40af' },
  delivered: { label: 'Entregue', bg: '#dcfce7', text: '#166534' },
  cancelled: { label: 'Cancelado', bg: '#fee2e2', text: '#991b1b' },
};

interface ExtendedOrder extends Order {
  customer?: { name: string };
  total?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { status?: string; date?: string } = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const data = await getOrders(params);
      setOrders(data as ExtendedOrder[]);
    } catch {
      setError('Erro ao carregar pedidos. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
            Pedidos
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os pedidos da loja</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150"
          style={{ backgroundColor: '#C9A227' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#9A7B1A')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C9A227')
          }
        >
          <span>+</span>
          Novo Pedido
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          >
            <option value="">Todos</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Data
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>
        {(statusFilter || dateFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('');
                setDateFilter('');
              }}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-4 bg-slate-100 rounded flex-1" />
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-4 bg-slate-100 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-4 bg-slate-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4" style={{ color: '#C9A227' }}>
              ◎
            </span>
            <p className="text-slate-600 font-medium">Nenhum pedido encontrado</p>
            <p className="text-slate-400 text-sm mt-1">
              {statusFilter || dateFilter
                ? 'Tente ajustar os filtros'
                : 'Comece criando um novo pedido'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Data
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || {
                    label: order.status,
                    bg: '#f1f5f9',
                    text: '#475569',
                  };
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors duration-100"
                    >
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {order.customer?.name || order.customer_id.slice(0, 8) + '...'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-800">
                        {formatCurrency(order.total ?? 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: status.bg, color: status.text }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => router.push(`/orders/${order.id}`)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
