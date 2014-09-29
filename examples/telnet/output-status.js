var wyrestorm = require('../../lib/app')
  , config = require('./config');

var matrix = new wyrestorm(new wyrestorm.transports.telnet(config));

matrix.connect();
matrix.on('connect', function() {
  console.log('Connected');

  matrix.getStatus(function(err, status) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log("Matrix output status:", status);
  });
});

setTimeout(function() {
  matrix.getConnection().destroy();
  process.exit(0);
}, 2000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");

  matrix.getConnection().destroy();
  process.exit(0);
});