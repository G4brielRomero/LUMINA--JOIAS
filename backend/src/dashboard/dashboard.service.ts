import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [totalOrders, revenue, lowStock, topProducts, salesByMonth] = await Promise.all([
      this.prisma.order.count({ where: { status: { not: OrderStatus.cancelled } } }),

      this.prisma.order.aggregate({
        where: { status: { not: OrderStatus.cancelled } },
        _sum: { total: true },
      }),

      this.prisma.product.findMany({
        where: { deleted_at: null, stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: 'asc' },
      }),

      this.prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),

      this.prisma.$queryRaw<{ month: string; total: number }[]>`
        SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, SUM(total)::float AS total
        FROM orders
        WHERE status != 'cancelled'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `,
    ]);

    const topProductIds = topProducts.map((p) => p.product_id);
    const topProductDetails = await this.prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });

    const topProductsWithDetails = topProducts.map((tp) => ({
      product: topProductDetails.find((p) => p.id === tp.product_id),
      total_sold: tp._sum.quantity,
    }));

    return {
      total_orders: totalOrders,
      total_revenue: Number(revenue._sum.total ?? 0),
      low_stock_products: lowStock,
      top_products: topProductsWithDetails,
      sales_by_month: salesByMonth,
    };
  }
}
