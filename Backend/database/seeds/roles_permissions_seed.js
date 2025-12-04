export async function seed(knex) {
  await knex("roles_permissions").del();

  const permissions = await knex("permissions");

  const getPerms = (moduleIds, actions = ["create", "read", "update", "delete"]) =>
    permissions
      .filter(p => moduleIds.includes(p.module_id) && actions.some(a => p.name.startsWith(a)))
      .map(p => p.id);

  const adminPerms = permissions.map(p => p.id);

  const partnerPerms = [
    ...getPerms([5], ["create","read","update"]),         
    ...getPerms([9,10], ["read","update"]),            
    ...getPerms([3,4], ["read"]),                     
    ...getPerms([8], ["read"]),                        
    ...getPerms([7], ["read"]),                         
    ...getPerms([6], ["read"]),                          
    ...getPerms([2], ["read","update"]),              
  ];

  const clientPerms = [
    ...getPerms([7], ["read"]),                         
    ...getPerms([9,10], ["read"]),                       
    ...getPerms([8], ["read"]),                         
    ...getPerms([5], ["read"]),                          
    ...getPerms([2], ["read"]),                         
    ...getPerms([3], ["read"]),                      
  ];

  await knex("roles_permissions").insert([
    ...adminPerms.map(id => ({ role_id: 1, permission_id: id })),
    ...partnerPerms.map(id => ({ role_id: 2, permission_id: id })),
    ...clientPerms.map(id => ({ role_id: 3, permission_id: id })),
  ]);
}
