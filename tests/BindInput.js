import $ from 'jquery';
import BindInput from '../source/BindInput';

var bindInput,
    sender$,
    receiver$,
    sinonSandbox;

function initBindInput(sender$, receiver) {
    return new BindInput( sender$, {
        receiver: receiver
    });    
}

QUnit.module( 'BindInput', {
    beforeEach: () => {
        sender$ = receiver$ = $(`
            <select>
                <option value="">--</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        `);
        bindInput = initBindInput( sender$, receiver$ );
        sinonSandbox = sinon.sandbox.create();
    },
    afterEach: () => sinonSandbox.restore()
});

QUnit.test(
    'should be defined',
    assert => {
        assert.ok( $.isFunction(BindInput), 'module does not exist' );
        assert.ok( typeof bindInput === 'object', 'could not instantiate BindInput object' );
    }
);

QUnit.test(
    'should instantiate a jQuery object if a selector passed',
    assert => {
        var body$ = $('body');
        body$.append( receiver$ );
        bindInput = initBindInput( sender$, 'select' );
        assert.ok( bindInput.receiver$ instanceof $, 'did not create a jQuery element out of a selector' );
        // teardown
        receiver$.remove();
    }
);

QUnit.test(
    'should setup listeners for the change event on the sender',
    assert => {
        var onStub = sinonSandbox.stub( $.fn, 'on' );
        bindInput = initBindInput( sender$, receiver$ );
        bindInput.element$.trigger('change');
        assert.ok( onStub.calledOnce, 'event listener was not set' );
    }
); 

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

QUnit.module( 'Select field', {
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