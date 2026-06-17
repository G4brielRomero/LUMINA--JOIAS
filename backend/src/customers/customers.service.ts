import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findFirst({
      where: { OR: [{ cpf: dto.cpf }, { email: dto.email }] },
    });
    if (existing) {
      throw new ConflictException('CPF ou e-mail já cadastrado');
    }
    return this.prisma.customer.create({ data: dto });
  }

  async findAll(search?: string) {
    return this.prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { cpf: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Cliente não encontrado');
    return customer;
  }

  async findOrders(id: string) {
    await this.findOne(id);
    return this.prisma.order.findMany({
      where: { customer_id: id },
      include: { items: { include: { product: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    const hasOrders = await this.prisma.order.findFirst({ where: { customer_id: id } });
    if (hasOrders) {
      throw new BadRequestException('Não é possível excluir cliente com pedidos');
    }
    return this.prisma.customer.delete({ where: { id } });
  }
}
