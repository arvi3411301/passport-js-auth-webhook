// Update with your config settings.

const databaseName = "postgres"
const pg = require('pg')

module.exports = {
  client: 'pg',
  connection: `postgres://postgres:@localhost:5432/${databaseName}`,
  migrations: {
    directory: __dirname + '/db/migrations'
  }
};
