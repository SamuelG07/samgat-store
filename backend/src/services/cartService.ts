import { cartRepository } from '../repositories/cartRepository';
import { productRepository } from '../repositories/productRepository';
import { inventoryRepository } from '../repositories/inventoryRepository';
import { AppError } from '../utils/errorHandler';
import { AddToCartInput, UpdateCartItemInput } from '../validations/cartSchemas';

export class CartService {
  async getCart(userId: number) {
    const cart = await cartRepository.findOrCreateByUserId(userId);

    // Calcular totais
    const items = cart.cart_items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      product: item.products,
      subtotal: item.quantity * item.products.price,
    }));

    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      items,
      totalItems,
      subtotal,
    };
  }

  async addItem(userId: number, data: AddToCartInput) {
    const { productId, quantity } = data;

    // Verificar se o produto existe e está ativo
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError({
        message: 'Produto não encontrado',
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (!product.is_active) {
      throw new AppError({
        message: 'Produto não está disponível',
        statusCode: 400,
        code: 'PRODUCT_NOT_AVAILABLE',
      });
    }

    // Verificar estoque
    const hasStock = await inventoryRepository.hasStock(productId, quantity);
    if (!hasStock) {
      throw new AppError({
        message: 'Quantidade indisponível em estoque',
        statusCode: 400,
        code: 'INSUFFICIENT_STOCK',
      });
    }

    // Obter ou criar carrinho
    const cart = await cartRepository.findOrCreateByUserId(userId);

    // Verificar se o produto já está no carrinho
    const existingItem = await cartRepository.findCartItem(cart.id, productId);

    if (existingItem) {
      // Atualizar quantidade
      const newQuantity = existingItem.quantity + quantity;
      
      // Verificar estoque novamente para a nova quantidade
      const hasStockForUpdate = await inventoryRepository.hasStock(productId, newQuantity);
      if (!hasStockForUpdate) {
        throw new AppError({
          message: 'Quantidade total indisponível em estoque',
          statusCode: 400,
          code: 'INSUFFICIENT_STOCK',
        });
      }

      const updatedItem = await cartRepository.updateItem(existingItem.id, newQuantity);
      return this.getCart(userId);
    }

    // Adicionar novo item
    await cartRepository.addItem(cart.id, productId, quantity);
    return this.getCart(userId);
  }

  async updateItem(userId: number, itemId: number, data: UpdateCartItemInput) {
    const { quantity } = data;

    // Verificar se o item existe e pertence ao usuário
    const item = await cartRepository.getItemById(itemId);
    if (!item) {
      throw new AppError({
        message: 'Item não encontrado',
        statusCode: 404,
        code: 'CART_ITEM_NOT_FOUND',
      });
    }

    // Verificar se o item pertence ao carrinho do usuário
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || item.cart_id !== cart.id) {
      throw new AppError({
        message: 'Item não pertence ao seu carrinho',
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    // Se quantidade for 0, remover o item
    if (quantity === 0) {
      await cartRepository.removeItem(itemId);
      return this.getCart(userId);
    }

    // Verificar estoque
    const hasStock = await inventoryRepository.hasStock(item.product_id, quantity);
    if (!hasStock) {
      throw new AppError({
        message: 'Quantidade indisponível em estoque',
        statusCode: 400,
        code: 'INSUFFICIENT_STOCK',
      });
    }

    // Atualizar item
    await cartRepository.updateItem(itemId, quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    // Verificar se o item existe e pertence ao usuário
    const item = await cartRepository.getItemById(itemId);
    if (!item) {
      throw new AppError({
        message: 'Item não encontrado',
        statusCode: 404,
        code: 'CART_ITEM_NOT_FOUND',
      });
    }

    // Verificar se o item pertence ao carrinho do usuário
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || item.cart_id !== cart.id) {
      throw new AppError({
        message: 'Item não pertence ao seu carrinho',
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    await cartRepository.removeItem(itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      return {
        id: 0,
        items: [],
        totalItems: 0,
        subtotal: 0,
      };
    }

    await cartRepository.clearCart(cart.id);
    return this.getCart(userId);
  }
}

export const cartService = new CartService();
