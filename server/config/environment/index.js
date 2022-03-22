var path = require('path');
var merge = require('lodash/merge');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  domain: process.env.DOMAIN || "localhost",

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'iot-traffic-lights-secret'
  },

  // MongoDB connection options
  mongo: {},

  hue: {
    enabled: Boolean(process.env.ENABLE_HUE) || false,
    domain: process.env.HUE_DOMAIN || 'http://host.docker.internal:8000',
    username: process.env.HUE_USER || 'newdeveloper',
    lightId: process.env.HUE_LIGHT_ID || 1
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
