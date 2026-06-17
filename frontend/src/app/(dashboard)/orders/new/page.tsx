'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomers, Customer } from '@/services/customers';
import { getProducts, Product } from '@/services/products';
import { createOrder } from '@/services/orders';

interface OrderLineItem {
  product: Product;
  quantity: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function NewOrderPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([]);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ customer?: string; items?: string }>({});

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setLoadError(null);
      try {
        const [customersData, productsData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch {
        setLoadError('Erro ao carregar dados. Verifique a conexão com o servidor.');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.cpf.includes(customerSearch)
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const orderTotal = lineItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function addItem() {
    if (!selectedProduct) return;

    const existingIndex = lineItems.findIndex((item) => item.product.id === selectedProduct.id);
    if (existingIndex >= 0) {
      const updated = [...lineItems];
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty > selectedProduct.stock) {
        setServerError(
          `Quantidade total excede o estoque disponível (${selectedProduct.stock} unidades).`
        );
        return;
      }
      updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
      setLineItems(updated);
    } else {
      if (quantity > selectedProduct.stock) {
        setServerError(
          `Quantidade excede o estoque disponível (${selectedProduct.stock} unidades).`
        );
        return;
      }
      setLineItems((prev) => [...prev, { product: selectedProduct, quantity }]);
    }

    setSelectedProductId('');
    setQuantity(1);
    setProductSearch('');
    setServerError(null);
    if (formErrors.items) setFormErrors((prev) => ({ ...prev, items: undefined }));
  }

  function removeItem(productId: string) {
    setLineItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function updateItemQuantity(productId: string, qty: number) {
    if (qty < 1) return;
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.stock) return;
    setLineItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  }

  function validate(): boolean {
    const errors: { customer?: string; items?: string } = {};
    if (!selectedCustomerId) errors.customer = 'Selecione um cliente.';
    if (lineItems.length === 0) errors.items = 'Adicione pelo menos um produto.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      await createOrder({
        customer_id: selectedCustomerId,
        notes: notes.trim() || undefined,
        items: lineItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });
      router.push('/orders');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar pedido. Tente novamente.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded w-48" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href="/orders" className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2">
          ← Voltar para Pedidos
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/orders"
          className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
            Novo Pedido
          </h1>
          <p className="text-sm text-slate-500 mt-1">Preencha os dados do pedido</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* Step 1: Select Customer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: '#C9A227' }}
            >
              1
            </span>
            <h2 className="text-sm font-semibold text-slate-700">Selecionar Cliente</h2>
          </div>

          <input
            type="text"
            placeholder="Buscar cliente por nome ou CPF..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />

          <div
            className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredCustomers.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                Nenhum cliente encontrado
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    if (formErrors.customer)
                      setFormErrors((prev) => ({ ...prev, customer: undefined }));
                  }}
                  className="w-full text-left px-4 py-3 text-sm border-b border-slate-50 last:border-b-0 transition-colors"
                  style={{
                    backgroundColor:
                      selectedCustomerId === customer.id
                        ? 'rgba(201,162,39,0.08)'
                        : 'transparent',
                    color: selectedCustomerId === customer.id ? '#C9A227' : '#374151',
                  }}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{customer.email}</div>
                </button>
              ))
            )}
          </div>

          {selectedCustomer && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              style={{ backgroundColor: 'rgba(201,162,39,0.06)', borderColor: '#C9A227' }}
            >
              <span style={{ color: '#C9A227' }}>✓</span>
              <div>
                <p className="text-sm font-medium text-slate-800">{selectedCustomer.name}</p>
                <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
              </div>
            </div>
          )}

          {formErrors.customer && (
            <p className="text-red-500 text-xs">{formErrors.customer}</p>
          )}
        </div>

        {/* Step 2: Add Products */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: '#C9A227' }}
            >
              2
            </span>
            <h2 className="text-sm font-semibold text-slate-700">Adicionar Produtos</h2>
          </div>

          {/* Product search and selection */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setSelectedProductId('');
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>
            <div>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none text-center"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>
            <button
              type="button"
              onClick={addItem}
              disabled={!selectedProductId}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40"
              style={{ backgroundColor: '#C9A227' }}
              onMouseEnter={(e) => {
                if (selectedProductId)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9A7B1A';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227';
              }}
            >
              Adicionar
            </button>
          </div>

          {/* Product list */}
          {productSearch && (
            <div
              className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
              style={{ scrollbarWidth: 'thin' }}
            >
              {filteredProducts.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  Nenhum produto encontrado
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setProductSearch(product.name);
                    }}
                    className="w-full text-left px-4 py-3 text-sm border-b border-slate-50 last:border-b-0 transition-colors"
                    style={{
                      backgroundColor:
                        selectedProductId === product.id
                          ? 'rgba(201,162,39,0.08)'
                          : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-800">{product.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {product.material} — Estoque: {product.stock}
                        </div>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: '#C9A227' }}>
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Current line items */}
          {lineItems.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Unit.
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item) => (
                    <tr key={item.product.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min={1}
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(
                              item.product.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 px-2 py-1 rounded border border-slate-200 text-center text-sm focus:outline-none"
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatCurrency(item.product.price)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatCurrency(item.product.price * item.quantity)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-600 transition-colors text-xs"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {formErrors.items && (
            <p className="text-red-500 text-xs">{formErrors.items}</p>
          )}
        </div>

        {/* Step 3: Notes + Total */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: '#C9A227' }}
            >
              3
            </span>
            <h2 className="text-sm font-semibold text-slate-700">Observações e Resumo</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Observações <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o pedido..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none resize-none transition-colors"
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Order summary */}
          <div
            className="flex items-center justify-between px-5 py-4 rounded-xl border"
            style={{ backgroundColor: 'rgba(201,162,39,0.06)', borderColor: '#C9A227' }}
          >
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Total do Pedido
              </p>
              {lineItems.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {lineItems.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </p>
              )}
            </div>
            <p className="text-2xl font-bold" style={{ color: '#C9A227' }}>
              {formatCurrency(orderTotal)}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/orders"
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#C9A227' }}
            onMouseEnter={(e) => {
              if (!submitting)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9A7B1A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227';
            }}
          >
            {submitting ? 'Criando Pedido...' : 'Criar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}
