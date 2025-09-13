import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const scope = await prisma.scopes.create({
    data: {
      action: 'DELETE',
      module: 'users',
      scope_text: 'delete_user',
      created_on: new Date(),
    },
  });

  console.log('Created scope:', scope);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
