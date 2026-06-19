'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!email) {
      next.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Informe um e-mail válido.';
    }

    if (!password) {
      next.password = 'Senha é obrigatória.';
    } else if (password.length < 8) {
      next.password = 'A senha deve ter no mínimo 8 caracteres.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      let message = 'Credenciais inválidas. Tente novamente.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        message = Array.isArray(data?.message)
          ? data.message.join(', ')
          : data?.message || message;
      }
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, #C9A227 0%, transparent 70%)',
          }}
        />

        {/* Decorative ring */}
        <div
          className="absolute w-96 h-96 rounded-full border opacity-10"
          style={{ borderColor: '#C9A227' }}
        />
        <div
          className="absolute w-72 h-72 rounded-full border opacity-10"
          style={{ borderColor: '#F5E6A3' }}
        />

        <div className="relative z-10 text-center px-12">
          <p
            className="text-4xl font-light tracking-[0.3em] uppercase mb-4"
            style={{ color: '#C9A227' }}
          >
            LUMINA JOIAS
          </p>
          <span className="text-2xl" style={{ color: '#C9A227' }}>
            ✦
          </span>
          <p
            className="mt-6 text-lg font-light tracking-widest"
            style={{ color: '#F5E6A3', opacity: 0.85 }}
          >
            Sofisticação em cada detalhe
          </p>
          <div
            className="mt-8 w-16 h-px mx-auto"
            style={{ background: '#C9A227' }}
          />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-8 py-12 sm:px-16">
        {/* Mobile brand header */}
        <div className="lg:hidden mb-10 text-center">
          <p
            className="text-2xl font-light tracking-[0.25em] uppercase"
            style={{ color: '#C9A227' }}
          >
            LUMINA JOIAS
          </p>
          <span style={{ color: '#C9A227' }}>✦</span>
        </div>

        <div className="w-full max-w-sm">
          <h1
            className="text-3xl font-light mb-2 tracking-wide"
            style={{ color: '#1a1a2e' }}
          >
            Bem-vindo
          </h1>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            Acesse sua conta para continuar
          </p>

          {serverError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-widest uppercase mb-1.5"
                style={{ color: '#1a1a2e' }}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors
                  ${
                    errors.email
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:border-[#C9A227]'
                  }`}
                style={{ color: '#1a1a2e', background: '#fafafa' }}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-widest uppercase mb-1.5"
                style={{ color: '#1a1a2e' }}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors
                  ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:border-[#C9A227]'
                  }`}
                style={{ color: '#1a1a2e', background: '#fafafa' }}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg py-3 text-sm font-medium tracking-widest uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading ? '#9A7B1A' : '#C9A227',
                color: '#0f172a',
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLButtonElement).style.background = '#9A7B1A';
              }}
              onMouseLeave={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLButtonElement).style.background = '#C9A227';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: '#64748b' }}>
            Não tem uma conta?{' '}
            <Link
              href="/register"
              className="font-medium transition-colors hover:underline"
              style={{ color: '#C9A227' }}
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
