import prisma from '../lib/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return prisma.users.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: 'CUSTOMER' | 'ADMIN';
  }) {
    return prisma.users.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return prisma.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.users.delete({
      where: { id },
    });
  }

  async exists(email: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
}

export const userRepository = new UserRepository();
