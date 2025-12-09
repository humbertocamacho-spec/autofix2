export function up(knex) {
  return knex.schema.createTable("functions", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").nullable();
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("functions");
}
