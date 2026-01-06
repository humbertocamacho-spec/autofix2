export async function seed(knex) {
  await knex("modules").del();

  await knex("modules").insert([
    { id: 1, name: "Users" },
    { id: 2, name: "Partners" },
    { id: 3, name: "Specialities" },
    { id: 4, name: "Certifications" },
    { id: 5, name: "Products" },
    { id: 6, name: "Clients" },
    { id: 7, name: "Cars_Clients" },
    { id: 8, name: "Car_Brands" },
    { id: 9, name: "Tickets" },
    { id: 10, name: "Tickets Pending" },
    { id: 11, name: "Roles" },
    { id: 12, name: "Permissions" },
    { id: 13, name: "Modules" },
    { id: 14, name: "Admins" },
    { id: 16, name: "Partner_Certifications" },
  ]);
}
