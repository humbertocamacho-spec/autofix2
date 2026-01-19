export async function up(knex) {
  return knex.schema.createTable("modules", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").nullable();
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("modules");
}
