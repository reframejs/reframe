const {getApiResponse} = require('../');
const express = require('express');
const db = require('./db');
require('./api/view-endpoints');

start();

async function start() {
  const app = express();

  app.all('/wildcard/*' , async(req, res, next) => {
    const {method, url, headers} = req;
    const apiResponse = await getApiResponse({method, url, headers});

    if( apiResponse ) {
   // res.status(apiResponse.statusCode);
      res.send(apiResponse.body);
    }

    next();
  });

  app.listen(3000);
}

const {endpoints} = require('../');

endpoints.hello = function() { return 'yep' };

endpoints.test = function () { return db.query('SELECT * FROM todos;') };
