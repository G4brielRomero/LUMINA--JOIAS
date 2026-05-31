import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async findAll(material?: string, name?: string) {
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        ...(material && { material: { contains: material, mode: 'insensitive' } }),
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deleted_at: null },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
