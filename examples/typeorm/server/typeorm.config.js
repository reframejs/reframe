const {requireAll, requireContext} = require('./utils/requireAll');
require.context = requireContext;

const entities = requireAll(require.context("../models/entity", true, /\.ts$/));
const migrations = requireAll(require.context("../models/migration", true, /\.ts$/));
const subscribers = requireAll(require.context("../models/subscriber", true, /\.ts$/));

module.exports = {
   type: "sqlite",
   database: "database.sqlite",
   synchronize: true,
   logging: true,
   /*
   entities,
   migrations,
   subscribers,
   cli: {
      entitiesDir: "./models/entity",
      migrationsDir: "./models/migration",
      subscribersDir: "./models/subscriber"
   }
   */
}
