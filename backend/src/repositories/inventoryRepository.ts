import prisma from '../lib/prisma';

export class InventoryRepository {
  async findByProductId(productId: number) {
    return prisma.inventory.findFirst({
      where: { product_id: productId },
    });
  }

  async getAvailableStock(productId: number): Promise<number> {
    const inventory = await prisma.inventory.findFirst({
      where: { product_id: productId },
      select: { quantity: true },
    });
    return inventory?.quantity || 0;
  }

  async hasStock(productId: number, quantity: number): Promise<boolean> {
    const available = await this.getAvailableStock(productId);
    return available >= quantity;
  }
}

export const inventoryRepository = new InventoryRepository();
