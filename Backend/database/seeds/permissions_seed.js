export async function seed(knex) {
  await knex("permissions").del();

  const crudModules = [1,2,3,4,5,6,7,8,9,10];
  const readOnlyModules = [11,12,13];

  const permissions = [];

  crudModules.forEach(moduleId => {
    ["create", "read", "update", "delete"].forEach(action => {
      permissions.push({ name: `${action}_${moduleId}`, module_id: moduleId });
    });
  });

  readOnlyModules.forEach(moduleId => {
    permissions.push({ name: `read_${moduleId}`, module_id: moduleId });
  });

  await knex("permissions").insert(permissions);
}
