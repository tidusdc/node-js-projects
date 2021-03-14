
const EventEmitter = require('events');
const emitter = new EventEmitter();

var url = "http://mylogger.io/log"

class Logger extends EventEmitter {
    log( message ) {
        // Send HTTP Request
        console.log( message );
    
        // Raise an event
        this.emit('messageLogged', { id:1, url: 'http://' });
    
    }
}


module.exports = Logger;


