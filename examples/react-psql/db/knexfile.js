/*

// corresponds to; `psql postgresql://user:password@host:port/database`
const connection = {
  host     : 'localhost',
  port     : '5432',
  user     : 'postgres',
  password : env.POSTGRES_PASSWORD,
  database : 'reframe-psql-example',
  charset  : 'UTF8_GENERAL_CI',
};

module.exports = {
  client: 'pg',
  connection,
};

/*/

const path = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname)+'/data.sqlite',
  },
  useNullAsDefault: true,
};

//*/
