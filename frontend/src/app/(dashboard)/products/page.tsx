'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getProducts, deleteProduct, Product } from '@/services/products';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const MATERIALS = ['Ouro 18k', 'Prata 925', 'Ouro Branco', 'Platina', 'Rose Gold', 'Outro'];

function StockBadge({ stock }: { stock: number }) {
  let bg = '#dcfce7';
  let color = '#166534';
  let label = `${stock} un.`;

  if (stock < 5) {
    bg = '#fee2e2';
    color = '#991b1b';
  } else if (stock < 10) {
    bg = '#fef9c3';
    color = '#854d0e';
  }

  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: i === 0 ? '60%' : '40%' }} />
        </td>
      ))}
    </tr>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: { name?: string; material?: string } = {};
      if (nameFilter.trim()) params.name = nameFilter.trim();
      if (materialFilter) params.material = materialFilter;
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos.');
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, materialFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir produto.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide" style={{ color: '#0f172a' }}>
            Produtos
          </h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie o catálogo de joias</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium tracking-wide transition-colors"
          style={{ backgroundColor: '#C9A227', color: '#0f172a' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a07d1a';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C9A227';
          }}
        >
          <span className="text-base leading-none">+</span>
          Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#C9A227] sm:w-64"
        />
        <select
          value={materialFilter}
          onChange={(e) => setMaterialFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#C9A227] sm:w-52"
        >
          <option value="">Todos os materiais</option>
          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nome', 'Material', 'Pedra', 'Peso (g)', 'Preço', 'Estoque', 'Ações'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-medium tracking-widest uppercase text-slate-400"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600">{product.material}</td>
                    <td className="px-6 py-4 text-slate-500">{product.gemstone ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{product.weight_g}g</td>
                    <td className="px-6 py-4 font-medium" style={{ color: '#C9A227' }}>
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === product.id ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
