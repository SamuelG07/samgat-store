import prisma from '../lib/prisma';

export class CategoryRepository {
  async findAll() {
    return prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.categories.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.categories.findUnique({
      where: { slug },
    });
  }

  async create(data: { name: string; slug: string; description?: string | null }) {
    return prisma.categories.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; slug?: string; description?: string | null }) {
    return prisma.categories.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.categories.delete({
      where: { id },
    });
  }

  async exists(id: number): Promise<boolean> {
    const category = await prisma.categories.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!category;
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const category = await prisma.categories.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!category;
  }
}

export const categoryRepository = new CategoryRepository();
