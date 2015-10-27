(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _helpersLogger = require('./helpers/logger');

var _helpersLogger2 = _interopRequireDefault(_helpersLogger);

/*
 * plugin name to register, ie $.fn[PLUGIN_NAME]
 */
var PLUGIN_NAME = 'bindInput';
exports.PLUGIN_NAME = PLUGIN_NAME;
/*
 * data key of object to access, ie $().data(PLUGIN_OBJECT_KEY);
 */
var PLUGIN_OBJECT_KEY = 'plugin_' + PLUGIN_NAME;
exports.PLUGIN_OBJECT_KEY = PLUGIN_OBJECT_KEY;
/*
 * plugin default options
 */
var PLUGIN_DEFAULTS = {
    log: false
};
/*
 * plugin constructor
 */
function BindInput(element, options, logger) {

    if (element === undefined) {
        return;
    }

    this.element$ = (0, _jquery2['default'])(element);
    this.options = options;

    this.logger = logger;

    this.init();
}

/*
 * plugin prototype
 * init
 */
BindInput.prototype.init = function () {
    /*
     * receiver field is mandatory
     */
    if (!this.options.receiver) {
        this.logger.log('You must bind an input to some other receiver in options');
        return false;
    }

    this.setReceiver().setListeners();

    return this;
};
/*
 * setting receiver
 */
BindInput.prototype.setReceiver = function () {

    this.receiver$ = this.options.receiver instanceof jQuery ? this.options.receiver : (0, _jquery2['default'])(this.options.receiver);

    return this;
};
/*
 * setting field listeners
 */
BindInput.prototype.setListeners = function () {
    /*
     * once on load
     */
    (0, _jquery2['default'])(document).ready(_jquery2['default'].proxy(this.matchFields, this));
    /*
     * and for every change
     */
    this.element$.on('change', _jquery2['default'].proxy(this.matchFields, this));
};
/*
 * define new constructors for each form type
 */
/*
 * select
 */
var SelectField = function SelectField(element, options, logger) {
    BindInput.call(this, element, options, logger);
};
SelectField.prototype = new BindInput();
/*
 * the actual setting function for the select
 */
SelectField.prototype.matchFields = function () {

    if (!this.receiver$) {
        return false;
    }

    var current = this.element$.children('option').filter(':selected');
    if (!current) {
        return false;
    }

    /*
     * set the same option on receiver
     */
    this.receiver$.children('option')
    /*
     * find the matching option
     */
    .filter(function () {
        return (0, _jquery2['default'])(this).text() === current.text();
    }).prop('selected', true);

    return this;
};

_jquery2['default'].fn[PLUGIN_NAME] = function (options) {
    /*
     * plugin object to instantiate
     */
    var pluginObj;
    /**
     * merge options with defaults
     */
    var settings = _jquery2['default'].extend({}, PLUGIN_DEFAULTS, options);
    /*
     * instantiate logger for each 
     */
    var logger = (0, _helpersLogger2['default'])(settings.log);

    return this.each(function (index, element) {

        if (!_jquery2['default'].data(element, PLUGIN_OBJECT_KEY)) {
            /*
             * field type
             */
            var type = (element.tagName !== 'INPUT' ? element.tagName : element.type).toLowerCase();
            /*
             * instantiate the right object
             */
            switch (type) {
                case 'select':
                    pluginObj = new SelectField(element, settings, logger);
                    break;
                case 'default':
                    logger.log('Trying to set plugin on a non-supported element');
                    pluginObj = null;
            }
            if (!pluginObj) {
                return true;
            }

            _jquery2['default'].data(element, PLUGIN_OBJECT_KEY, pluginObj);
        }

        return true;
    });
};

},{"./helpers/logger":2,"jquery":"jquery"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = logger;

function logger(shouldLog) {

    shouldLog = shouldLog || false;

    return {
        on: function on() {
            shouldLog = true;
        },
        off: function off() {
            shouldLog = false;
        },
        log: function log(message, prefix) {

            if (!shouldLog) {
                return;
            }
            var text = message;
            if (prefix) {
                message = prefix + message;
            }
            console.log(text);
        }
    };
}

module.exports = exports["default"];

},{}]},{},[1]);
