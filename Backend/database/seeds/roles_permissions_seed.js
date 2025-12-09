export async function seed(knex) {
  await knex("roles_permissions").del();

  const perms = await knex("permissions");

  const adminPerms = perms.map(p => ({
    role_id: 1,
    permission_id: p.id
  }));

  await knex("roles_permissions").insert(adminPerms);
}

