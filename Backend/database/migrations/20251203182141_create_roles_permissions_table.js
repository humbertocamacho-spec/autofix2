export function up(knex) {
  return knex.schema.createTable("roles_permissions", table => {
    table.increments("id");

    // role_id: roles.id es int normal (no unsigned)
    table
      .integer("role_id")
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE");

    // permission_id: permissions.id es int unsigned
    table
      .integer("permission_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("permissions")
      .onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("roles_permissions");
}
