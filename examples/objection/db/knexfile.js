module.exports = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: require.resolve('./data.sqlite'),
  },
};
