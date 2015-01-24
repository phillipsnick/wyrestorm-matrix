# Wyrestorm HDMI Matrix

NodeJS module for controlling a Wyrestorm HDMI matrix via IP or RS232.

For my notes on reverse engineering the API see my [notes](https://github.com/phillipsnick/wyrestorm-matrix/tree/master/docs/API.md).


## Installation

```bash
npm install wyrestorm-matrix
```

## Usage

When creating an instance of the matrix module there are three required parameters.
 
* `inputs` - Total number of inputs on the matrix
* `outputs` - Total number of outputs on the matrix
* `transport` - Instance of your chosen transport (eg Telnet or RS232) 


### Via Telnet

The telnet transport needs to be passed onto the module.

Note from what I am aware the matrix will only be accessible within a /24 subnet.

```js
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

__TODO__ see #2


## Methods

A number of examples can be found within the [examples directory](https://github.com/phillipsnick/wyrestorm-matrix/tree/master/examples).


### getStatus(callback)

Get the current status of selected inputs/outputs.

__Arguments__

* `callback(err, response)` - Callback on completion, `response` to contain object of all outputs and corresponding selected inputs.

__Example__

```js
matrix.getStatus(function(err, res) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log("Matrix port status", res);
});
```

---------------------------------------

### setOutput(output, input, callback)

Change the selected input for a specific output

__Arguments__

* `output` - Output display as an int (eg 1 for output 1)
* `input` - Input source as an int (eg 5 for input 5)
* `callback(err)` - Optional callback on completion

__Example__

Set output 3 to input 3

```js
matrix.setOutput(3, 3, function(err) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log("Matrix set output 2 to 2");
});
```

---------------------------------------

### enterSystemMode(callback)

Put the matrix into system mode.

Note, you will be automatically kicked out of system mode within 60 seconds by the matrix if no command is sent.

__Arguments__

* `callback(err)` - Optional callback on completion

__Example__

```js
matrix.enterSystemMode(function(err) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log("Now in system mode");
});
```

---------------------------------------

### leaveSystemMode(callback)

Take the matrix out of system mode.

__Arguments__

* `callback(err)` - Optional callback on completion

__Example__

Including entering system mode

```js
matrix.enterSystemMode(function(err) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log("Now in system mode, will leave in 5 seconds");

  setTimeout(function() {
    matrix.leaveSystemMode(function(err) {
      if(err) {
        console.log(err.toString());
        return;
      }

      console.log("Now left system mode");
    });
  }, 5000);
});
```

---------------------------------------

### getSystemStatus(callback)

Get the system configuration settings.

Note this could do with some improvements.

__Arguments__

* `callback(err)` - Callback with parsed configuration details

__Example__

```js
matrix.getSystemStatus(function(err, res) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log("Matrix status", res);
});
```

---------------------------------------

### copyEdid(output, input, callback)

Copy a displays EDID to a specific input.

__Arguments__

* `output` - Output int to copy the EDID from
* `input` - Input int to copy the EDID to
* `callback(err)` - Optional callback on completion

__Example__

Copy output 3's EDID to input 3.

```js
matrix.enterSystemMode(function() {
  matrix.copyEdid(3, 3, function(err) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log("Matrix copied output 3's EDID to input 3");
  });
});
```

---------------------------------------

### getIrStatus(callback)

Get the IR matrix current input/output configuration

__TODO__

---------------------------------------

### setIrOutput(output, input, callback)

Change the IR matrix input/output configuration

__TODO__

---------------------------------------

### getEdid(output, callback)

Get the EDID of a specific output display

__TODO__

---------------------------------------

### isValidOutput(output)

Is the provided output int a valid output based on the total outputs passed in configuration.

__Arguments__

* `output` - Output integer

__Examples__

```js
console.log(matrix.isValidOutput(4));
true
```

```js
console.log(matrix.isValidOutput(40));
false
```

---------------------------------------

### isValidInput(input)

Is the provided input int a valid input based on the total inputs passed in configuration.

__Arguments__

* `input` - Input integer

__Examples__

```js
console.log(matrix.isValidInput(4));
true
```

```js
console.log(matrix.isValidInput(40));
false
```

---------------------------------------

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
