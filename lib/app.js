var events = require('events')
  , util = require('util');

/**
 * Create the controller class with the provided connection
 *
 * @param   object   transport
 */
function wyrestorm(transport) {
  events.EventEmitter.call(this);

  this.transport = transport;
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
 */
wyrestorm.prototype.getStatus = function(callback) {
}

wyrestorm.prototype.setOutput = function(output, input, callback) {
}

wyrestorm.prototype.enterSystemMode = function(callback) {
}

wyrestorm.prototype.leaveSystemMode = function(callback) {
}

wyrestorm.prototype.getSystemStatus = function(callback) {
}

wyrestorm.prototype.setEdidCopy = function(output, input, callback) {
}

wyrestorm.prototype.getIrStatus = function(callback) {
}

wyrestorm.prototype.setIrOutput = function(output, input, callback) {
}

wyrestorm.prototype.getEdid = function(output, callback) {
}


module.exports = wyrestorm;
