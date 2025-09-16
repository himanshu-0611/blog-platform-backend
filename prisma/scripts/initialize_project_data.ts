import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Cleanup
  await prisma.roles_scopes.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.scopes.deleteMany();
  await prisma.posts.deleteMany();   // 👈 delete posts first
  await prisma.users.deleteMany();

  console.log('Cleaned existing records');

  // 2. Scopes
  const deleteUserScope = await prisma.scopes.create({
    data: {
      action: 'DELETE',
      module: 'users',
      scope_text: 'delete_user',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  const promoteUserScope = await prisma.scopes.create({
    data: {
      action: 'PROMOTE',
      module: 'users',
      scope_text: 'promote_user',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  // 🔑 new change role scope
  const changeUserRoleScope = await prisma.scopes.create({
    data: {
      action: 'CHANGE_ROLE',
      module: 'users',
      scope_text: 'change_role',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  const addPostScope = await prisma.scopes.create({
    data: {
      action: 'ADD',
      module: 'posts',
      scope_text: 'add_post',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  // 🔑 new scopes for posts deletion
  const deleteAnyPostScope = await prisma.scopes.create({
    data: {
      action: 'DELETE',
      module: 'posts',
      scope_text: 'delete_any_post',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  const deleteOwnPostScope = await prisma.scopes.create({
    data: {
      action: 'DELETE',
      module: 'posts',
      scope_text: 'delete_own_post',
      created_on: new Date(),
      created_by: 'system',
    },
  });

  console.log('Created scopes');

  // 3. Roles
  const memberRole = await prisma.roles.create({
    data: { role_name: 'Member', created_by: 'system' },
  });

  const superUserRole = await prisma.roles.create({
    data: { role_name: 'Super User', created_by: 'system' },
  });

  console.log('Created roles:', memberRole, superUserRole);

  // 4. Role → Scope mapping
  await prisma.roles_scopes.createMany({
    data: [
      // Super User
      { role_id: superUserRole.id, scope_id: deleteUserScope.id, created_by: 'system' },
      { role_id: superUserRole.id, scope_id: promoteUserScope.id, created_by: 'system' },
      { role_id: superUserRole.id, scope_id: changeUserRoleScope.id, created_by: 'system' }, // 👈 new scope mapping
      { role_id: superUserRole.id, scope_id: addPostScope.id, created_by: 'system' },
      { role_id: superUserRole.id, scope_id: deleteAnyPostScope.id, created_by: 'system' },
      { role_id: superUserRole.id, scope_id: deleteOwnPostScope.id, created_by: 'system' },

      // Member
      { role_id: memberRole.id, scope_id: addPostScope.id, created_by: 'system' },
      { role_id: memberRole.id, scope_id: deleteOwnPostScope.id, created_by: 'system' },
    ],
  });

  console.log('Mapped roles to scopes');

  // 5. Create Super User user
  const hashedPassword = await bcrypt.hash('123456', 10);

  const superUser = await prisma.users.create({
    data: {
      name: 'Super User',
      email: 'superuser@gmail.com',
      password: hashedPassword,
      role_id: superUserRole.id,
      is_active: true,
      is_archive: false,
      created_on: new Date(),
      created_by: 'system',
      updated_by: 'system',
    },
  });

  console.log('Created Super User:', superUser);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
