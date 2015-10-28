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