const express = require('express');
const ExpressAdater = require('@universal-adapter/express');
const helloPlug = require('../helloPlug');

module.exports = start();

function start() {
  const app = express();

  app.use(
    new ExpressAdater([
      helloPlug,
    ])
  );

  app.listen(3000, () => console.log('Express server running at http://localhost:3000'));
}
