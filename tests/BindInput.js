import $ from 'jquery';
import BindInput from '../source/BindInput';

QUnit.module( 'BindInput' );

QUnit.test(
    'should be defined',
    assert => {
        assert.ok( $.isFunction(BindInput), 'module does not exist' );
        assert.ok( typeof new BindInput() === 'object', 'could not instantiate BindInput object' );
    }
);