const requireAll = require('./utils/requireAll');
console.log('af', require.bla);

console.log(2, require.context);
const entities = requireAll(require.context("./models/entity", true, /\.ts$/));
const migrations = requireAll(require.context("./models/migration", true, /\.ts$/));
const subscribers = requireAll(require.context("./models/subscriber", true, /\.ts$/));

module.exports = {
   type: "sqlite",
   database: "database.sqlite",
   synchronize: true,
   logging: false,
   entities,
   migrations,
   subscribers,
   cli: {
      entitiesDir: "./models/entity",
      migrationsDir: "./models/migration",
      subscribersDir: "./models/subscriber"
   }
}
