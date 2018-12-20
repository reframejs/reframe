const fs = require('fs-extra');

if( isCli() ) {
  (async () => {
    const knex = await reset();
    await knex.destroy();
  })();
} else {
  module.exports = reset;
}

async function reset() {
  const dbPath = __dirname+'/data.sqlite';
  await fs.remove(dbPath);
  await fs.ensureFile(dbPath);

  const knex = require('./knex');

  await knex.migrate.latest();
  await knex.seed.run();

  return knex;
}

function isCli() {
  return require.main === module;
}
