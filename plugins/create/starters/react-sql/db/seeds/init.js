exports.seed = initialSeed;

exports.initialSeed = initialSeed;

async function initialSeed(knex) {
  await knex('persons').del();
  await knex('persons').insert([
    {id: 1, name: 'Romuald Brillout'},
  ]);

  await knex('animals').del();
  await knex('animals').insert([
    {id: 1, name: 'Casper', species: 'hamster', ownerId: 1},
    {id: 2, name: 'Pinky', species: 'rabbit', ownerId: 1},
  ]);
}
