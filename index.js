var http = require('http');
var express = require('express');
var path = require('path');
var swagger = require('swagger-express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);

var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

module.exports = function (config) {
  var module = {};

  mongoose.createConnection(config.dbConfig, function (error) {
    if (error) {
      console.log(error);
    }
  });

  // set routes
  var routesIndex = require('./routes/index')(config);
  var routesFederations = require('./routes/federation')(config);
  var routesEntity = require('./routes/entity')(config);
  var routesParticipant = require('./routes/participant')(config);
  var routesMetadata = require('./routes/metadata')(config);
  var routesRa = require('./routes/ra')(config);
  var routesBadge = require('./routes/badge')(config);
  var routesSchema = require('./routes/schema')(config);

  app.set('port', config.port);

  console.log(path.join(__dirname, '/routes/federation.js'));

//Swagger Settings
  app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '2.1.5',
    basePath: config.baseURL,
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: path.join(__dirname, '/public/swagger/'),
    //apis: ['./routes/index.js', './routes/federation.js', './routes/participant.js', './routes/entity.js', './routes/metadata.js', './routes/badge.js', './routes/schema.js']
    apis: [
      path.join(__dirname, '/routes/index.js'),
      path.join(__dirname, '/routes/federation.js'),
      path.join(__dirname, '/routes/participant.js'),
      path.join(__dirname, '/routes/entity.js'),
      path.join(__dirname, '/routes/metadata.js'),
      path.join(__dirname, '/routes/badge.js'),
      path.join(__dirname, '/routes/schema.js')
    ]
  }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.set('development', function () {
    app.use(express.errorHandler());
  });

//View Engine
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

//All Routes
  app.use('/', routesIndex);
  app.use('/', routesFederations);
  app.use('/', routesEntity);
  app.use('/', routesParticipant);
  app.use('/', routesMetadata);
  app.use('/', routesRa);
  app.use('/', routesBadge);
  app.use('/', routesSchema);

// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// development error handler
// will print stacktrace
  if (app.get('env') === 'development') {
    console.log(app.get('env'));
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      err.stack = JSON.stringify(err.stack);
      res.json({"Error": [err.message]});
    });
  }

// production error handler
// no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json();
  });
  app.set('port', config.port);
  app.set('env', 'production');

  if (config.isServerStart) {
    server.listen(config.port, function () {
      console.log('-------------------------------------------------------------------');
      console.log('Server started successfully!, Open this URL ' + config.baseURL);
      console.log('-------------------------------------------------------------------');
    });
  }

  // Controller and model exports
  module.controller = require('./lib/controller/index')(config);
  module.model = require('./lib/models/index')(config);

  return module;
};
