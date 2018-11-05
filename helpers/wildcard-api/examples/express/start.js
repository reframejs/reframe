const {apiRequestsHandler} = require('../../');
const express = require('express');
const db = require('./db');

start();

async function start() {
  const app = express();

  app.all('/\*/*' , async(req, res, next) => {
 // const {method, url, headers} = req;
    const apiResponse = await apiRequestsHandler({req});

    if( apiResponse ) {
   // res.status(apiResponse.statusCode);
      res.send(apiResponse.body);
    }

    next();
  });

  app.listen(3000);
}

const {getEndpoints} = require('../../');

const endpoints = getEndpoints();

endpoints.hello = () => 'yep';

endpoints.test = () => db.query('SELECT * FROM todos;');
