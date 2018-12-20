const reset = require('./reset');

var databaseExists;
async function ensureDatabase() {
  if( databaseExists ) {
    return;
  }
  if( ! await fs.pathExists(__dirname+'/data.sqlite') ) {
    await reset();
  }
  databaseExists = true;
}
