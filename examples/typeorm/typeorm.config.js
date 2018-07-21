module.exports = {
   "type": "sqlite",
   "database": "database.sqlite",
   "synchronize": true,
   "logging": false,
   "entities": (
      requireAll(require.context("./models/entity", true, /\.ts$/))
   ),
   "migrations": (
      requireAll(require.context("./models/migration", true, /\.ts$/))
   ),
   "subscribers": [
      requireAll(require.context("./models/subscriber", true, /\.ts$/))
   ],
   "cli": {
      "entitiesDir": "models/entity",
      "migrationsDir": "models/migration",
      "subscribersDir": "models/subscriber"
   }
}

function requireAll(r) {
    const modules = r.keys().map(key => {
     // console.log(key);
        return r(key).default;
    });
    console.log(modules);
    return modules;
}
