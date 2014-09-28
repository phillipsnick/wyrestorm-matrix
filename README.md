# Wyrestorm HDMI Matrix

Node module for controlling a Wyrestorm HDMI matrix via IP or RS232.

## Installation

```bash
npm install wyrestorm-mx0808
```

## Usage

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

## Notes

This software has only been tested with a [Grandbeing MX0808-N50](http://www.grandbeing.com/product/8X8%20HDMI%20matrix%20with%20local%20HDMI%20output%20_MX0808N50.htm) which as I understand comes from the same factory as the Wyrestorm MX0808. 

The commands used by this module have been reverse engineered from the [COMCTL Serial Control](http://www.wyrestorm.com/sites/default/files/downloads/mx0808-pp.zip) program available on the [Wyrestorm website](http://www.wyrestorm.com/catalog/hdbaset-8x8-hd-matrix).

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/wyrestorm-matrix/blob/master/LICENSE)
