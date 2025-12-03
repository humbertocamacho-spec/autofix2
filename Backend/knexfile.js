export default {
  development: {
    client: 'mysql2',
    connection: {
      host: 'hopper.proxy.rlwy.net', // host público de Railway
      port: 26627,                   // puerto público de Railway
      user: 'root',                  // tu usuario
      password: 'XxVkKtWmhxRXclsruWISzhslwGgWoKQd', // tu contraseña
      database: 'railway'            // tu base de datos
    },
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
  },
  staging: {
    client: 'mysql2',
    connection: {
      host: 'hopper.proxy.rlwy.net',
      port: 26627,
      user: 'root',
      password: 'XxVkKtWmhxRXclsruWISzhslwGgWoKQd',
      database: 'railway'
    },
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations', directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'hopper.proxy.rlwy.net',
      port: 26627,
      user: 'root',
      password: 'XxVkKtWmhxRXclsruWISzhslwGgWoKQd',
      database: 'railway'
    },
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations', directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
  }
};
