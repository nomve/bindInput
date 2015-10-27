import $ from 'jquery';

/*
 * plugin default options
 */
var pluginName = 'bindInput',
    defaults = {
    };

/*
 * helper log function
 */
function log( msg ) {
    var name = '[' + pluginName + ']: ';
    var text = name + msg;
    console.log(text);
}

/*
 * plugin constructor
 */
function BindInput( element, options ) {

    if ( element === undefined ) {
        return;   
    }

    this.element$ = $(element);
    this.options = $.extend( {}, defaults, options);

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
        log('You must bind an input to some other receiver in options');
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
var SelectField = function( element, options ) {
    BindInput.call( this, element, options );
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


$.fn[pluginName] = function ( options ) {

    return this.each( function() {

        if ( ! $.data(this, 'plugin_' + pluginName) ) {
            /*
             * field type
             */
            var type = (this.tagName !== 'INPUT' ? this.tagName : this.type)
                            .toLowerCase();
            /*
             * plugin object to instantiate
             */
            var pluginObj;
            /*
             * instantiate the right object
             */
            switch( type ) {
                case 'select':
                    pluginObj = new SelectField( this, options );
                    break;
                case 'default':
                    pluginObj = null;
            }
            if ( ! pluginObj ) {
                log('Trying to set plugin on a non-supported element');
                return true;
            }

            $.data( this, 'plugin_' + pluginName, pluginObj );
        }

        return true;
    });
};