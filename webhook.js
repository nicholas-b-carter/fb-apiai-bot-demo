'use strict';
const APIAI_TOKEN = 'b20f48f876104dcfa1c542b4a5bcd2a3';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const api = require('apiai');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiai = api(APIAI_TOKEN);

const createOrder = ({ params, res }) => {
  console.log(params);

  request.post({url:'http://hamilton-api.herokuapp.com/orders', params}, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      let json = JSON.parse(body);
      console.log(json);
      return res.json(json);
    } else {
      return res.status(400).json({
        status: {
          code: 400,
          errorType: 'failed'
        }
      });
    }
  });
}

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  const { body: { result: { action, parameters } } } = req;
  switch (action) {
    case 'create.order': {
      createOrder({parameters, res});
    }
    default: {
      console.log('defaulted', action, parameters);
    }
  }

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;
  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
});
