import logger from '../../source/helpers/logger';

var loggerObj,
    sinonSandbox,
    consoleSpy;

QUnit.module( 'loggerObj', {
    beforeEach: () => {
        loggerObj = logger();
        sinonSandbox = sinon.sandbox.create();
        consoleSpy = sinonSandbox.stub( console, 'log' );
    },
    afterEach: () => sinonSandbox.restore()
});

QUnit.test(
    'should not log by default',
    assert => {
        loggerObj.log('should not be logged');
        
        assert.ok( consoleSpy.callCount === 0, 'console called when it should not have been' );
    }
);

QUnit.test(
    'should be possible to define whether it logs or not on instantiation',
    assert => {
        
        loggerObj = logger(true);
        loggerObj.log(1);
        assert.ok( consoleSpy.withArgs(1), 'console not called when it should have been' );
        
        loggerObj = logger(false);
        loggerObj.log(1);
        assert.ok( consoleSpy.callCount === 1, 'console called when it should not have been' );
    }
);

QUnit.test(
    'should log when on and not when it is turned off',
    assert => {
        
        loggerObj.on();
        loggerObj.log('should be logged');
        assert.ok( consoleSpy.withArgs('should be logged'), 'console not called when it should have been' );
        
        loggerObj.off();
        loggerObj.log('something');
        assert.ok( consoleSpy.calledOnce, 'logged after it should have been switched off' );
    }
);

QUnit.test(
    'different instances of logger do not influence each other',
    assert => {
        var newLogger = logger(true);
        loggerObj.log(1);
        newLogger.log(2);
        
        assert.ok( consoleSpy.calledOnce );
    }
);