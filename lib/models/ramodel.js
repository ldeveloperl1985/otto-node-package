var mongoose = require('mongoose');
var setting = require('../../setting');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function (config) {
  // define the schema for registration authority
  const registrationAuthoritySchema = mongoose.Schema({
    '@id': {
      type: String
    },
    '@context': {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    description: {
      type: String
    },
    federation_endpoint: {
      type: String
    },
    participant_endpoint: {
      type: String
    },
    entity_endpoint: {
      type: String
    },
    registers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Federation'
    }]
  }, {
    timestamps: true
  }, {
    strict: false
  });

  registrationAuthoritySchema.pre('save', function (next, done) {
    this['@id'] = config.baseURL + setting.registrationAuthority + '/' + this._id;
    this['@context'] = config.contextRegistrationAuthority;
    next();
  });

  return mongoose.models.RegistrationAuthority || mongoose.model('RegistrationAuthority', registrationAuthoritySchema);
};