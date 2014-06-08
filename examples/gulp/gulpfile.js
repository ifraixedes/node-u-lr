'use strict';

var cpFork = require('child_process').fork;
var path = require('path');
var gulp = require('gulp');
var ulrServer = new (require('../../lib').Server)();
var serverChildProc ;

var pathToWatch =  path.join(__dirname, 'dev/**/*');

gulp.task('server', function (next) {
  function startServer() {
    serverChildProc = cpFork('./runDevServer');
    serverChildProc.on('message', function (message) {
      if ('listening' === message) {
        ulrServer.notifyReload();
        next();
      }
    });
    serverChildProc.send('start');
  }

  if (serverChildProc) {
    serverChildProc.on('message', function (message) {
      if ('closed' === message) {
        serverChildProc.kill('SIGTERM');
      }
    });
    serverChildProc.on('exit', startServer);
    serverChildProc.send('close');
  } else {
    startServer();
  }

});

gulp.task('default', ['server'], function (next) {
  ulrServer.start(function () {
    gulp.watch(pathToWatch, ['server']);
    next();
  });
});
