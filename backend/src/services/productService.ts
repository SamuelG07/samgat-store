import prisma from '../lib/prisma';
import { productRepository } from '../repositories/productRepository';
import { categoryRepository } from '../repositories/categoryRepository';
import { AppError } from '../utils/errorHandler';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validations/productSchemas';
import { generateSlug } from '../utils/slug';

export class ProductService {
  async findAll(query: ProductQueryInput, includeInactive: boolean = false) {
    const { page, limit, search, category, sort } = query;

    const where: any = {};

    if (!includeInactive) {
      where.is_active = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category_id = category;
    }

    let orderBy: any = { created_at: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productRepository.findAll({ where, skip, take: limit, orderBy }),
      productRepository.count(where),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number, includeInactive: boolean = false) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (!includeInactive && !product.is_active) {
      throw new AppError({
        message: 'Produto não disponível',
        statusCode: 404,
        code: 'PRODUCT_NOT_AVAILABLE',
      });
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const categoryExists = await categoryRepository.exists(data.categoryId);
    if (!categoryExists) {
      throw new AppError({
        message: 'Categoria não encontrada',
        statusCode: 404,
        code: 'CATEGORY_NOT_FOUND',
      });
    }

    const slug = data.slug || generateSlug(data.name);

    const slugExists = await productRepository.slugExists(slug);
    if (slugExists) {
      throw new AppError({
        message: 'Slug já está em uso',
        statusCode: 409,
        code: 'SLUG_ALREADY_EXISTS',
      });
    }

    const initialStock = data.initialStock ?? 0;

    // ✅ TRANSAÇÃO: criar produto + inventory + stock_movement
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar produto
      const product = await tx.products.create({
        data: {
          name: data.name,
          slug: slug,
          description: data.description || null,
          price: data.price,
          category_id: data.categoryId,
          image_url: data.imageUrl || null,
          is_active: data.isActive ?? true,
        },
      });

      // 2. Criar inventory (sempre, mesmo que 0)
      await tx.inventory.create({
        data: {
          product_id: product.id,
          quantity: initialStock,
        },
      });

      // 3. Se stock inicial > 0, criar movimentação
      if (initialStock > 0) {
        await tx.stock_movements.create({
          data: {
            product_id: product.id,
            quantity: initialStock,
            type: 'IN',
            reason: 'Stock inicial na criação do produto',
          },
        });
      }

      return product;
    });

    return productRepository.findById(result.id);
  }

  async update(id: number, data: UpdateProductInput) {
    await this.findById(id, true);

    if (data.categoryId) {
      const categoryExists = await categoryRepository.exists(data.categoryId);
      if (!categoryExists) {
        throw new AppError({
          message: 'Categoria não encontrada',
          statusCode: 404,
          code: 'CATEGORY_NOT_FOUND',
        });
      }
    }

    if (data.slug) {
      const slugExists = await productRepository.slugExists(data.slug, id);
      if (slugExists) {
        throw new AppError({
          message: 'Slug já está em uso',
          statusCode: 409,
          code: 'SLUG_ALREADY_EXISTS',
        });
      }
    }

    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
      const slugExists = await productRepository.slugExists(data.slug, id);
      if (slugExists) {
        throw new AppError({
          message: 'Slug já está em uso',
          statusCode: 409,
          code: 'SLUG_ALREADY_EXISTS',
        });
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    // Nota: initialStock NÃO é usado no update (stock só muda pelo módulo Inventory)

    return productRepository.update(id, updateData);
  }

  async delete(id: number) {
    await this.findById(id, true);
    return productRepository.update(id, { is_active: false });
  }

  async findBySlug(slug: string, includeInactive: boolean = false) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (!includeInactive && !product.is_active) {
      throw new AppError({
        message: 'Produto não disponível',
        statusCode: 404,
        code: 'PRODUCT_NOT_AVAILABLE',
      });
    }

    return product;
  }
}

export const productService = new ProductService();
