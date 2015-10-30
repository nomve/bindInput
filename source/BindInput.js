import $ from 'jquery';
import logger from './helpers/logger';

/*
 * plugin constructor
 */
export default function BindInput( element, options, loggerObj ) {

    if ( typeof element === 'undefined' ) {
        return;   
    }

    options = options || {};
    loggerObj = loggerObj || logger();
    
    this.element$ = $(element);
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
    if ( ! this.options.receiver ) {
        this.loggerObj.log('You must bind an input to some other receiver in options');
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

    this.receiver$ = this.options.receiver instanceof $ ?
                            this.options.receiver :
                            $(this.options.receiver);

    return this;
};
/*
 * setting field listeners
 */
BindInput.prototype.setListeners = function() {
    /*
     * and for every change
     */
    this.element$.on( 'change', $.proxy(this.matchFields, this) );
};