var path  = require('path'),
    nconf = require('nconf');

nconf.env();

var configFile = 'config-' + nconf.get('NODE_ENV') + '.json';

nconf.file(path.join(__dirname, configFile));

module.exports = nconf;