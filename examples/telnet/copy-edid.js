var wyrestorm = require('../../lib/app')
  , config = require('./config')
  , transportConfig = require('./config-transport');

var matrix = new wyrestorm(
  config,
  new wyrestorm.transports.telnet(transportConfig)
);

matrix.connect();
matrix.on('connect', function() {
  console.log('Connected');

  matrix.enterSystemMode(function() {
    console.log("Now in system mode, will leave in 5 seconds");

    setTimeout(function() {
      matrix.leaveSystemMode(function(err) {
        if(err) {
          console.log(err.toString());
          return;
        }

        console.log("Now left system mode");
      });
    }, 6000);

    // finally copy the EDID
    matrix.copyEdid(1, 2, function(err) {
      if (err) {
        console.log(err.toString());
        return;
      }

      console.log("Matrix copied output 5's EDID to input 3");
    });
  });
});

matrix.on('disconnect', function() {
  console.log('Disconnected');
});

setTimeout(function() {
  matrix.disconnect();
  process.exit(0);
}, 8000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");

  matrix.disconnect();
  process.exit(0);
});