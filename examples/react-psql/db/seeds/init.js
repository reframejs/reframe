exports.seed = initialSeed;

exports.initialSeed = initialSeed;

async function initialSeed(knex) {
  await knex('textSqlTable').del();
  await knex('textSqlTable').insert([
    {id: 1, content: 'An example entry 1'},
    {id: 2, content: 'A second entry'},
    {id: 3, content: 'A last one'},
  ]);
}
