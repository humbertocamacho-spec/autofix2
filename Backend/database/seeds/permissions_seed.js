export async function seed(knex) {
  await knex("permissions").del();

  const modules = await knex("modules");
  const functions = await knex("functions");

  const permissions = [];

  modules.forEach((m) => {
    const moduleName = m.name.toLowerCase();

    functions.forEach((f) => {
      permissions.push({
        name: `${f.name}_${moduleName}`,
        module_id: m.id,
        function_id: f.id,
      });
    });
  });

  await knex("permissions").insert(permissions);
}
