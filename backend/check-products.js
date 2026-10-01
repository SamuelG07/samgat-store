const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.products.findMany({
    orderBy: { id: 'desc' },
    take: 5,
    select: { id: true, name: true, description: true, created_at: true },
  });
  console.table(products);
  await prisma.$disconnect();
}

check();
