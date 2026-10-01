import prisma from '../lib/prisma';
import { orderRepository } from '../repositories/orderRepository';
import { cartRepository } from '../repositories/cartRepository';
import { productRepository } from '../repositories/productRepository';
import { inventoryRepository } from '../repositories/inventoryRepository';
import { AppError } from '../utils/errorHandler';
import { OrderQueryInput } from '../validations/orderSchemas';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: any;
}

export class OrderService {
  async checkout(userId: number) {
    try {
      const cart = await cartRepository.findByUserId(userId);
      if (!cart || cart.cart_items.length === 0) {
        throw new AppError({
          message: 'Carrinho vazio',
          statusCode: 400,
          code: 'CART_EMPTY',
        });
      }

      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.cart_items) {
        const productId = cartItem.product_id;
        const quantity = cartItem.quantity;

        const product = await productRepository.findById(productId);
        if (!product) {
          throw new AppError({
            message: `Produto ID ${productId} não encontrado`,
            statusCode: 404,
            code: 'PRODUCT_NOT_FOUND',
          });
        }

        if (!product.is_active) {
          throw new AppError({
            message: `Produto "${product.name}" não está disponível`,
            statusCode: 400,
            code: 'PRODUCT_NOT_AVAILABLE',
          });
        }

        const hasStock = await inventoryRepository.hasStock(productId, quantity);
        if (!hasStock) {
          const available = await inventoryRepository.getAvailableStock(productId);
          throw new AppError({
            message: `Estoque insuficiente para "${product.name}". Disponível: ${available}`,
            statusCode: 400,
            code: 'INSUFFICIENT_STOCK',
          });
        }

        const subtotal = Number(product.price) * quantity;
        total += subtotal;

        orderItems.push({
          productId,
          quantity,
          price: Number(product.price),
          subtotal,
          product,
        });
      }

      let order;

      try {
        order = await prisma.$transaction(async (tx) => {
          const newOrder = await tx.orders.create({
            data: {
              user_id: userId,
              total: total,
              status: 'PENDING',
              payment_status: 'PENDING',
            },
          });

          for (const item of orderItems) {
            await tx.order_items.create({
              data: {
                order_id: newOrder.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
              },
            });
          }

          for (const item of orderItems) {
            const productId = item.productId;
            const quantity = item.quantity;

            const currentInventory = await tx.inventory.findFirst({
              where: { product_id: productId },
            });

            if (!currentInventory || currentInventory.quantity < quantity) {
              throw new AppError({
                message: `Estoque insuficiente para produto ID ${productId}`,
                statusCode: 400,
                code: 'INSUFFICIENT_STOCK',
              });
            }

            await tx.inventory.update({
              where: { id: currentInventory.id },
              data: {
                quantity: currentInventory.quantity - quantity,
                updated_at: new Date(),
              },
            });

            // ✅ ENUM CORRETO: OUT (não SALE)
            await tx.stock_movements.create({
              data: {
                product_id: productId,
                quantity: quantity,
                type: 'OUT',
                reason: `Venda - Pedido #${newOrder.id}`,
              },
            });
          }

          await tx.cart_items.deleteMany({
            where: { cart_id: cart.id },
          });

          return newOrder;
        });
      } catch (error) {
        console.error('Erro na transação:', error);
        throw error;
      }

      const orderWithDetails = await orderRepository.findById(order.id);

      return {
        order: orderWithDetails,
        items: orderItems,
        total: total,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro no checkout:', error);
      throw new AppError({
        message: 'Erro ao processar pedido',
        statusCode: 500,
        code: 'ORDER_PROCESSING_ERROR',
      });
    }
  }

  async getOrders(userId: number, query: OrderQueryInput) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const { orders, total } = await orderRepository.findByUserId(userId, skip, limit);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({
        message: 'Pedido não encontrado',
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
      });
    }

    if (order.user_id !== userId) {
      throw new AppError({
        message: 'Acesso negado',
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    return order;
  }

  async getOrderCount(userId: number) {
    return orderRepository.countByUserId(userId);
  }
}

export const orderService = new OrderService();
