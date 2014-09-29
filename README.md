# Wyrestorm HDMI Matrix

Node module for controlling a Wyrestorm HDMI matrix via IP or RS232.

## Installation

```bash
npm install wyrestorm-mx0808
```

## Usage

When creating an instance of the matrix module there are three required parameters.
 
* `inputs` - Total number of inputs on the matrix
* `outputs` - Total number of outputs on the matrix
* `transport` - Instance of your chosen transport (eg Telnet or RS232) 

### Via Telnet

The telnet transport needs to be passed onto the module.

```javascript
var wyrestorm = require('wyrestorm-matrix');

var matrix = new wyrestorm({
  inputs: 8,
  outputs: 8,
  transport: new wyrestorm.transports.telnet({
    host: '' // IP Address or hostname
  })
});

matrix.on('connect', function() {
  // now connected
  // all commands to be placed here
});
```

### Via RS232

__TODO__

## Methods

A number of examples can be found within the [examples directory](https://github.com/phillipsnick/wyrestorm-matrix/tree/master/examples).

### getStatus(callback)

Get the current status of selected inputs/outputs.

__Arguments__

* `callback(err, response)` - Callback on completion, `response` to contain object of all outputs and corresponding selected inputs.

__Example__

```javascript

```

---------------------------------------

### setOutput(output, input, callback)

Change the selected input for a specific output

__Arguments__

* `output` - Output display as an int (eg 1 for output 1)
* `input` - Input source as an int (eg 5 for input 5)
* `callback(err)` - Optional callback on completion

__Example__

```javascript

```

### enterSystemMode(callback)

Put the matrix into system mode.

Note, this is required when setting the EDID for example.

__Arguments__

* `callback(err)` - Optional callback on completion

__Example__

```javascript

```

### leaveSystemMode(callback)

Take the matrix out of system mode.

__Arguments__

* `callback(err)` - Optional callback on completion

__Example__

```javascript

```

### getSystemStatus(callback)

Get the system configuration settings.

Note this could do with some improvements.

__Arguments__

* `callback(err)` - Callback with parsed configuration details

__Example__

```javascript

```

### copyEdid(output, input, callback)

Copy a displays EDID to a specific input.

__Arguments__

* `output` - Output int to copy the EDID from
* `input` - Input int to copy the EDID to
* `callback(err)` - Optional callback on completion

__Example__

```javascript

```

### getIrStatus(callback)

Get the IR matrix current input/output configuration

### setIrOutput(output, input, callback)

Change the IR matrix input/output configuration

### getEdid(output, callback)

Get the EDID of a specific output display

### isValidOutput(output)

Is the provided output int a valid output based on the total outputs passed in configuration.

__Arguments__

* `output` - Output integer

__Examples__

```javascript

```

### isValidInput(input)

Is the provided input int a valid input based on the total inputs passed in configuration.

__Arguments__

* `input` - Input integer

__Examples__

```javascript

```

### getTransport()

Get the transport object provided when creating the module.

__Example__

```js
var transport = matrix.getTransport();
```

---------------------------------------

### getConnection()

Get the connection created by the transport.

__Example__

```js
var connection = matrix.getConnection();
```

## Notes

This software has only been tested with a [Grandbeing MX0808-N50](http://www.grandbeing.com/product/8X8%20HDMI%20matrix%20with%20local%20HDMI%20output%20_MX0808N50.htm) which as I understand comes from the same factory as the Wyrestorm MX0808. 

The commands used by this module have been reverse engineered from the [COMCTL Serial Control](http://www.wyrestorm.com/sites/default/files/downloads/mx0808-pp.zip) program available on the [Wyrestorm website](http://www.wyrestorm.com/catalog/hdbaset-8x8-hd-matrix).

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/wyrestorm-matrix/blob/master/LICENSE)
