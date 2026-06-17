'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCustomers, deleteCustomer, Customer } from '@/services/customers';

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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers(debouncedSearch || undefined);
      setCustomers(data);
    } catch {
      setError('Erro ao carregar clientes. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError('Erro ao excluir cliente.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
            Clientes
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie a base de clientes da loja</p>
        </div>
        <Link
          href="/customers/new"
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
          Novo Cliente
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': '#C9A227' } as React.CSSProperties}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        />
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
                <div className="h-4 bg-slate-100 rounded flex-1" />
                <div className="h-4 bg-slate-100 rounded w-32" />
                <div className="h-4 bg-slate-100 rounded w-40" />
                <div className="h-4 bg-slate-100 rounded w-28" />
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-4 bg-slate-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4" style={{ color: '#C9A227' }}>
              ◉
            </span>
            <p className="text-slate-600 font-medium">Nenhum cliente encontrado</p>
            <p className="text-slate-400 text-sm mt-1">
              {search
                ? 'Tente ajustar o termo de busca'
                : 'Comece cadastrando um novo cliente'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Nome
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    CPF
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    E-mail
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Data de Cadastro
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50 transition-colors duration-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">{customer.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">
                      {formatCPF(customer.cpf)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{customer.email}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.phone || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(customer.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/customers/${customer.id}`)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => router.push(`/customers/${customer.id}/edit`)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border text-white transition-colors"
                          style={{ backgroundColor: '#C9A227', borderColor: '#C9A227' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              '#9A7B1A';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              '#C9A227';
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTarget(customer)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Excluir Cliente</h2>
            <p className="text-slate-500 text-sm mb-6">
              Tem certeza que deseja excluir{' '}
              <span className="font-semibold text-slate-700">{deleteTarget.name}</span>? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
