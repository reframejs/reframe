const fs = require('fs-extra');

module.exports = (async ()=>{
  const dbPath = __dirname+'/data.sqlite';
  await fs.remove(dbPath);
  await fs.ensureFile(dbPath);

  const knex = require('./knex');
  await knex.migrate.latest();
  await knex.seed.run();
  if( isCli() ) {
    await knex.destroy();
  }
})();


function isCli() {
  return require.main === module;
}
