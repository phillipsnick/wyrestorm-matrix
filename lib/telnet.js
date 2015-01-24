var util = require('util')
  , events = require('events')
  , net = require('net')
  , async = require('async')
  , log = require('./log');

/**
 * Create the telnet transport
 *
 * @param   object    options
 */
function transport(options) {
  events.EventEmitter.call(this);

  // first apply the default options
  for(var key in this.options) {
    this[key] = this.options[key];
  }

  // now apply any custom options
  for(var key in options) {
    this[key] = options[key];
  }

  this.setState('init');
  this.connection = null;
  this.response = null;
  this.queue = async.queue(function(task, callback) {
    task(callback);
  }, 1);

  if(this.debug) {
    this.queue.drain = function() {
      log('All commands have been sent');
    }
  }
}

/**
 * Setup event emitter for telnet transport
 */
util.inherits(transport, events.EventEmitter);

/**
 * Define the default config for a Wyrestorm matrix
 *
 * @type  object
 */
transport.prototype.options = {
  debug: false,
  host: '127.0.0.1',
  port: 23,
  ors: '\r\n',
  irs: '\r\n',
  execTimeout: 500
}
//TODO: timeout?
/**
 * Create the connection to the telnet server
 *
 * @param   function  callback
 */
transport.prototype.connect = function(callback) {
  var self = this;

  if(this.debug) {
    log('Connecting...');
  }

  this.setState('connecting');
  this.connection = net.connect({
    port: this.port,
    host: this.host
  });

  this.connection.on('connect', function() {
    if(self.debug) {
      log('Connected to ' + self.host + ' on port ' + self.port);
    }

    self.setState('ready');
    self.emit('connect');

    if(typeof(callback) === 'function') {
      callback();
    }
  });

  this.connection.on('data', function(data) {
    if(self.debug) {
      log('Received:' + data.toString());
      console.log(data);
    }

    self.emit('data', data);
    self.parseData(data);
  });

  this.connection.on('end', function() {
    if(self.debug) {
      log('Disconnected from server');
    }

    self.emit('end');
  });

  this.connection.on('timeout', function() {
    if(self.debug) {
      log('Timeout');
    }

    self.emit('timeout');
  });

  this.connection.on('error', function(err) {
    if(self.debug) {
      log('Error');
      log(err);
    }

    self.emit('error', err);
  });

  this.connection.on('close', function() {
    if(self.debug) {
      log('Close');
    }

    self.emit('close');
  });
}

transport.prototype.setState = function(state) {
  if(this.debug) {
    log('Setting state to: ' + state);
  }

  this.state = state;
}

/**
 * Parse the data returned from the telnet object
 *
 * @param   buffer    data
 */
transport.prototype.parseData = function(data) {
  switch(this.state) {
    case 'ready':
      //TODO:
      break;

    case 'response':
      this.parseResponse(data);
      break;
  }
}

/**
 * Parse the data when in a response state by joining the buffers
 *
 * @param   buffer    data
 */
transport.prototype.parseResponse = function(data) {
  if(this.response === null) {
    this.response = data;
    return;
  }

  if(this.debug) {
    log('Merging response');
  }

  this.response = Buffer.concat([this.response, data]);
}

/**
 * Send a command
 *
 * @param   string    cmd
 * @param   function  callback
 */
transport.prototype.send = function(cmd, callback, timeout) {
  var self = this;

  if(this.debug) {
    log('Queuing: ' + cmd);
  }

  if(typeof timeout === 'undefined') {
    timeout = this.execTimeout;
  }

  if(this.debug) {
    log('Timeout set to:' + timeout);
  }

  this.queue.push(function(next) {
    if(self.debug) {
      log('Executing: ' + cmd);
    }

    if(self.connection.writable !== true) {
      if(self.debug) {
        log('Socket is not writable');
      }

      if(typeof(callback) === 'function') {
        callback(new Error('Socket is not writable'));
      }

      next();

      return;
    }

    self.write(cmd, callback, timeout, next);
  });
}

/**
 * Write to the connection without queuing, this shouldn't be used externally
 *
 * @param   string    cmd
 * @param   function  callback
 * @param   int       timeout
 * @param   function  next
 */
transport.prototype.write = function(cmd, callback, timeout, next) {
  var self = this;

  if(self.debug) {
    log('Writing: ' + cmd);
  }

  this.connection.write(cmd + this.ors, function() {
    if(self.debug) {
      log('Written: ' + cmd);
    }

    self.response = null;
    self.setState('response');

    setTimeout(function() {
      if(self.debug) {
        log('Removing all listeners');
      }

      self.emit('response');

      self.removeAllListeners('response');
      self.setState('ready');

      next();
    }, timeout);

    self.on('response', function() {
      if(self.debug) {
        log('Response:' + self.response);
      }

      if(typeof(callback) !== 'function') {
        next();
        return;
      }

      var response = null;

      if(self.response !== null) {
        response = self.response.toString();
        response = cleanArray(response.split(self.irs));
      }

      callback(null, response);
    });
  });
}

/**
 * Get the telnet connection
 *
 * @return  object
 */
transport.prototype.getConnection = function() {
  return this.connection;
}

/**
 * Disconnect the current connection
 */
transport.prototype.disconnect = function() {
  if(this.debug) {
    log('Disconnecting');
  }

  this.connection.destroy();
}

/**
 * Clean undefined, null, 0, false, NaN and '' from an array
 *
 * @param   array   actual
 * @returns {Array}
 */
function cleanArray(actual) {
  var newArray = new Array();

  for(var i = 0; i < actual.length; i++) {
    if(actual[i]) {
      newArray.push(actual[i]);
    }
  }

  return newArray;
}

module.exports = transport;