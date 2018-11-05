const {apiRequestsHandler} = require('../../');
const express = require('express');

start();

async function start() {
  const app = express();

  app.all('/\*/*' , async(req, res, next) => {
 // const {method, url, headers} = req;
    const apiResponse = await apiRequestsHandler({req});

    if( apiResponse ) {
      res.send(apiResponse.body);
    }

    next();
  });

  app.listen(3000);
}

const {getEndpoints} = require('../../');

const endpoints = getEndpoints();

endpoints.hello = () => 'yep';
