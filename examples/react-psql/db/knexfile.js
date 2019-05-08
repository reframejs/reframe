//*

// corresponds to; `psql postgresql://user:password@host:port/database`
const password = process.env.POSTGRES_PASSWORD;
const connection = {
  host     : 'localhost',
  port     : '5432',
  user     : 'postgres',
  password,
  database : 'reframe_example',
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
