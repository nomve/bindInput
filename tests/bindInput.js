import $ from 'jquery';
import bindInput from '../source/bindInput';

QUnit.test(
    'should be defined',
    assert => assert.ok( bindInput, 'plugin does not exist' )
);

QUnit.test(
    'should be added as a jQuery plugin',
    assert => assert.ok( $.fn.bindInput, 'plugin not added to jQuery' )
);