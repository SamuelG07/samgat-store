import prisma from '../lib/prisma';

export class ProductRepository {
  async findAll(params: { where?: any; skip?: number; take?: number; orderBy?: any }) {
    const { where, skip, take, orderBy } = params;
    return prisma.products.findMany({ where, skip, take, orderBy });
  }

  async count(where?: any) {
    return prisma.products.count({ where });
  }

  async findById(id: number) {
    return prisma.products.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return prisma.products.findUnique({ where: { slug } });
  }

  async create(data: any) {
    return prisma.products.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.products.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.products.delete({ where: { id } });
  }

  async exists(id: number): Promise<boolean> {
    const product = await prisma.products.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!product;
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const product = await prisma.products.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!product;
  }
}

export const productRepository = new ProductRepository();
