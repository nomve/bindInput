import $ from 'jquery';
import SelectField from '../../source/types/SelectField';

QUnit.module( 'SelectField' );

QUnit.test(
    'should be defined',
    assert => {
        assert.ok( $.isFunction(SelectField), 'SelectField module was not loaded' );
    }
);