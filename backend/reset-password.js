const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2] || 'samuel@teste.com';
  const newPassword = process.argv[3] || 'Test1234!';

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('✅ Senha redefinida com sucesso!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nova senha: ${newPassword}`);
    console.log(`   Role: ${user.role}`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
