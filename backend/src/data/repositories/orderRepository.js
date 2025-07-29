import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class OrderRepository {
  generateOrderId() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    return `ORD${dateStr}${randomSuffix}`;
  }

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
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
    });
  }

  async getAll() {
    return prisma.order.findMany({
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    return prisma.order.findUnique({
      where: { id: Number(id) },
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
    });
  }

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
    });
  }

  async updatePayment(id, { paymentStatus, paymentMethod, paymentTimestamp }) {
    return prisma.order.update({
      where: { id: Number(id) },
      data: { paymentStatus, paymentMethod, paymentTimestamp },
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
    });
  }

  async delete(id) {
    // With the updated schema, this should now work with cascade delete
    return prisma.order.delete({ 
      where: { id: Number(id) },
      include: { 
        items: {
          include: {
            menuItem: true
          }
        }
      },
    });
  }
}

export default new OrderRepository(); 