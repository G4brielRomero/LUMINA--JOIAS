import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: dto.customer_id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');

    const productIds = dto.items.map((i) => i.product_id);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, deleted_at: null },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Um ou mais produtos não encontrados');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.product_id)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto "${product.name}"`);
      }
    }

    const total = dto.items.reduce((sum, item) => {
      const price = Number(productMap.get(item.product_id)!.price);
      return sum + price * item.quantity;
    }, 0);

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customer_id: dto.customer_id,
          user_id: userId,
          notes: dto.notes,
          total,
          items: {
            create: dto.items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: productMap.get(item.product_id)!.price,
            })),
          },
        },
        include: { items: { include: { product: true } }, customer: true },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return order;
  }

  async findAll(status?: OrderStatus, date?: string) {
    return this.prisma.order.findMany({
      where: {
        ...(status && { status }),
        ...(date && {
          created_at: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        }),
      },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.cancelled) {
      throw new BadRequestException('Pedido já cancelado não pode ser alterado');
    }
    if (order.status === OrderStatus.delivered && dto.status !== OrderStatus.cancelled) {
      throw new BadRequestException('Pedido entregue não pode ser alterado');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.notes && { notes: dto.notes }),
      },
    });
  }
}
