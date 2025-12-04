export async function seed(knex) {
  await knex("modules").del();

  await knex("modules").insert([
    { id: 1, name: "Usuarios" },
    { id: 2, name: "Partners" },
    { id: 3, name: "Especialidades" },
    { id: 4, name: "Certificaciones" },
    { id: 5, name: "Productos" },
    { id: 6, name: "Clientes" },
    { id: 7, name: "Autos de Clientes" },
    { id: 8, name: "Marcas de Autos" },
    { id: 9, name: "Tickets" },
    { id: 10, name: "Tickets Pendientes" },
    { id: 11, name: "Roles" },
    { id: 12, name: "Permisos" },
    { id: 13, name: "Módulos" },
  ]);
}
