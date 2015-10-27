import $ from 'jquery';
import * as bindInput from '../source/bindInput';

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

// TODO: refactor and create a list of elements that are supported
QUnit.test(
    'should not initialize the plugin on a non-supported element',
    assert => {
        var testElement = $('<div></div>').bindInput();
        assert.notOk( testElement.data( bindInput.PLUGIN_OBJECT_KEY),
                     'plugin initialized on a non-compatible element' );
    }
);