var mongoose = require('mongoose');

module.exports = function (config) {
  mongoose.connect(config.dbConfig, function (error) {
    if (error) {
      console.log(error);
    }
  });

  var module = {};

  // models
  module.federationModel = require('./federationmodel')(config);
  module.entityModel = require('./entitymodel')(config);
  module.participantModel = require('./participantmodel')(config);
  module.badgeModel = require('./badgemodel')(config);
  module.metadataModel = require('./metadatamodel')(config);
  module.raModel = require('./ramodel')(config);
  module.schemaModel = require('./schemamodel')(config);

  return module;
};