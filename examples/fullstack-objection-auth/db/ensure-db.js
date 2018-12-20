const fs = require('fs-extra');
const reset = require('./reset');

module.exports = ensureDb;

let databaseExists;
async function ensureDb() {
  if( databaseExists ) {
    return;
  }
  if( ! await fs.pathExists(__dirname+'/data.sqlite') ) {
    await reset();
  }
  databaseExists = true;
}
