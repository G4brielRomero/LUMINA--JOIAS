'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProduct, Product } from '@/services/products';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));

function StockBadge({ stock }: { stock: number }) {
  let bg = '#dcfce7';
  let color = '#166534';
  let label = 'Estoque OK';

  if (stock < 5) {
    bg = '#fee2e2';
    color = '#991b1b';
    label = 'Estoque Crítico';
  } else if (stock < 10) {
    bg = '#fef9c3';
    color = '#854d0e';
    label = 'Estoque Baixo';
  }

  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-gray-50 last:border-0">
      <span className="text-xs font-medium tracking-widest uppercase text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
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

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
          >
            ←
          </Link>
          <h1 className="text-2xl font-light" style={{ color: '#0f172a' }}>
            Produto
          </h1>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error ?? 'Produto não encontrado.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-light tracking-wide" style={{ color: '#0f172a' }}>
            {product.name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">Detalhes do produto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main info card */}
        <div className="xl:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-700">
              Informações
            </h2>
            <StockBadge stock={product.stock} />
          </div>

          <div className="px-6">
            <InfoRow label="Nome" value={product.name} />
            <InfoRow
              label="Descrição"
              value={product.description ?? <span className="text-slate-300">—</span>}
            />
            <InfoRow label="Material" value={product.material} />
            <InfoRow
              label="Pedra / Gema"
              value={product.gemstone ?? <span className="text-slate-300">—</span>}
            />
            <InfoRow label="Peso" value={`${product.weight_g} g`} />
            <InfoRow
              label="Preço"
              value={
                <span style={{ color: '#C9A227' }} className="text-base font-semibold">
                  {formatCurrency(product.price)}
                </span>
              }
            />
            <InfoRow
              label="Estoque"
              value={
                <span>
                  <span className="text-xl font-light">{product.stock}</span>
                  <span className="ml-1 text-slate-400">unidades</span>
                </span>
              }
            />
            {product.image_url && (
              <InfoRow
                label="URL da Imagem"
                value={
                  <a
                    href={product.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A227] underline underline-offset-2 text-xs break-all"
                  >
                    {product.image_url}
                  </a>
                }
              />
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Image preview */}
          {product.image_url && (
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-700">
                  Imagem
                </h2>
              </div>
              <div className="p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: 220 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-700">
                Registro
              </h2>
            </div>
            <div className="px-6 py-2">
              <InfoRow label="Criado em" value={formatDate(product.created_at)} />
              <InfoRow label="Atualizado em" value={formatDate(product.updated_at)} />
            </div>
          </div>

          {/* Edit action */}
          <Link
            href={`/products/${product.id}/edit`}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium tracking-wide transition-colors"
            style={{ backgroundColor: '#C9A227', color: '#0f172a' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a07d1a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C9A227';
            }}
          >
            ✎ Editar Produto
          </Link>
        </div>
      </div>
    </div>
  );
}
