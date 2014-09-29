var events = require('events')
  , util = require('util');

/**
 * Create the controller class with the provided connection
 *
 * @param   object   transport
 */
function wyrestorm(config) {
  //todo: inputs/outputs
  events.EventEmitter.call(this);

  this.systemMode = false;
  this.transport = config.transport;
}

util.inherits(wyrestorm, events.EventEmitter);

/**
 * Define the available transport
 *
 * @type    object
 */
wyrestorm.transports = {
  telnet: require('./telnet')
}

/**
 * Get the current output selections
 *
 * @param   function    callback
 */
wyrestorm.prototype.getStatus = function(callback) {
  //TODO: parse response into object?
  this.transport.send('bc ', callback);
}

/**
 * Change the selected input for an output
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.setOutput = function(output, input, callback) {
  if (this.isValidOutput(output) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if (this.isValidInput(input) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  var outputInt = output - 1;
  var inputInt = input - 1;

  var command = 'cir ' + outputInt.toString() + inputInt.toString();

  this.transport.send(command, function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    if (err) {
      callback(err);
      return;
    }

    var expectedResponse = 's' + output.toString() + input.toString();

    if (response !== expectedResponse) {
      callback(new Error('Failed to change source'));
      return;
    }

    callback();
  });
}

/**
 * Put the current session into system mode
 *
 * @param   function  callback
 */
wyrestorm.prototype.enterSystemMode = function(callback) {
  var self = this;

  this.transport.send('stm', function(err, response) {
   if (typeof callback !== 'function') {
     return;
   }

   if (err) {
     callback(err);
     return;
   }

   if (response !== 'stm') {
     callback(new Error('Unable to enter system mode'));
     return;
   }

   self.systemMode = true;
   callback();
 });
}

/**
 * Leave system mode
 *
 * @param   function  callback
 */
wyrestorm.prototype.leaveSystemMode = function(callback) {
  var self = this;

  this.transport.send('sto', function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    if (err) {
      callback(err);
      return;
    }

    if (response !== 'sto') {
      callback(new Error('Unable to leave system mode'));
      return;
    }

    self.systemMode = false;
    callback();
  });
}

/**
 * Get the system status/configuration
 *
 * @param   function  callback
 */
wyrestorm.prototype.getSystemStatus = function(callback) {
  this.transport.send('sts', function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    if (err) {
      callback(err);
      return;
    }

    //todo parse response
  });
}

/**
 * Copy a displays EDID to the provided input
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.copyEdid = function(output, input, callback) {
  if (this.isValidOutput(output) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if (this.isValidInput(input) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  if (this.systemMode === false) {
    if (typeof callback === 'function') {
      callback(new Error('Matrix must be in system mode before copying EDIDs'));
    }

    return;
  }

  this.transport.send(command, function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    var expectedResponse = 'sed ';
    //todo: parse response?
    // should be sed 01 01 for example
  });
}

/**
 * Get the IR Matrix status
 *
 * @param   function  callback
 */
wyrestorm.prototype.getIrStatus = function(callback) {
  this.transport.send('ims', function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    //todo: parse response
  });
}

/**
 * Change an IR matrix output only
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.setIrOutput = function(output, input, callback) {
  if (this.isValidOutput(output) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if (this.isValidInput(input) === false) {
    if (typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  var command = '?';

  this.transport.send(command, function(err, response) {
    if (typeof callback !== 'function') {
      return;
    }

    //todo parse response
  });
}

/**
 * Get the EDID as HEX for a specific output
 *
 * @param   int       output
 * @param   function  callback
 */
wyrestorm.prototype.getEdid = function(output, callback) {
  if (typeof callback !== 'function') {
    return;
  }

  if (this.isValidOutput(output) === false) {
    callback(new Error('Invalid output number'));
    return;
  }

}

/**
 * Check if the provided int is a valid output
 *
 * @param   int   output
 * @return  bool
 */
wyrestorm.prototype.isValidOutput = function(output) {
  return this.outputs >= output;
}

/**
 * Check if the provided int is a valid inpput
 *
 * @param   int   output
 * @return  bool
 */
wyrestorm.prototype.isValidInput = function(input) {
  return this.inputs >= input;
}

/**
 * Get the provided transport layer
 *
 * @return  object
 */
wyrestorm.prototype.getTransport = function() {
  return this.transport;
}

/**
 * Get the connection created in the transport layer
 *
 * @return  object
 */
wyrestorm.prototype.getConnection = function() {
  return this.getTransport().getConnection();
}

module.exports = wyrestorm;