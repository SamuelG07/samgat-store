import prisma from '../lib/prisma';

export class CartRepository {
  async findOrCreateByUserId(userId: number) {
    // Verificar se o carrinho existe
    let cart = await prisma.carts.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
                is_active: true,
              },
            },
          },
        },
      },
    });

    // Se não existir, criar
    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
        include: {
          cart_items: {
            include: {
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image_url: true,
                  is_active: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async findByUserId(userId: number) {
    return prisma.carts.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
                is_active: true,
              },
            },
          },
        },
      },
    });
  }

  async findCartItem(cartId: number, productId: number) {
    return prisma.cart_items.findFirst({
      where: {
        cart_id: cartId,
        product_id: productId,
      },
    });
  }

  async addItem(cartId: number, productId: number, quantity: number) {
    return prisma.cart_items.create({
      data: {
        cart_id: cartId,
        product_id: productId,
        quantity,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            is_active: true,
          },
        },
      },
    });
  }

  async updateItem(itemId: number, quantity: number) {
    return prisma.cart_items.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            is_active: true,
          },
        },
      },
    });
  }

  async removeItem(itemId: number) {
    return prisma.cart_items.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: number) {
    return prisma.cart_items.deleteMany({
      where: { cart_id: cartId },
    });
  }

  async getItemById(itemId: number) {
    return prisma.cart_items.findUnique({
      where: { id: itemId },
      include: {
        carts: {
          select: {
            user_id: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            is_active: true,
          },
        },
      },
    });
  }
}

export const cartRepository = new CartRepository();
