const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.users.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  console.table(users);
  await prisma.$disconnect();
}

check();
