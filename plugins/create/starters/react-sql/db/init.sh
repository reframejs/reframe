rm -f data.sqlite
touch data.sqlite
knex migrate:latest
knex seed:run
