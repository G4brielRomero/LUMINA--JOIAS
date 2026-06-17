'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCustomer, CreateCustomerData } from '@/services/customers';

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(digits[10]);
}

function formatCPFInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

interface FormErrors {
  name?: string;
  cpf?: string;
  email?: string;
}

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCPFInput(e.target.value);
    setForm((prev) => ({ ...prev, cpf: formatted }));
    if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: undefined }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter no mínimo 2 caracteres.';
    }

    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (!cpfDigits) {
      newErrors.cpf = 'CPF é obrigatório.';
    } else if (cpfDigits.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos.';
    } else if (!validateCPF(cpfDigits)) {
      newErrors.cpf = 'CPF inválido.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'E-mail inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    const data: CreateCustomerData = {
      name: form.name.trim(),
      cpf: form.cpf.replace(/\D/g, ''),
      email: form.email.trim(),
    };
    if (form.phone.trim()) data.phone = form.phone.trim();
    if (form.address.trim()) data.address = form.address.trim();

    try {
      await createCustomer(data);
      router.push('/customers');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao cadastrar cliente. Tente novamente.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customers"
          className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
            Novo Cliente
          </h1>
          <p className="text-sm text-slate-500 mt-1">Preencha os dados para cadastrar um cliente</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Nome completo"
              className={`${inputClass} ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              onFocus={(e) => {
                if (!errors.name) e.currentTarget.style.borderColor = '#C9A227';
              }}
              onBlur={(e) => {
                if (!errors.name) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`${inputClass} font-mono ${errors.cpf ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              onFocus={(e) => {
                if (!errors.cpf) e.currentTarget.style.borderColor = '#C9A227';
              }}
              onBlur={(e) => {
                if (!errors.cpf) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
            {errors.cpf && (
              <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="cliente@email.com"
              className={`${inputClass} ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              onFocus={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = '#C9A227';
              }}
              onBlur={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="(00) 00000-0000"
              className={`${inputClass} border-slate-200`}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Endereço completo"
              rows={3}
              className={`${inputClass} border-slate-200 resize-none`}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C9A227')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/customers"
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#C9A227' }}
              onMouseEnter={(e) => {
                if (!submitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9A7B1A';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227';
              }}
            >
              {submitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
