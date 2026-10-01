const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.users.findUnique({
    where: { email: 'samuel@teste.com' },
    select: { id: true, email: true, role: true },
  });
  console.log(user);
  await prisma.$disconnect();
}

check();
