import $ from 'jquery';
import * as bindInput from '../source/bindInput';

var sinonSandbox;

QUnit.module( 'bindInput', {
    beforeEach: () => sinonSandbox = sinon.sandbox.create(),
    afterEach: () => sinonSandbox.restore()
});

QUnit.test(
    'should be defined',
    assert => assert.ok( bindInput, 'plugin file does not exist' )
);

QUnit.test(
    'should be added as a jQuery plugin',
    assert => assert.ok( $.fn[ bindInput.PLUGIN_NAME ], 'plugin not added to jQuery' )
);

QUnit.test(
    'should attach plugin object to element',
    assert => {
        var testElement = $('<select></select>').bindInput();
        assert.ok( testElement.data( bindInput.PLUGIN_OBJECT_KEY ), 'plugin object not added to element' );
    }
);

QUnit.test(
    'should attach separate plugin object per element',
    assert => {
        var testElements = $('<select></select><select></select>').bindInput();
        let select1 = $(testElements[0]);
        let select2 = $(testElements[1]);
        
        assert.notOk(
            select1.data(bindInput.PLUGIN_OBJECT_KEY) === select2.data(bindInput.PLUGIN_OBJECT_KEY)
        );
    }
);

// TODO: refactor and create a list of elements that are supported
QUnit.test(
    'should not initialize the plugin on a non-supported element',
    assert => {
        var testElement = $('<div></div>').bindInput();
        assert.notOk( testElement.data( bindInput.PLUGIN_OBJECT_KEY),
                     'plugin initialized on a non-compatible element' );
    }
);

QUnit.test(
    'should only log information to the console when politely asked',
    assert => {
        
        var consoleSpy = sinonSandbox.stub( console, 'log' );
        $('<select></select>').bindInput();
        
        assert.ok( consoleSpy.callCount === 0 );
        
        $('<select></select>').bindInput({
            log: true
        });
        assert.ok( consoleSpy.callCount === 1 );
        
        $('<select></select>').bindInput({
            log: false
        });
        assert.ok( consoleSpy.callCount === 1 );
        
    }
);