var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require("fs");
mongoose.connect('mongodb://localhost:27017/testDB');

var Image = require('./models/image');

var routes = require('./routes/index');
var users = require('./routes/user');
var points = require('./routes/point');
var trails = require('./routes/trail');
var categories = require('./routes/category');
var authenticate = require('./routes/authenticate');
var register = require('./routes/register');
var opinion = require('./routes/opinion');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));

app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});


app.use('/', routes);
app.use('/user', users);
app.use('/point', points);
app.use('/trail',trails);
app.use('/category',categories);
app.use('/authenticate',authenticate);
app.use('/register',register);
app.use('/opinion',opinion);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports.secret = uuid.v4();  //Generate random secret
module.exports = app;

