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
            SKILL_NAME: 'Ask A Knot',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, how do I tie an overhand knot? or teach me how to tie a bowline! ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            ALL_KNOTS_CARD_TITLE: '%s - All available knots.',
            DISPLAY_CARD_TITLE: '%s  - Instructions for %s.',
            TIMER_CARD_TITLE: '%s - Timing you for %s.  On your mark, get set, GO!',
            HELP_MESSAGE: "You can ask questions such as, what knots can I learn, how do I tie a knot, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "To hear all the knots, say what knots can I learn?  To learn a knot, say, how do I tie two half-hitches, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            KNOT_REPEAT_MESSAGE: 'Try saying repeat.',
            KNOT_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            KNOT_NOT_FOUND_WITH_KNOT_NAME: 'how to tie a %s. ',
            KNOT_NOT_FOUND_WITHOUT_KNOT_NAME: 'that knot. ',
            KNOT_NOT_FOUND_REPROMPT: 'What else can I help with? To list all knots try saying, list all knots.',
        },
    },
    'en-US': {
        translation: {
            KNOTS: knots.KNOT_EN_US,
            SKILL_NAME: 'American Tie A Knot Helper',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'ListKnotsIntent': function() {
        const cardTitle = this.t('ALL_KNOTS_CARD_TITLE', this.t('SKILL_NAME'))
        const myKnots = this.t('KNOTS')
        let knotList = "";
        for (var knot in myKnots['KNOT_EN_US']) {
            knotList += knot + ", ";
        }
        this.attributes.speechOutput = "You can learn the following knots: " + knotList;
        this.attributes.repromptSpeech = this.t('KNOT_REPEAT_MESSAGE');
        this.emit(':askWithCard', knotList, this.attributes.repromptSpeech, cardTitle)
    },
    'LearnKnotIntent': function () {
        const knotSlot = this.event.request.intent.slots.Knot;
        let knotName;
        if (knotSlot && knotSlot.value) {
            knotName = knotSlot.value.toLowerCase();
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
    'TimeKnotIntent': function () {
        const knotSlot = this.event.request.intent.slots.Knot;
        let knotName;
        if (knotSlot && knotSlot.value) {
            knotName = knotSlot.value.toLowerCase();
        }

        const cardTitle = this.t('TIMER_CARD_TITLE', this.t('SKILL_NAME'), knotName);
        const myKnotTimes = this.t('KNOTS');
        const knot = myKnotTimes[knotName];

        if (knot) {
            this.attributes.speechOutput = "I'm still working on a timer.  Try practicing tying the " + knot + " in the meantime.";
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
