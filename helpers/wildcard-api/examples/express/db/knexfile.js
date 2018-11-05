module.exports = {
  client: 'sqlite3',
  connection: {
    filename: require.resolve('./data.sqlite'),
  },
  useNullAsDefault: true,
};
