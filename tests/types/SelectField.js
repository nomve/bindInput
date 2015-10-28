import $ from 'jquery';
import SelectField from '../../source/types/SelectField';

var sender$,
    receiver$;

QUnit.module( 'SelectField', {
    beforeEach: () => {
        sender$ = receiver$ = $(`
            <select>
                <option value="">--</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        `);
        sender$.bindInput({
            receiver: receiver$
        });
    }
});

QUnit.test(
    'should be defined',
    assert => {
        assert.ok( $.isFunction(SelectField), 'SelectField module was not loaded' );
        assert.ok( typeof new SelectField() === 'object', 'could not instantiate a SelectField object');
    }
);

//QUnit.test(
//    'should adjust the receiver field when element adjusted',
//    assert => {
//        sender$.val(1);
//        assert.ok( receiver$.val() === 1, 'receiver value was not properly set');
//    }
//);