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

