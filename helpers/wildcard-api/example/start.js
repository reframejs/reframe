const express = require('express');
const {getApiResponse} = require('../');
require('./api/view-endpoints');
require('./api/generic-endpoints');

start();

async function start() {
  const app = express();

  app.all('/wildcard/*' , async(req, res, next) => {
    const {method, url, headers} = req;
    const apiResponse = await getApiResponse({method, url, headers});

    if( apiResponse ) {
      res.status(apiResponse.statusCode);
      res.send(apiResponse.body);
    }

    next();
  });

  app.listen(3000);
}
