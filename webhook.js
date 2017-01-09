'use strict';

const Botkit = require('botkit');
const apiaibotkit = require('api-ai-botkit');

const slackToken = 'CVTSgVQcRIrehAJ5DNZUKB3K';
const apiaiToken = 'b20f48f876104dcfa1c542b4a5bcd2a3';

const apiai = apiaibotkit(apiaiToken);
const controller = Botkit.slackbot();

controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    apiai.process(message, bot);
});

controller.on('reaction_added', function (bot, message) {
   console.log(message);
});

apiai.all(function (message, resp, bot) {
    console.log(resp.result.action);
});

apiai
    .action('smalltalk.greetings', function (message, resp, bot) {
        var responseText = resp.result.fulfillment.speech;
        bot.reply(message, responseText);
    })
    .action('create.order', function (message, resp, bot) {
        console.log(message);
        console.log(resp);
        console.log(bot);
        bot.reply(message, resp);
    });

controller.spawn({
    token: slackToken
}).startRTM();
