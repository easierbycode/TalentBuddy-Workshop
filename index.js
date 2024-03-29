'use strict';

var express      = require('express'),
    config       = require('./config');

var app    = express();

//Set up middleware

require('./middleware')(app);
require('./router')(app);

var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;
