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

const searchItem = item => request.get(`http://hamilton-api.herokuapp.com/search/${item}`);

const buildResponse = (returnSpeech = null, returnDisplayText = null, data = null, contextOut = [], source = null) => {
  const speech = !returnSpeech && returnDisplayText ? returnDisplayText : returnSpeech;
  const displayText = !returnDisplayText && returnSpeech ? returnSpeech : returnDisplayText;
  return {
    speech,
    displayText,
    data,
    contextOut,
    source
  };
}


const findItems = (items) => {
  const promises = [];
  items.map(item => promises.push({ item, promise: searchItem(item) }));
  return Promise.all(promises);
};

const createOrder = ({ params, res }) => {
  const { delivery, item: items, quantity, quantityUom } = params;
  const foundItems = findItems(item);

  if (foundItems.length > 1) {
    // which one did you want to choose we founds more than 1
    res.json(buildResponse(`Which foundItems[0] would you like?`, null, foundItems, [], 'endeca'));
  } else {
    res.json(buildResponse(`Cool has been created!`, null, foundItems, [], 'endeca'));

    // const orderRequest = request({
    //     url: 'http://hamilton-api.herokuapp.com/orders',
    //     method: 'POST',
    //     json: json
    //   }, (err, response, body) => {
    //     if (!err && response.statusCode == 200) {
    //       let json = JSON.parse(body);
    //       console.log(json);
    //       return res.json(body);
    //     } else {
    //       return res.status(400).json({errorType: 'failed'});
    //     }
    //   });

      console.log(orderRequest);

  }
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
});
