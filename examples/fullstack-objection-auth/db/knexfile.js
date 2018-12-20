const path = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname)+'/data.sqlite',
  },
  seeds: {
    directory: path.resolve(__dirname)+'/seeds',
  },
  migrations: {
    directory: path.resolve(__dirname)+'/migrations',
  },
  useNullAsDefault: true,
};
