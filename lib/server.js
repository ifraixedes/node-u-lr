'use strict';

var path = require('path');
var http = require('http');
var browserify = require('browserify');
var debug = require('debug')('sslr');
var engineIO = require('engine.io');

function resolveOptions(opts) {
  var optName;
  var options = {
    port: '49000'
  };

  for (optName in opts) {
    options[optName] =  opts[optName];
  }

  return options;
}

function broadcastMessage(wsServer, message, data) {
  var clientId;
  var clientsHash = wsServer.clients;
  var msgPacket = JSON.stringify({ message: message, data: data });

  for (clientId in clientsHash) {
    clientsHash[clientId].send(msgPacket);
  }

  debug('notified ' + wsServer.clientsCount + ' clients');
}

function Server(opts) {
  if (!(this instanceof Server)) {
    return new Server(opts);
  }

  this.options = resolveOptions(opts);
  this.httpServer = null;
  this.wsServer = null;
}

Server.prototype.start = function (callback) {
  if ('function' !== typeof callback) {
    callback = function () {};
  }

  if (this.wsServer !== null) {
    callback(new Error('Server must be stopped before starting again'));
    return;
  }

  this.httpServer = http.createServer(function (req, res) {
    var browserifyInst, scriptStream;

    switch (req.url) {
      case '/require-module':
        browserifyInst = browserify();
        browserifyInst.require(path.join(__dirname, '/clients/require-module.js'), { expose: 'sslr' });
        scriptStream = browserifyInst.bundle();
      break;
      default:
    }

    if (scriptStream) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });

      scriptStream.pipe(res, { end: false });
      scriptStream.on('end', function () {
        res.end();
      });
    } else {
      res.writeHead(501, 'not implemented');
      res.end();
    }
  });

  this.httpServer.listen(this.options.port);
  this.wsServer = new engineIO.attach(this.httpServer, this.options);
  callback();
};


Server.prototype.stop = function (callback) {
  if ('function' !== typeof callback) {
    callback = function () {};
  }

  if (this.wsServer) {
    this.wsServer.close();
    this.httpServer.close();
    this.wsServer = null;
    this.httpServer = null;
    callback();
  } else {
    callback(new Error('Server is not started'));
  }
};

Server.prototype.notifyReload = function (callback) {
  if ('function' !== typeof callback) {
    callback = function () {};
  }

  if (this.wsServer) {
    debug('notifying connected clients');
    broadcastMessage(this.wsServer, 'reload', { type: '*' });
    callback();
  } else {
    callback(new Error('Server is not started'));
  }
};

module.exports = Server;
