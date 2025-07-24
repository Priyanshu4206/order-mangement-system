import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class OrderRepository {
  async create({ tableId, items }) {
    return prisma.order.create({
      data: {
        tableId,
        status: 'pending',
        items: {
          create: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: { items: true },
    });
  }

  async getAll() {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
  }

  async updatePayment(id, { paymentStatus, paymentMethod, paymentTimestamp }) {
    return prisma.order.update({
      where: { id: Number(id) },
      data: { paymentStatus, paymentMethod, paymentTimestamp },
    });
  }

  async delete(id) {
    return prisma.order.delete({ where: { id: Number(id) } });
  }
}

export default new OrderRepository(); 