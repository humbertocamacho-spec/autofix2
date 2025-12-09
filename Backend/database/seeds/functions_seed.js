export async function seed(knex) {
  await knex("functions").del();

  await knex("functions").insert([
    { id: 1, name: "create", description: "Permite crear recursos" },
    { id: 2, name: "read", description: "Permite ver recursos" },
    { id: 3, name: "update", description: "Permite editar recursos" },
    { id: 4, name: "delete", description: "Permite eliminar recursos" },
  ]);
}
