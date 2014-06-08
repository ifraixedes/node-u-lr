'use strict';

var homeRouter = require('express').Router();

homeRouter.get('/', function home(req, res, next) {
  res.render('home', { msg: 'Hi from Server!!!' });
});

module.exports = {
  '': homeRouter
};
