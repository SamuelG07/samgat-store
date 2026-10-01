const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const products = await prisma.products.findMany({
    include: { inventory: true },
  });

  let criados = 0;
  for (const p of products) {
    if (!p.inventory) {
      await prisma.inventory.create({
        data: { product_id: p.id, quantity: 0 },
      });
      criados++;
      console.log('Inventory criado para:', p.id, p.name);
    }
  }

  console.log('Total:', criados, 'inventories criados');
  await prisma.$disconnect();
}

fix().catch((e) => {
  console.error(e);
  process.exit(1);
});
