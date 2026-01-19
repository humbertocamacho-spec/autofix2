export async function up(knex) {
  return knex.schema.createTable("permissions", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").nullable();

    table
      .integer("module_id")
      .unsigned()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE");

    table
      .integer("function_id")
      .unsigned()
      .references("id")
      .inTable("functions")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("permissions");
}
