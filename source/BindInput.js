import $ from 'jQuery';

/*
 * plugin constructor
 */
export default function BindInput( element, options, logger ) {

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