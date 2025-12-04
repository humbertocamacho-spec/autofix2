export async function seed(knex) {
  await knex("roles_permissions").del();

  const allPermissions = await knex("permissions").pluck("id");

  // ADMIN = todos los permisos
  const adminAssignments = allPermissions.map(permissionId => ({
    role_id: 1,
    permission_id: permissionId
  }));

  // PARTNER
  const partnerPermissions = [5, 7, 9, 11, 14, 3, 4];
  const partnerAssignments = partnerPermissions.map(permissionId => ({
    role_id: 2,
    permission_id: permissionId
  }));

  // CLIENT
  const clientPermissions = [8, 10, 13, 6, 2, 16, 3, 4];
  const clientAssignments = clientPermissions.map(permissionId => ({
    role_id: 3,
    permission_id: permissionId
  }));

  await knex("roles_permissions").insert([
    ...adminAssignments,
    ...partnerAssignments,
    ...clientAssignments
  ]);
}
