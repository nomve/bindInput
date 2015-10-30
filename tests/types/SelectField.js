import $ from 'jquery';
import SelectField from '../../source/types/SelectField';

var sender$,
    receiver$;

function assertValueChange(assert, newValue) {
    sender$.val(newValue);
    sender$.trigger('change');
    assert.equal( receiver$.val(), newValue, 'receiver value was not properly set');
}

function setupSenderAndReceiver(sender, receiver) {
    if ( sender ) {
        sender$ = sender;
    }
    if ( receiver ) {
        receiver$ = receiver;
    }
    sender$.bindInput({
        receiver: receiver$
    });
}

QUnit.module( 'SelectField', {
    beforeEach: () => {
        var testSelect = `
                <select>
                    <option value="">--</option>
                    <option value="1">option 1</option>
                </select>`;
        setupSenderAndReceiver( $(testSelect), $(testSelect) );
    }
});

QUnit.test(
    'should be defined',
    assert => {
        assert.ok( $.isFunction(SelectField), 'SelectField module was not loaded' );
        assert.ok( typeof new SelectField() === 'object', 'could not instantiate a SelectField object');
    }
);

QUnit.test(
    'should adjust the receiver field by value when element adjusted',
    assert => {
        assertValueChange(assert, 1);
        assertValueChange(assert, '');
    }
);

QUnit.test(
    'should adjust the receiver field by options text if sender option missing value',
    assert => {
        var optionText = "option 1";
        setupSenderAndReceiver( $(`
                <select>
                    <option value="">--</option>
                    <option>${optionText}</option>
                </select>
            `)
        );
        
        sender$.children().eq(1).prop( 'selected', true );
        sender$.trigger('change');
        assert.equal( sender$.val(), optionText );
        assert.equal( receiver$.val(), '1' );
    }
);

QUnit.test(
    'should adjust the receiver field on initial load',
    assert => {
        setupSenderAndReceiver( $(`
                <select>
                    <option value="">--</option>
                    <option value="1" selected="selected">option 1</option>
                </select>
            `)
        );
        
        assert.equal( sender$.val(), '1' );
        assert.equal( sender$.val(), receiver$.val(), 'receiver value was not set on initial load' );
    }
);

QUnit.test(
    'should adjust input fields as well',
    assert => {
        setupSenderAndReceiver(
            $(`
                <select>
                    <option value="">--</option>
                    <option value="1">option 1</option>
                </select>
            `),
            $('<input />')
        );
        
        sender$.val(1);
        sender$.trigger('change');
        assert.ok( receiver$.is('input'), 'receiver is not set as input' );
        assert.equal( sender$.val(), receiver$.val() );
    }
);

QUnit.test(
    'should adjust textareas as well',
    assert => {
        setupSenderAndReceiver(
            $(`
                <select>
                    <option value="">--</option>
                    <option value="1">option 1</option>
                </select>
            `),
            $('<textarea />')
        );
        
        sender$.val(1);
        sender$.trigger('change');
        assert.ok( receiver$.is('textarea'), 'receiver is not set as textarea' );
        assert.equal( sender$.val(), receiver$.val() );
    }
);