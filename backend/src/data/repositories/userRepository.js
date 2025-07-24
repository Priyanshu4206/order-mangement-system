import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async create(data) {
    return prisma.user.create({ data });
  }
}

export default new UserRepository(); 