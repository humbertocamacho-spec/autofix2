export function up(knex) {
  return knex.schema.createTable("modules", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("parent_id").unsigned().nullable().references("id").inTable("modules").onDelete("SET NULL"); 
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("modules");
}