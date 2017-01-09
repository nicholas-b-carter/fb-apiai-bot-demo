'use strict';
const APIAI_TOKEN = 'b20f48f876104dcfa1c542b4a5bcd2a3';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiHook = apiai(APIAI_TOKEN);

const createOrder = ({ params, res }) => {
  console.log(params);
const orderRequest = request({
    url: 'http://hamilton-api.herokuapp.com/orders',
    method: 'POST',
    json: params
  }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      let json = JSON.parse(body);
      console.log(json);
      return res.json(body);
    } else {
      return res.status(400).json({
        status: {
          code: 400,
          errorType: 'failed'
        }
      });
    }
  });

  console.log(orderRequest);
};

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  const { body: { result: { action, parameters } } } = req;
  console.log(action);
  switch (action) {
    case 'create.order': {
      createOrder({parameters, res});
    }
    default: {
      console.log('defaulted', action, parameters);
    }
  }

  // apiai.on('response', (response) => {
  //   let aiText = response.result.fulfillment.speech;
  // });
  //
  // apiai.on('error', (error) => {
  //   console.log(error);
  // });
  //
  // apiai.end();
});
