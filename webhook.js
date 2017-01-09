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

const apiaiApp = apiai(APIAI_TOKEN);

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  const { body: { result: { action, parameters } } } = req;
  console.log(action);
  switch (action) {
    case 'create.order': {
      console.log(action);
      console.log(parameters);
    }
    default: {
      console.log('defaulted', action, parameters);
    }
  }
  // if (req.body.object === 'page') {
  //   req.body.entry.forEach((entry) => {
  //     entry.messaging.forEach((event) => {
  //       if (event.message && event.message.text) {
  //         receivedMessage(event);
  //       }
  //     });
  //   });
  //   res.status(200).end();
  // }
  //
  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'sysco_ordering'
  });

  apiai.on('response', (response) => {
    let aiText = response.result.fulfillment.speech;
    console.log(aiText);

    switch (aiText) {
      case 'SHOW_BIOGRAPHY':
        prepareSendBio(sender);
        break;

      default:
        prepareSendAiMessage(sender, aiText);
    }

  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
});


/* Webhook for API.ai to get response from the 3rd party API */
app.post('/ai', (req, res) => {
  console.log('*** Webhook for api.ai query ***');
  console.log(req.body.result);

  if (req.body.result.action === 'weather') {
    console.log('*** weather ***');
    let city = req.body.result.parameters['geo-city'];
    let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_API_KEY+'&q='+city;

    request.get(restUrl, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);
        console.log(json);
        let tempF = ~~(json.main.temp * 9/5 - 459.67);
        let tempC = ~~(json.main.temp - 273.15);
        let msg = 'The current condition in ' + json.name + ' is ' + json.weather[0].description + ' and the temperature is ' + tempF + ' ℉ (' +tempC+ ' ℃).'
        return res.json({
          speech: msg,
          displayText: msg,
          source: 'weather'
        });
      } else {
        let errorMessage = 'I failed to look up the city name.';
        return res.status(400).json({
          status: {
            code: 400,
            errorType: errorMessage
          }
        });
      }
    })
  }

});
