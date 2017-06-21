/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This adaptation comes from the sample skill built with Amazon Alexa Skills nodejs skill development kit.
 * The initial setting will only support en-US.
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/NealSr/alexa-tie-a-knot
 * The original code can be found at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const knots = require('./knots');

const APP_ID = "amzn1.ask.skill.af250a3e-350c-4f2c-9aed-0eab958b17cc";

const languageStrings = {
    'en': {
        translation: {
            KNOTS: knots.KNOT_EN_US,
            NUMBER_OF_KNOTS: Object.keys(knots.KNOT_EN_US).length.toString(),
            SKILL_NAME: 'Tie A Knot',
            WELCOME_MESSAGE: "Welcome to %s. I can teach you how to tie %s knots. How can I help?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            NEXT_KNOT_MESSAGE: 'Okay, which knot do you want to learn next?',
            NEXT_KNOT_REPROMPT: 'For a list of knots, ask, what knots do you know?',
            ALL_KNOTS_CARD_TITLE: '%s - All available knots.',
            DISPLAY_CARD_TITLE: '%s  - Instructions for %s.',
            HELP_MESSAGE: 'You can learn a specific knot by asking about it by name...Now, what would you like to learn?',
            HELP_REPROMT: 'To hear all the knots, say, what knots can I learn? To learn a specific knot, try how do I tie an overhand knot?...or you can say exit.',
            STOP_MESSAGE: 'Goodbye!',
            KNOT_REPEAT_MESSAGE: 'Would you like to repeat the directions or learn a new knot?',
            KNOT_LIST_PREFIX: 'You can learn the following knots: ',
            KNOT_LIST_SUFFIX: ' ... What would you like to do?',
            KNOT_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            KNOT_NOT_FOUND_WITH_KNOT_NAME: 'how to tie a %s. ',
            KNOT_NOT_FOUND_WITHOUT_KNOT_NAME: 'that knot. ',
            KNOT_NOT_FOUND_REPROMPT: 'What else can I help with? To list all knots try saying, list all knots.',
        },
    },
    'en-US': {
        translation: {
            KNOTS: knots.KNOT_EN_US,
            SKILL_NAME: 'Tie A Knot',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'), this.t('NUMBER_OF_KNOTS'));
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'ListKnotsIntent': function() {
        const cardTitle = this.t('ALL_KNOTS_CARD_TITLE', this.t('SKILL_NAME'))
        const myKnots = this.t('KNOTS')
        let knotList = this.t('KNOT_LIST_PREFIX');
        for (var knot in myKnots) {
            knotList += knot + ", ";
        }
        knotList += this.t('KNOT_LIST_SUFFIX');
        this.attributes.speechOutput = knotList;
        this.emit(':tellWithCard', this.attributes.speechOutput, cardTitle, knotList);
        this.emit('LearnKnotIntent');
    },
    'LearnKnotIntent': function () {
        var intentObj = this.event.request.intent;
        const knotSlot = intentObj.slots.Knot;
        let knotName;
        if (knotSlot && knotSlot.value) {
            knotName = knotSlot.value.toLowerCase();
        } else {
            this.emit(':elicitSlot', knotSlot, this.t('NEXT_KNOT_MESSAGE'), this.t('NEXT_KNOT_REPROMPT'), intentObj);
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), knotName);
        const myKnots = this.t('KNOTS');
        const knot = myKnots[knotName];

        if (knot) {
            this.attributes.speechOutput = knot;
            this.attributes.repromptSpeech = this.t('KNOT_REPEAT_MESSAGE');
            this.emit(':askWithCard', knot, this.attributes.repromptSpeech, cardTitle, knot);
        } else {
            let speechOutput = this.t('KNOT_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('KNOT_NOT_FOUND_REPROMPT');
            if (knotName) {
                speechOutput += this.t('KNOT_NOT_FOUND_WITH_KNOT_NAME', knotName);
            } else {
                speechOutput += this.t('KNOT_NOT_FOUND_WITHOUT_KNOT_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
