'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder, updateOrderStatus, Order, OrderStatus } from '@/services/orders';

interface OrderItemFull {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    id: string;
    name: string;
    material: string;
    price: number;
  };
}

interface FullOrder extends Omit<Order, 'items'> {
  total?: number;
  user_id?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    cpf: string;
  };
  items: OrderItemFull[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrder(id);
        const fullOrder = data as FullOrder;
        setOrder(fullOrder);
        setNewStatus(fullOrder.status);
      } catch {
        setError('Erro ao carregar pedido.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusUpdate() {
    if (!order || newStatus === order.status) return;
    setUpdatingStatus(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: updated.status } : prev));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch {
      setUpdateError('Erro ao atualizar status.');
    } finally {
      setUpdatingStatus(false);
    }
  }

  const orderTotal =
    order?.total ??
    (order?.items?.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0) ?? 0);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded w-48" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-100 rounded w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link
          href="/orders"
          className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2"
        >
          ← Voltar para Pedidos
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || 'Pedido não encontrado.'}
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status] || {
    label: order.status,
    bg: '#f1f5f9',
    text: '#475569',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
                Pedido
              </h1>
              <span className="font-mono text-base text-slate-500">
                #{order.id.slice(0, 8)}...
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Detalhes do pedido</p>
          </div>
        </div>
        <span
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: currentStatus.bg, color: currentStatus.text }}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-5"
          style={{ color: '#C9A227' }}
        >
          Informações do Pedido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ID do Pedido</p>
            <p className="text-sm font-mono text-slate-800">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Data</p>
            <p className="text-sm text-slate-800">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cliente</p>
            <p className="text-sm font-medium text-slate-800">
              {order.customer?.name || order.customer_id}
            </p>
            {order.customer?.email && (
              <p className="text-xs text-slate-400 mt-0.5">{order.customer.email}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vendedor</p>
            <p className="text-sm text-slate-800 font-mono">
              {order.user_id ? order.user_id.slice(0, 8) + '...' : '—'}
            </p>
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Observações</p>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Itens do Pedido</h2>
        </div>

        {order.items && order.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                      Produto
                    </th>
                    <th className="text-center px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                      Qtd
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                      Preço Unit.
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => {
                    const unitPrice = item.unit_price ?? item.product?.price ?? 0;
                    const subtotal = unitPrice * item.quantity;
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">
                            {item.product?.name || item.product_id}
                          </div>
                          {item.product?.material && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              {item.product.material}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(unitPrice)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-800">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ backgroundColor: 'rgba(201,162,39,0.04)', borderColor: '#e2e8f0' }}
            >
              <p className="text-sm font-semibold text-slate-700">Total do Pedido</p>
              <p className="text-xl font-bold" style={{ color: '#C9A227' }}>
                {formatCurrency(orderTotal)}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-slate-400 text-sm">Nenhum item neste pedido</p>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: '#C9A227' }}
        >
          Atualizar Status
        </h2>

        {updateError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {updateError}
          </div>
        )}

        {updateSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Status atualizado com sucesso!
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Novo Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none"
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus || newStatus === order.status}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#C9A227' }}
            onMouseEnter={(e) => {
              if (!updatingStatus && newStatus !== order.status)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9A7B1A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227';
            }}
          >
            {updatingStatus ? 'Atualizando...' : 'Atualizar Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
