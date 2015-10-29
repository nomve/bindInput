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
        define(['exports', 'module', 'jquery', './helpers/logger'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('jquery'), require('./helpers/logger'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.$, global.logger);
        global.BindInput = mod.exports;
    }
})(this, function (exports, module, _jquery, _helpersLogger) {
    'use strict';

    module.exports = BindInput;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _$ = _interopRequireDefault(_jquery);

    var _logger = _interopRequireDefault(_helpersLogger);

    /*
     * plugin constructor
     */

    function BindInput(element, options, loggerObj) {

        if (typeof element === 'undefined') {
            return;
        }

        options = options || {};
        loggerObj = loggerObj || (0, _logger['default'])();

        this.element$ = (0, _$['default'])(element);
        this.options = options;
        // needs to be implemented by the extending constructor
        this.matchField = function () {
            throw new Error('extending class did not implement the matchField method');
        };

        this.loggerObj = loggerObj;

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
            this.loggerObj.log('You must bind an input to some other receiver in options');
            return false;
        }

        this.setReceiver().setListeners();

        return this;
    };
    /*
     * setting receiver
     */
    BindInput.prototype.setReceiver = function () {

        this.receiver$ = this.options.receiver instanceof _$['default'] ? this.options.receiver : (0, _$['default'])(this.options.receiver);

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
});
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', 'jquery', '../BindInput'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('jquery'), require('../BindInput'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.$, global.BindInput);
        global.SelectField = mod.exports;
    }
})(this, function (exports, module, _jquery, _BindInput) {
    'use strict';

    module.exports = SelectField;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _$ = _interopRequireDefault(_jquery);

    var _BindInput2 = _interopRequireDefault(_BindInput);

    function SelectField(element, options, logger) {
        _BindInput2['default'].call(this, element, options, logger);
    }

    SelectField.prototype = new _BindInput2['default']();
    /*
     * the actual setting function for the select
     */
    SelectField.prototype.matchFields = function () {

        if (!this.receiver$) {
            return this;
        }
        /*
         * set the same option on receiver
         */
        console.log(this.element$.val());
        this.receiver$.val(this.element$.val());

        return this;
    };
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'jquery', './helpers/logger', './types/SelectField'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('jquery'), require('./helpers/logger'), require('./types/SelectField'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.$, global.logger, global.SelectField);
    global.plugin = mod.exports;
  }
})(this, function (exports, _jquery, _helpersLogger, _typesSelectField) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _$ = _interopRequireDefault(_jquery);

  var _logger = _interopRequireDefault(_helpersLogger);

  var _SelectField = _interopRequireDefault(_typesSelectField);

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
            pluginObj = new _SelectField['default'](element, settings, loggerObj);
            break;
          case 'default':
            loggerObj.log('Trying to set plugin on a non-supported element');
            pluginObj = null;
        }
        if (pluginObj) {
          _$['default'].data(element, PLUGIN_OBJECT_KEY, pluginObj);
        }
      }
    });
  };
});
