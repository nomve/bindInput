import $ from 'jquery';
import BindInput from '../BindInput';

export default function SelectField( element, options, logger ) {
    BindInput.call( this, element, options, logger );
}

SelectField.prototype = Object.create(BindInput.prototype);
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