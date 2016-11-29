/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.ef643a41-db86-4d9e-a350-553094cc9372'; // 'amzn1.echo-sdk-ams.app.net-pudge-Horn';

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var num = '101';
var http = require('http');
var url = 'http://HOST/cgi-bin/horn2.cgi?ajax=1&style=old&horn=off&alexa=' + num;

/**
 * Horn is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Horn = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Horn.prototype = Object.create(AlexaSkill.prototype);
Horn.prototype.constructor = Horn;

Horn.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Horn onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Horn.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Horn onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Horn, you can say horn";
    var repromptText = "You can say horn";
    response.ask(speechOutput, repromptText);
};

Horn.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Horn onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Horn.prototype.intentHandlers = {
    // register custom intent handlers
    'HornIntent': function (intent, session, response) {
        handleHorn(intent, session, response);
    },
    'AMAZON.HelpIntent': function (intent, session, response) {
        response.ask('You can say horn');
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Horn skill.
    var horn = new Horn();
    horn.execute(event, context);
};

function handleHorn(intent, session, response) {
    console.log("Horn HornIntent calling URL: " + url);
    response.tell('Testing ' + num + ' a.  URL: ' + url);
    http.get(url, function(res) {
        console.log("Horn HornIntent called remote succeeded, status code: " + res.statusCode);
//            response.tell('Got response: ' + res.statusCode);
        context.done(null, '');
    }).on('error', function(e) {
        console.log("Horn HornIntent called remote failed, status code: " + res.statusCode);
//            response.tell('Got error: ' + e.message);
        context.done(null, '');
    });
    console.log("Horn HornIntent called remote done (?): " + num);
}
