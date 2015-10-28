import $ from 'jquery';
import logger from './helpers/logger';
import BindInput from './BindInput';

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
    var loggerObj = logger( settings.log );

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
                    pluginObj = new SelectField( element, settings, loggerObj );
                    break;
                case 'default':
                    loggerObj.log('Trying to set plugin on a non-supported element');
                    pluginObj = null;
            }
            if ( pluginObj ) {
                $.data( element, PLUGIN_OBJECT_KEY, pluginObj );
            }
        }
    });
};