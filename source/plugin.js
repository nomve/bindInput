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
            let type = element.tagName.toLowerCase();
            /*
             * instantiate the right object 
             */
            switch( type ) {
                case 'select':
                case 'input':
                case 'textarea':
                    pluginObj = new BindInput({
                        element: element,
                        options: settings,
                        loggerObj: loggerObj});
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