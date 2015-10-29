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
    /*
     * set the same option on receiver
     */
    this.receiver$.val( this.element$.val() );

    return this;
};