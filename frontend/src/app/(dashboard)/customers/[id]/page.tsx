'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomer, getCustomerOrders, Customer } from '@/services/customers';

interface CustomerOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

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

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendente', bg: '#fef3c7', text: '#92400e' },
  confirmed: { label: 'Confirmado', bg: '#dbeafe', text: '#1e40af' },
  delivered: { label: 'Entregue', bg: '#dcfce7', text: '#166534' },
  cancelled: { label: 'Cancelado', bg: '#fee2e2', text: '#991b1b' },
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [customerData, ordersData] = await Promise.all([
          getCustomer(id),
          getCustomerOrders(id),
        ]);
        setCustomer(customerData);
        setOrders(ordersData as CustomerOrder[]);
      } catch {
        setError('Erro ao carregar dados do cliente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded w-48" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-100 rounded w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/customers" className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2">
          ← Voltar para Clientes
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || 'Cliente não encontrado.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/customers"
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
              {customer.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Detalhes do cliente</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/customers/${id}/edit`)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#C9A227' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9A7B1A')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227')
          }
        >
          Editar
        </button>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-5"
          style={{ color: '#C9A227' }}
        >
          Informações do Cliente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nome</p>
            <p className="text-sm font-medium text-slate-800">{customer.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">CPF</p>
            <p className="text-sm font-medium text-slate-800 font-mono">
              {formatCPF(customer.cpf)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">E-mail</p>
            <p className="text-sm font-medium text-slate-800">{customer.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Telefone</p>
            <p className="text-sm font-medium text-slate-800">{customer.phone || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Endereço</p>
            <p className="text-sm font-medium text-slate-800">{customer.address || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              Data de Cadastro
            </p>
            <p className="text-sm font-medium text-slate-800">{formatDate(customer.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Histórico de Pedidos</h2>
          <span className="text-xs text-slate-400">{orders.length} pedido(s)</span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-3xl mb-3" style={{ color: '#C9A227' }}>
              ◎
            </span>
            <p className="text-slate-500 text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    ID
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Data
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Total
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
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-mono text-slate-600 text-xs">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: status.bg, color: status.text }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-slate-800">
                        {formatCurrency(order.total ?? 0)}
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
