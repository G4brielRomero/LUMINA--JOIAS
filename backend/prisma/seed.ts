import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ─── Usuários ────────────────────────────────────────────────────────────────

  const adminHash = await bcrypt.hash('admin123', 10);
  const sellerHash = await bcrypt.hash('vendedor123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@luminajoias.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@luminajoias.com',
      password_hash: adminHash,
      role: 'admin',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'vendedor@luminajoias.com' },
    update: {},
    create: {
      name: 'João Vendedor',
      email: 'vendedor@luminajoias.com',
      password_hash: sellerHash,
      role: 'seller',
    },
  });

  console.log(`✅ Usuários criados: ${admin.email}, ${seller.email}`);

  // ─── Produtos ────────────────────────────────────────────────────────────────

  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-001' },
      update: {},
      create: {
        id: 'prod-001',
        name: 'Anel Solitário Ouro 18k',
        description: 'Anel solitário em ouro 18k com diamante central de 0,25ct.',
        material: 'Ouro 18k',
        gemstone: 'Diamante',
        weight_g: 3.5,
        price: 2850.0,
        stock: 8,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-002' },
      update: {},
      create: {
        id: 'prod-002',
        name: 'Brinco Argola Prata 925',
        description: 'Brinco argola liso em prata 925 com acabamento polido.',
        material: 'Prata 925',
        gemstone: null,
        weight_g: 4.2,
        price: 320.0,
        stock: 15,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-003' },
      update: {},
      create: {
        id: 'prod-003',
        name: 'Colar Riviera Ouro Branco',
        description: 'Colar riviera em ouro branco 18k cravejado com safiras azuis.',
        material: 'Ouro Branco 18k',
        gemstone: 'Safira',
        weight_g: 9.1,
        price: 6400.0,
        stock: 3,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-004' },
      update: {},
      create: {
        id: 'prod-004',
        name: 'Pulseira Elos Rose Gold',
        description: 'Pulseira de elos em ouro rosé 18k, fecho caixa com trava.',
        material: 'Rose Gold 18k',
        gemstone: null,
        weight_g: 6.8,
        price: 3200.0,
        stock: 6,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-005' },
      update: {},
      create: {
        id: 'prod-005',
        name: 'Pingente Coração Esmeralda',
        description: 'Pingente coração em ouro 18k com esmeralda colombiana central.',
        material: 'Ouro 18k',
        gemstone: 'Esmeralda',
        weight_g: 2.3,
        price: 1750.0,
        stock: 4,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-006' },
      update: {},
      create: {
        id: 'prod-006',
        name: 'Aliança Casamento Ouro 18k',
        description: 'Par de alianças em ouro 18k com acabamento liso e polido.',
        material: 'Ouro 18k',
        gemstone: null,
        weight_g: 7.0,
        price: 4200.0,
        stock: 2,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-007' },
      update: {},
      create: {
        id: 'prod-007',
        name: 'Brinco Gota Rubi',
        description: 'Brinco gota em ouro 18k com rubi natural e brilhantes.',
        material: 'Ouro 18k',
        gemstone: 'Rubi',
        weight_g: 3.8,
        price: 2200.0,
        stock: 0,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-008' },
      update: {},
      create: {
        id: 'prod-008',
        name: 'Tornozeleira Prata 925',
        description: 'Tornozeleira em prata 925 com pequenos cristais Swarovski.',
        material: 'Prata 925',
        gemstone: 'Cristal',
        weight_g: 5.5,
        price: 480.0,
        stock: 12,
      },
    }),
  ]);

  console.log(`✅ ${products.length} produtos criados`);

  // ─── Clientes ────────────────────────────────────────────────────────────────

  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { cpf: '12345678901' },
      update: {},
      create: {
        name: 'Ana Paula Souza',
        cpf: '12345678901',
        email: 'ana.souza@email.com',
        phone: '(11) 98765-4321',
        address: 'Rua das Flores, 123 - São Paulo, SP',
      },
    }),
    prisma.customer.upsert({
      where: { cpf: '98765432100' },
      update: {},
      create: {
        name: 'Carlos Eduardo Lima',
        cpf: '98765432100',
        email: 'carlos.lima@email.com',
        phone: '(21) 91234-5678',
        address: 'Av. Atlântica, 500 - Rio de Janeiro, RJ',
      },
    }),
    prisma.customer.upsert({
      where: { cpf: '45678912300' },
      update: {},
      create: {
        name: 'Fernanda Oliveira',
        cpf: '45678912300',
        email: 'fernanda.oliveira@email.com',
        phone: '(31) 99876-5432',
        address: 'Rua dos Andradas, 78 - Belo Horizonte, MG',
      },
    }),
    prisma.customer.upsert({
      where: { cpf: '32165498700' },
      update: {},
      create: {
        name: 'Ricardo Martins',
        cpf: '32165498700',
        email: 'ricardo.martins@email.com',
        phone: '(41) 98888-7777',
        address: 'Al. Carlos de Carvalho, 222 - Curitiba, PR',
      },
    }),
    prisma.customer.upsert({
      where: { cpf: '65432198700' },
      update: {},
      create: {
        name: 'Isabela Santos',
        cpf: '65432198700',
        email: 'isabela.santos@email.com',
        phone: '(51) 97777-6666',
        address: 'Rua Padre Chagas, 300 - Porto Alegre, RS',
      },
    }),
  ]);

  console.log(`✅ ${customers.length} clientes criados`);

  // ─── Pedidos ─────────────────────────────────────────────────────────────────

  const order1 = await prisma.order.upsert({
    where: { id: 'order-001' },
    update: {},
    create: {
      id: 'order-001',
      customer_id: customers[0].id,
      user_id: seller.id,
      status: 'delivered',
      total: 3170.0,
      notes: 'Embrulho para presente',
      items: {
        create: [
          { product_id: 'prod-001', quantity: 1, unit_price: 2850.0 },
          { product_id: 'prod-002', quantity: 1, unit_price: 320.0 },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { id: 'order-002' },
    update: {},
    create: {
      id: 'order-002',
      customer_id: customers[1].id,
      user_id: admin.id,
      status: 'confirmed',
      total: 6400.0,
      notes: null,
      items: {
        create: [{ product_id: 'prod-003', quantity: 1, unit_price: 6400.0 }],
      },
    },
  });

  const order3 = await prisma.order.upsert({
    where: { id: 'order-003' },
    update: {},
    create: {
      id: 'order-003',
      customer_id: customers[2].id,
      user_id: seller.id,
      status: 'pending',
      total: 4950.0,
      notes: 'Gravar iniciais "F.O." na parte interna',
      items: {
        create: [
          { product_id: 'prod-004', quantity: 1, unit_price: 3200.0 },
          { product_id: 'prod-005', quantity: 1, unit_price: 1750.0 },
        ],
      },
    },
  });

  const order4 = await prisma.order.upsert({
    where: { id: 'order-004' },
    update: {},
    create: {
      id: 'order-004',
      customer_id: customers[3].id,
      user_id: seller.id,
      status: 'delivered',
      total: 4200.0,
      notes: 'Certificado de autenticidade incluso',
      items: {
        create: [{ product_id: 'prod-006', quantity: 1, unit_price: 4200.0 }],
      },
    },
  });

  const order5 = await prisma.order.upsert({
    where: { id: 'order-005' },
    update: {},
    create: {
      id: 'order-005',
      customer_id: customers[4].id,
      user_id: admin.id,
      status: 'cancelled',
      total: 2680.0,
      notes: 'Cliente cancelou — trocou pelo modelo em prata',
      items: {
        create: [
          { product_id: 'prod-007', quantity: 1, unit_price: 2200.0 },
          { product_id: 'prod-008', quantity: 1, unit_price: 480.0 },
        ],
      },
    },
  });

  console.log(`✅ ${[order1, order2, order3, order4, order5].length} pedidos criados`);

  console.log('\n✦ Seed concluído com sucesso!\n');
  console.log('  Usuários para login:');
  console.log('  ┌──────────────────────────────────────┬────────────────┬─────────┐');
  console.log('  │ E-mail                               │ Senha          │ Perfil  │');
  console.log('  ├──────────────────────────────────────┼────────────────┼─────────┤');
  console.log('  │ admin@luminajoias.com                │ admin123       │ admin   │');
  console.log('  │ vendedor@luminajoias.com             │ vendedor123    │ seller  │');
  console.log('  └──────────────────────────────────────┴────────────────┴─────────┘\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
