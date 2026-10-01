import prisma from '../lib/prisma';
import { adminRepository } from '../repositories/adminRepository';
import { productRepository } from '../repositories/productRepository';
import { inventoryRepository } from '../repositories/inventoryRepository';
import { orderRepository } from '../repositories/orderRepository';
import { AppError } from '../utils/errorHandler';
import { adminConfig, isValidStatusTransition, nonCancellableStatuses } from '../config/admin';
import {
  AdminProductQuery,
  AdminOrderQuery,
  AdminUserQuery,
  AdminInventoryQuery,
  AdminStockMovementQuery,
  StockInInput,
  StockAdjustInput,
} from '../validations/adminSchemas';

export class AdminService {
  // ===== DASHBOARD =====
  async getDashboard() {
    const [metrics, recentOrders, lowStockProducts] = await Promise.all([
      adminRepository.getDashboardMetrics(),
      adminRepository.getRecentOrders(5),
      adminRepository.getLowStockProducts(5),
    ]);

    return {
      metrics,
      recentOrders,
      lowStockProducts,
    };
  }

  // ===== PRODUCTS =====
  async getProducts(query: AdminProductQuery) {
    const { page, limit, search, category, status, lowStock, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status === 'active') where.is_active = true;
    if (status === 'inactive') where.is_active = false;

    if (category) where.category_id = category;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (sort === 'oldest') orderBy = { created_at: 'asc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'name_desc') orderBy = { name: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          categories: { select: { id: true, name: true, slug: true } },
          inventory: { select: { quantity: true } },
        },
      }),
      prisma.products.count({ where }),
    ]);

    // Filtrar por lowStock se solicitado
    let filteredProducts = products;
    if (lowStock) {
      filteredProducts = products.filter(
        (p: any) => (p.inventory?.quantity || 0) < adminConfig.lowStockThreshold
      );
    }

    return {
      data: filteredProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        categoryId: p.category_id,
        category: p.categories,
        imageUrl: p.image_url,
        isActive: p.is_active,
        stock: p.inventory?.quantity || 0,
        lowStock: (p.inventory?.quantity || 0) < adminConfig.lowStockThreshold,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async toggleProductStatus(productId: number, isActive: boolean) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    return productRepository.update(productId, { is_active: isActive });
  }

  // ===== INVENTORY =====
  async getInventory(query: AdminInventoryQuery) {
    const { page, limit, search, lowStock, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (lowStock) {
      where.quantity = { lt: adminConfig.lowStockThreshold };
    }

    if (search) {
      where.products = {
        name: { contains: search, mode: 'insensitive' },
      };
    }

    let orderBy: any = { quantity: 'asc' };
    if (sort === 'quantity_desc') orderBy = { quantity: 'desc' };
    if (sort === 'newest') orderBy = { updated_at: 'desc' };

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              image_url: true,
              is_active: true,
            },
          },
        },
      }),
      prisma.inventory.count({ where }),
    ]);

    return {
      data: items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        product: item.products,
        quantity: item.quantity,
        lowStock: item.quantity < adminConfig.lowStockThreshold,
        updatedAt: item.updated_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async stockIn(productId: number, data: StockInInput, adminId: number) {
    // Verificar produto
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    // Transação: atualizar inventory + registrar movimentação
    const result = await prisma.$transaction(async (tx) => {
      // Buscar ou criar inventory
      let inventory = await tx.inventory.findFirst({
        where: { product_id: productId },
      });

      if (!inventory) {
        inventory = await tx.inventory.create({
          data: {
            product_id: productId,
            quantity: 0,
          },
        });
      }

      // Atualizar inventory
      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: inventory.quantity + data.quantity,
          updated_at: new Date(),
        },
      });

      // Registrar movimentação
      const movement = await tx.stock_movements.create({
        data: {
          product_id: productId,
          type: 'IN',
          quantity: data.quantity,
          reason: data.reason || `Entrada de stock por admin #${adminId}`,
        },
      });

      return { inventory: updatedInventory, movement };
    });

    return {
      productId,
      newQuantity: result.inventory.quantity,
      movement: result.movement,
    };
  }

  async stockAdjust(productId: number, data: StockAdjustInput, adminId: number) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      let inventory = await tx.inventory.findFirst({
        where: { product_id: productId },
      });

      if (!inventory) {
        inventory = await tx.inventory.create({
          data: {
            product_id: productId,
            quantity: 0,
          },
        });
      }

      // Verificar se o ajuste não vai deixar negativo
      const newQuantity = inventory.quantity + data.quantity;
      if (newQuantity < 0) {
        throw new AppError({
          message: `Ajuste resultaria em estoque negativo. Atual: ${inventory.quantity}, ajuste: ${data.quantity}`,
          statusCode: 400,
          code: 'INVALID_ADJUSTMENT',
        });
      }

      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: newQuantity,
          updated_at: new Date(),
        },
      });

      const movement = await tx.stock_movements.create({
        data: {
          product_id: productId,
          type: 'ADJUSTMENT',
          quantity: data.quantity,
          reason: `${data.reason} (admin #${adminId})`,
        },
      });

      return { inventory: updatedInventory, movement };
    });

    return {
      productId,
      newQuantity: result.inventory.quantity,
      movement: result.movement,
    };
  }

  async getStockMovements(query: AdminStockMovementQuery) {
    const { page, limit, productId, type, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (productId) where.product_id = productId;
    if (type) where.type = type;

    const orderBy: any = sort === 'oldest' ? { created_at: 'asc' } : { created_at: 'desc' };

    const [movements, total] = await Promise.all([
      prisma.stock_movements.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.stock_movements.count({ where }),
    ]);

    return {
      data: movements.map((m: any) => ({
        id: m.id,
        productId: m.product_id,
        product: m.products,
        type: m.type,
        quantity: m.quantity,
        reason: m.reason,
        createdAt: m.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===== ORDERS =====
  async getOrders(query: AdminOrderQuery) {
    const { page, limit, status, paymentStatus, search, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.payment_status = paymentStatus;

    if (search) {
      where.OR = [
        { users: { name: { contains: search, mode: 'insensitive' } } },
        { users: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (sort === 'oldest') orderBy = { created_at: 'asc' };
    if (sort === 'total_asc') orderBy = { total: 'asc' };
    if (sort === 'total_desc') orderBy = { total: 'desc' };

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
          order_items: {
            include: {
              products: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),
      prisma.orders.count({ where }),
    ]);

    return {
      data: orders.map((o: any) => ({
        id: o.id,
        userId: o.user_id,
        user: o.users,
        status: o.status,
        paymentStatus: o.payment_status,
        total: Number(o.total),
        itemsCount: o.order_items.length,
        items: o.order_items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          product: item.products,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: number) {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
        order_items: {
          include: {
            products: {
              select: { id: true, name: true, slug: true, image_url: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError({
        message: 'Pedido não encontrado',
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
      });
    }

    return order;
  }

  async updateOrderStatus(orderId: number, newStatus: string) {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError({
        message: 'Pedido não encontrado',
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Validar transição
    if (!isValidStatusTransition(order.status, newStatus)) {
      throw new AppError({
        message: `Transição inválida: ${order.status} → ${newStatus}`,
        statusCode: 400,
        code: 'INVALID_STATUS_TRANSITION',
      });
    }

    // Se for cancelamento, verificar se pode cancelar
    if (newStatus === 'CANCELLED') {
      if (nonCancellableStatuses.includes(order.status)) {
        throw new AppError({
          message: `Pedido em status ${order.status} não pode ser cancelado`,
          statusCode: 400,
          code: 'CANNOT_CANCEL',
        });
      }
    }

    // Atualizar status
    const updated = await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: newStatus as any,
        updated_at: new Date(),
      },
    });

    // Se cancelado, devolver stock
    if (newStatus === 'CANCELLED') {
      await this.restoreStockForOrder(orderId);
    }

    return updated;
  }

  private async restoreStockForOrder(orderId: number) {
    const orderItems = await prisma.order_items.findMany({
      where: { order_id: orderId },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        const inventory = await tx.inventory.findFirst({
          where: { product_id: item.product_id },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: inventory.quantity + item.quantity,
              updated_at: new Date(),
            },
          });

          await tx.stock_movements.create({
            data: {
              product_id: item.product_id,
              type: 'IN',
              quantity: item.quantity,
              reason: `Devolução - Pedido #${orderId} cancelado`,
            },
          });
        }
      }
    });
  }

  async updatePaymentStatus(orderId: number, newStatus: string) {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError({
        message: 'Pedido não encontrado',
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
      });
    }

    return prisma.orders.update({
      where: { id: orderId },
      data: {
        payment_status: newStatus as any,
        updated_at: new Date(),
      },
    });
  }

  // ===== USERS =====
  async getUsers(query: AdminUserQuery) {
    const { page, limit, search, role, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (sort === 'oldest') orderBy = { created_at: 'asc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'name_desc') orderBy = { name: 'desc' };

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.users.count({ where }),
    ]);

    return {
      data: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        ordersCount: u._count.orders,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: number) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        orders: {
          take: 10,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            status: true,
            total: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError({
        message: 'Usuário não encontrado',
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    return user;
  }
}

export const adminService = new AdminService();
