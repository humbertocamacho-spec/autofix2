export async function seed(knex) {
  await knex("permissions").del();

  const modulesCrud = [1,2,3,4,5,6,7,8,9,10]; 
  const readOnlyModules = [11,12,13];

  const permissions = [];

  // CRUD modules
  modulesCrud.forEach((moduleId) => {
    permissions.push({ name: `create_${moduleId}`, module_id: moduleId });
    permissions.push({ name: `read_${moduleId}`, module_id: moduleId });
    permissions.push({ name: `update_${moduleId}`, module_id: moduleId });
    permissions.push({ name: `delete_${moduleId}`, module_id: moduleId });
  });

  // Only read modules
  readOnlyModules.forEach((moduleId) => {
    permissions.push({ name: `read_${moduleId}`, module_id: moduleId });
  });

  await knex("permissions").insert(permissions);
}
