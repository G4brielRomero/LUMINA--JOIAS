'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getProduct, updateProduct, CreateProductData } from '@/services/products';

interface FormValues {
  name: string;
  description: string;
  material: string;
  gemstone: string;
  weight_g: string;
  price: string;
  stock: string;
  image_url: string;
}

interface FormErrors {
  name?: string;
  material?: string;
  weight_g?: string;
  price?: string;
  stock?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Nome é obrigatório.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Nome deve ter no mínimo 2 caracteres.';
  }

  if (!values.material.trim()) {
    errors.material = 'Material é obrigatório.';
  }

  const weightNum = parseFloat(values.weight_g);
  if (!values.weight_g) {
    errors.weight_g = 'Peso é obrigatório.';
  } else if (isNaN(weightNum) || weightNum <= 0) {
    errors.weight_g = 'Peso deve ser um número maior que zero.';
  }

  const priceNum = parseFloat(values.price);
  if (!values.price) {
    errors.price = 'Preço é obrigatório.';
  } else if (isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Preço deve ser um número maior que zero.';
  }

  const stockNum = parseInt(values.stock, 10);
  if (values.stock === '') {
    errors.stock = 'Estoque é obrigatório.';
  } else if (isNaN(stockNum) || stockNum < 0) {
    errors.stock = 'Estoque deve ser um número inteiro maior ou igual a zero.';
  }

  return errors;
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-widest uppercase mb-1.5 text-slate-700">
        {label}
        {required && <span className="ml-1" style={{ color: '#C9A227' }}>*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-700 bg-white outline-none transition-colors ${
    hasError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#C9A227]'
  }`;

function Spinner({ small }: { small?: boolean }) {
  const size = small ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <svg
      className={`${size} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: small ? 'currentColor' : '#C9A227' }}
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [values, setValues] = useState<FormValues>({
    name: '',
    description: '',
    material: '',
    gemstone: '',
    weight_g: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        setIsFetching(true);
        const product = await getProduct(id);
        setValues({
          name: product.name,
          description: product.description ?? '',
          material: product.material,
          gemstone: product.gemstone ?? '',
          weight_g: String(product.weight_g),
          price: String(product.price),
          stock: String(product.stock),
          image_url: product.image_url ?? '',
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Erro ao carregar produto.');
      } finally {
        setIsFetching(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<CreateProductData> = {
        name: values.name.trim(),
        material: values.material.trim(),
        weight_g: parseFloat(values.weight_g),
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        description: values.description.trim() || undefined,
        gemstone: values.gemstone.trim() || undefined,
        image_url: values.image_url.trim() || undefined,
      };

      await updateProduct(id, payload);
      router.push('/products');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao atualizar produto. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <span className="text-sm tracking-widest uppercase text-slate-400">Carregando produto...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
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
            Editar Produto
          </h1>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {fetchError}
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
            Editar Produto
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">Atualize as informações do produto</p>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 max-w-2xl">
        {serverError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <Field label="Nome" required error={errors.name}>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ex: Anel Solitário"
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Description */}
          <Field label="Descrição">
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Descrição detalhada do produto..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-slate-700 bg-white outline-none transition-colors focus:border-[#C9A227] resize-none"
            />
          </Field>

          {/* Material */}
          <Field label="Material" required error={errors.material}>
            <input
              type="text"
              name="material"
              value={values.material}
              onChange={handleChange}
              placeholder="Ex: Ouro 18k"
              className={inputClass(!!errors.material)}
            />
          </Field>

          {/* Gemstone */}
          <Field label="Pedra / Gema">
            <input
              type="text"
              name="gemstone"
              value={values.gemstone}
              onChange={handleChange}
              placeholder="Ex: Diamante, Rubi, Esmeralda..."
              className={inputClass(false)}
            />
          </Field>

          {/* Weight + Price row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Peso em gramas" required error={errors.weight_g}>
              <input
                type="number"
                name="weight_g"
                value={values.weight_g}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={inputClass(!!errors.weight_g)}
              />
            </Field>
            <Field label="Preço (R$)" required error={errors.price}>
              <input
                type="number"
                name="price"
                value={values.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={inputClass(!!errors.price)}
              />
            </Field>
          </div>

          {/* Stock */}
          <Field label="Estoque" required error={errors.stock}>
            <input
              type="number"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1"
              className={inputClass(!!errors.stock)}
            />
          </Field>

          {/* Image URL */}
          <Field label="URL da Imagem">
            <input
              type="url"
              name="image_url"
              value={values.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass(false)}
            />
          </Field>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/products"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#C9A227', color: '#0f172a' }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#a07d1a';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A227';
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner small />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
