module.exports = function (config) {
  var module = {};

  // controller
  module.federationcontroller = require('./federationcontroller')(config);
  module.entitycontroller = require('./entitycontroller')(config);
  module.participantcontroller = require('./participantcontroller')(config);
  module.badgecontroller = require('./badgecontroller')(config);
  module.metadatacontroller = require('./metadatacontroller')(config);
  module.racontroller = require('./racontroller')(config);
  module.schemacontroller = require('./schemacontroller')(config);

  return module;
};