import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MenuRepository {
  async getAll() {
    return prisma.menuItem.findMany();
  }

  async getById(id) {
    return prisma.menuItem.findUnique({ where: { id: Number(id) } });
  }

  async create(data) {
    return prisma.menuItem.create({ data });
  }

  async update(id, data) {
    return prisma.menuItem.update({ where: { id: Number(id) }, data });
  }

  async delete(id) {
    return prisma.menuItem.delete({ where: { id: Number(id) } });
  }
}

export default new MenuRepository(); 