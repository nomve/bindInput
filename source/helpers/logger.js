export default function logger(shouldLog) {
    
    shouldLog = shouldLog || false;
    
    return {
        on: () => {
            shouldLog = true;
        },
        off: () => {
            shouldLog = false;
        },
        log: (message, prefix) => {

            if ( ! shouldLog ) {
                return;
            }
            var text = message;
            if ( prefix ) {
                message = prefix + message;
            }
            console.log(text);
        }
    };
}