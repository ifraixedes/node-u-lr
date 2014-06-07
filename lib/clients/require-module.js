
var eioClient = require('engine.io-client');

module.exports = function (options) {
  'use strict';
  var host, port, socket;

  if (!options) {
    options = {};
  }

  host = (options.host) ? options.host : 'localhost';
  port = (options.port) ? options.port: 49000;

  socket = eioClient ('ws://' + host + ':' + port, options);
  socket.on('message', function () {
    window.location.reload();
  });
};
