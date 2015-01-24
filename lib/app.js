var events = require('events')
  , util = require('util');

/**
 * Create the controller class with the provided connection
 *
 * @param   object   transport
 */
function wyrestorm(config, transport) {
  events.EventEmitter.call(this);

  if(typeof(config.inputs) === "undefined" || typeof(config.outputs) === "undefined") {
    throw new Error('Please provide inputs/outputs');
  }

  this.inputs = config.inputs;
  this.outputs = config.outputs;
  this.systemMode = false;
  this.transport = transport;
}

util.inherits(wyrestorm, events.EventEmitter);

/**
 * Define the available transport
 *
 * @type    object
 */
wyrestorm.transports = {
  telnet: require('./telnet'),
  rs232: require('./rs232')
}

/**
 * When copying the EDID it takes time!
 *
 * @type    int
 */
wyrestorm.prototype.edidTimeout = 1000;

/**
 * Connect to the matrix via the defined transport
 */
wyrestorm.prototype.connect = function() {
  var self = this;

  this.transport.on('connect', function() {
    self.emit('connect');
  });

  this.transport.connect();
}

/**
 * Disconnect current transport
 */
wyrestorm.prototype.disconnect = function() {
  var self = this;

  this.transport.disconnect(function() {
    self.emit('disconnect');
  });
}

wyrestorm.prototype.parseData = function(data) {
  //TODO: parse
  //TODO: leaving system status
  console.log('ya');
  console.log(data);
  console.log(data.toString());
}

/**
 * Get the current output selections
 *
 * @param   function    callback
 */
wyrestorm.prototype.getStatus = function(callback) {
  if(typeof callback !== 'function') {
    return;
  }

  this.transport.send('bc ', function(err, response) {
    if(err) {
      callback(err);
      return;
    }

    if(!response) {
      callback(new Error('Unable to fetch status (no response)'));
      return;
    }

    var result = {};

    response.forEach(function(entry) {
      entry = entry.substring(1);
      result[entry[0]] = entry[1];
    });

    callback(null, result);
  });
}

/**
 * Change the selected input for an output
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.setOutput = function(output, input, callback) {
  if(this.isValidOutput(output) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if(this.isValidInput(input) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  var outputInt = output - 1;
  var inputInt = input - 1;

  var command = 'cir ' + outputInt.toString() + inputInt.toString();

  this.transport.send(command, function(err, response) {
    if(typeof callback !== 'function') {
      return;
    }

    if(err) {
      callback(err);
      return;
    }

    if(!response) {
      callback(new Error('Failed to change source (no response)'));
      return;
    }

    var expectedResponse = 's' + output.toString() + input.toString();

    if(response[0] !== expectedResponse) {
      callback(new Error('Failed to change source (invalid response)'));
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
    if(typeof callback !== 'function') {
      return;
    }

    if(err) {
      callback(err);
      return;
    }

    if(!response) {
      callback(new Error('Unable to enter system mode (no response)'));
      return;
    }
    if(response[0] !== 'stm') {
      callback(new Error('Unable to enter system mode (invalid response)'));
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
    if(typeof callback !== 'function') {
      return;
    }

    if(err) {
      callback(err);
      return;
    }

    if(!response) {
      callback(new Error('Unable to leave system mode (no response)'));
      return;
    }
    if(response[0] !== 'sto') {
      callback(new Error('Unable to leave system mode (invalid response)'));
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
    if(typeof callback !== 'function') {
      return;
    }

    if(err) {
      callback(err);
      return;
    }

    //todo parse response
    callback(null, response);
  });
}

/**
 * Copy a displays EDID to the provided input
 *  Requires the matrix to be in system mode
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.copyEdid = function(output, input, callback) {
  if(this.isValidOutput(output) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if(this.isValidInput(input) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  if(this.systemMode === false) {
    if(typeof callback === 'function') {
      callback(new Error('Matrix must be in system mode before copying EDIDs'));
    }

    return;
  }

  var outputInt = output - 1;
  var inputInt = input - 1;

  var command = 'sed 0' + outputInt.toString() + ' 0' + inputInt.toString();

  this.transport.send(command, function(err, response) {
    if(typeof callback !== 'function') {
      return;
    }

    if(err) {
      callback(err);
      return;
    }

    if(!response) {
      callback(new Error('Unable to copy EDID (no response)'));
      return;
    }

    if(response[0] !== command) {
      callback(new Error('Unable to copy EDID (invalid response)'));
      return;
    }

    callback(null);
  }, this.edidTimeout);
}

/**
 * Copy the EDID to the input then change the output
 *
 * @param   int       output
 * @param   int       input
 * @param   function  callback
 */
wyrestorm.prototype.setOutputAndEdid = function(output, input, callback) {
  var self = this;

  this.enterSystemMode(function(err) {
    if(err) {
      if(typeof callback === 'function') {
        callback(err);
      }

      return;
    }

    self.copyEdid(output, input, function(err) {
      if(err) {
        if(typeof callback === 'function') {
          callback(err);
        }

        return;
      }

      self.setOutput(output, input, function(err) {
        if(err) {
          if(typeof callback === 'function') {
            callback(err);
          }

          return;
        }

        self.leaveSystemMode(function(err) {
          if(err) {
            if(typeof callback === 'function') {
              callback(err);
            }

            return;
          }

          callback();
        });
      });
    });
  });
}

/**
 * Get the IR Matrix status
 *
 * @param   function  callback
 */
wyrestorm.prototype.getIrStatus = function(callback) {
  this.transport.send('ims', function(err, response) {
    if(typeof callback !== 'function') {
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
  if(this.isValidOutput(output) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid output number'));
    }

    return;
  }

  if(this.isValidInput(input) === false) {
    if(typeof callback === 'function') {
      callback(new Error('Invalid input number'));
    }

    return;
  }

  var command = '?';

  this.transport.send(command, function(err, response) {
    if(typeof callback !== 'function') {
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
  if(typeof callback !== 'function') {
    return;
  }

  if(this.isValidOutput(output) === false) {
    callback(new Error('Invalid output number'));
    return;
  }

  //TODO

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