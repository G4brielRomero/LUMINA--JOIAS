#!/bin/sh
set -e

echo "⏳ Aplicando migrações..."
npx prisma migrate deploy

echo "🌱 Populando banco de dados..."
npx prisma db seed

echo "🚀 Iniciando backend..."
exec node dist/main
