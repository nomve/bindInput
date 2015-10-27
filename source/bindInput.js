import $ from 'jquery';
import Logger from './helpers/logger';

/*
 * plugin name to register, ie $.fn[PLUGIN_NAME]
 */
export const PLUGIN_NAME = 'bindInput';
/*
 * data key of object to access, ie $().data(PLUGIN_OBJECT_KEY);
 */
export const PLUGIN_OBJECT_KEY = `plugin_${PLUGIN_NAME}`;
/*
 * plugin default options
 */
const PLUGIN_DEFAULTS = {
    log: false
};
/*
 * plugin constructor
 */
function BindInput( element, options, logger ) {

    if ( element === undefined ) {
        return;   
    }

    this.element$ = $(element);
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
    if ( ! this.options.receiver ) {
        this.logger.log('You must bind an input to some other receiver in options');
        return false;
    }

    this
        .setReceiver()
        .setListeners();

    return this;
};
/*
 * setting receiver
 */
BindInput.prototype.setReceiver = function() {

    this.receiver$ = this.options.receiver instanceof jQuery ?
                            this.options.receiver :
                            $(this.options.receiver);

    return this;
};
/*
 * setting field listeners
 */
BindInput.prototype.setListeners = function() {
    /*
     * once on load
     */
    $(document).ready( $.proxy(this.matchFields, this) );
    /*
     * and for every change
     */
    this.element$.on( 'change', $.proxy(this.matchFields, this) );
};
/*
 * define new constructors for each form type
 */
/*
 * select
 */
var SelectField = function( element, options, logger ) {
    BindInput.call( this, element, options, logger );
};
SelectField.prototype = new BindInput();
/*
 * the actual setting function for the select
 */
SelectField.prototype.matchFields = function() {

    if ( ! this.receiver$ ) {
       return false;   
    }

var current = this.element$.children('option').filter( ':selected' );
if ( ! current ) {
    return false;   
}

/*
 * set the same option on receiver
 */
this.receiver$.children('option')
    /*
     * find the matching option
     */
    .filter( function() {
        return $(this).text() === current.text();
    })
    .prop( 'selected', true );

    return this;
};


$.fn[PLUGIN_NAME] = function ( options ) {
    /*
     * plugin object to instantiate
     */
    var pluginObj;
    /**
     * merge options with defaults
     */
    var settings = $.extend( {}, PLUGIN_DEFAULTS, options );
    /*
     * instantiate logger for each 
     */
    var logger = Logger( settings.log );

    return this.each( function(index, element) {

        if ( ! $.data(element, PLUGIN_OBJECT_KEY) ) {
            /*
             * field type
             */
            var type = (element.tagName !== 'INPUT' ? element.tagName : element.type)
                            .toLowerCase();
            /*
             * instantiate the right object
             */
            switch( type ) {
                case 'select':
                    pluginObj = new SelectField( element, settings, logger );
                    break;
                case 'default':
                    logger.log('Trying to set plugin on a non-supported element');
                    pluginObj = null;
            }
            if ( ! pluginObj ) {
                return true;
            }

            $.data( element, PLUGIN_OBJECT_KEY, pluginObj );
        }

        return true;
    });
};