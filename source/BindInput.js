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
    
    $(document).ready( $.proxy(this.matchFields, this) );
    /*
     * and for every change
     */
    this.element$.on( 'change', $.proxy(this.matchFields, this) );
};
/**
 * 
 */
BindInput.prototype.matchFields = function() {

    if ( ! this.receiver$ ) {
       return this;   
    }
    /*
     * set the same option on receiver
     */
    var value = this.element$.val();
    this.receiver$.val( value );
    
    if ( this.element$.val() !== this.receiver$.val() ) {
        // fallback to text if option not found
        let receiverOption$ = this.receiver$.find('option').filter(
            function findCurrentOption() {
                return $(this).text() === value;
            }
        );
        receiverOption$.prop('selected', true);
    }

    return this;
};