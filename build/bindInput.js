(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.logger = mod.exports;
    }
})(this, function (exports, module) {
    "use strict";

    module.exports = Logger;

    function Logger(shouldLog) {

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
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'jquery', './helpers/logger'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('jquery'), require('./helpers/logger'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.$, global.logger);
    global.bindInput = mod.exports;
  }
})(this, function (exports, _jquery, _helpersLogger) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _$ = _interopRequireDefault(_jquery);

  var _logger = _interopRequireDefault(_helpersLogger);

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

    this.element$ = (0, _$['default'])(element);
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

    this.receiver$ = this.options.receiver instanceof jQuery ? this.options.receiver : (0, _$['default'])(this.options.receiver);

    return this;
  };
  /*
   * setting field listeners
   */
  BindInput.prototype.setListeners = function () {
    /*
     * once on load
     */
    (0, _$['default'])(document).ready(_$['default'].proxy(this.matchFields, this));
    /*
     * and for every change
     */
    this.element$.on('change', _$['default'].proxy(this.matchFields, this));
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
      return (0, _$['default'])(this).text() === current.text();
    }).prop('selected', true);

    return this;
  };

  _$['default'].fn[PLUGIN_NAME] = function (options) {
    /*
     * plugin object to instantiate
     */
    var pluginObj;
    /**
     * merge options with defaults
     */
    var settings = _$['default'].extend({}, PLUGIN_DEFAULTS, options);
    /*
     * instantiate logger for each 
     */
    var loggerObj = (0, _logger['default'])(settings.log);

    return this.each(function (index, element) {

      if (!_$['default'].data(element, PLUGIN_OBJECT_KEY)) {
        /*
         * field type
         */
        var type = (element.tagName !== 'INPUT' ? element.tagName : element.type).toLowerCase();
        /*
         * instantiate the right object
         */
        switch (type) {
          case 'select':
            pluginObj = new SelectField(element, settings, loggerObj);
            break;
          case 'default':
            loggerObj.log('Trying to set plugin on a non-supported element');
            pluginObj = null;
        }
        if (!pluginObj) {
          return true;
        }

        _$['default'].data(element, PLUGIN_OBJECT_KEY, pluginObj);
      }

      return true;
    });
  };
});