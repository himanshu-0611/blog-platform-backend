import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Cleanup (delete in correct order due to foreign keys)
  await prisma.roles_scopes.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.scopes.deleteMany();

  console.log('Cleaned existing records');

  // 2. Create scope
  const deleteScope = await prisma.scopes.create({
    data: {
      action: 'DELETE',
      module: 'users',
      scope_text: 'delete_user',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  console.log('Created scope:', deleteScope);

  // 3. Create roles
  const memberRole = await prisma.roles.create({
    data: {
      role_name: 'Member',
      created_by: 'system',
    },
  });

  const superUserRole = await prisma.roles.create({
    data: {
      role_name: 'Super User',
      created_by: 'system',
    },
  });

  console.log('Created roles:', memberRole, superUserRole);

  // 4. Map Super User to delete_user scope
  const roleScope = await prisma.roles_scopes.create({
    data: {
      role_id: superUserRole.id,
      scope_id: deleteScope.id,
      created_by: 'system',
    },
  });

  console.log('Mapped Super User to delete_user scope:', roleScope);
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
