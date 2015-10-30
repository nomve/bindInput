import $ from 'jquery';
import SelectField from '../../source/types/SelectField';

var sender$,
    receiver$;

function assertValueChange(assert, newValue) {
    sender$.val(newValue);
    sender$.trigger('change');
    assert.equal( receiver$.val(), newValue, 'receiver value was not properly set');
}

QUnit.module( 'SelectField', {
    beforeEach: () => {
        sender$ = $(`
            <select>
                <option value="">--</option>
                <option value="1">option 1</option>
            </select>
        `);
        receiver$ = $(`
            <select>
                <option value="">--</option>
                <option value="1">option 1</option>
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

QUnit.test(
    'should adjust the receiver field by value when element adjusted',
    assert => {
        assertValueChange(assert, 1);
        assertValueChange(assert, "");
    }
);

QUnit.test(
    'should adjust the receiver field by options text if sender option missing value',
    assert => {
        var optionText = "option 1";
        sender$ = $(`
            <select>
                <option value="">--</option>
                <option>${optionText}</option>
            </select>
        `);
        sender$.bindInput({
            receiver: receiver$
        });
        
        sender$.children().eq(1).prop( 'selected', true );
        sender$.trigger('change');
        assert.equal( sender$.val(), optionText );
        assert.equal( receiver$.val(), '1' );
    }
);