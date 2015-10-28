import $ from 'jquery';
import BindInput from '../BindInput';

export default function SelectField( element, options, logger ) {
    BindInput.call( this, element, options, logger );
}

SelectField.prototype = new BindInput();
/*
 * the actual setting function for the select
 */
SelectField.prototype.matchFields = function() {

    if ( ! this.receiver$ ) {
       return this;   
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