import Logger from '../../source/helpers/logger';
import $ from 'jquery';

var logger,
    sinonSandbox,
    consoleSpy;

QUnit.module( 'Logger', {
    beforeEach: () => {
        logger = Logger();
        sinonSandbox = sinon.sandbox.create();
        consoleSpy = sinonSandbox.stub( console, 'log' );
    },
    afterEach: () => sinonSandbox.restore()
});

QUnit.test(
    'should be defined',
    assert => {
        
        assert.ok( $.isFunction(Logger), 'imported module not a function' );
        assert.ok( $.isPlainObject(logger), 'could not create a logger object' );
    } 
);

QUnit.test(
    'should not log by default',
    assert => {
        logger.log('should not be logged');
        
        assert.ok( consoleSpy.callCount === 0, 'console called when it should not have been' );
    }
);

QUnit.test(
    'should be possible to define whether it logs or not on instantiation',
    assert => {
        
        logger = Logger(true);
        logger.log(1);
        assert.ok( consoleSpy.withArgs(1), 'console not called when it should have been' );
        
        logger = Logger(false);
        logger.log(1);
        assert.ok( consoleSpy.callCount === 1, 'console called when it should not have been' );
    }
);

QUnit.test(
    'should log when on and not when it is turned off',
    assert => {
        
        logger.on();
        logger.log('should be logged');
        assert.ok( consoleSpy.withArgs('should be logged'), 'console not called when it should have been' );
        
        logger.off();
        logger.log('something');
        assert.ok( consoleSpy.calledOnce, 'logged after it should have been switched off' );
    }
);