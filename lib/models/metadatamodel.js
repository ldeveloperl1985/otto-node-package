var mongoose = require('mongoose');
var setting = require('../../setting');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function (config) {
  // define the schema for meta data
  const metadataSchema = mongoose.Schema({
    '@id': {
      type: String
    },
    '@context': {
      type: String
    },
    metadataFormat: {
      type: String
    },
    expiration: {
      type: Date
    }
  }, {
    strict: false,
    timestamps: true
  });

  metadataSchema.pre('save', function (next, done) {
    this['@id'] = config.baseURL + setting.metadata + '/' + this._id;
    this['@context'] = config.contextMetadata;
    next();
  });

  return mongoose.models.Metadata || mongoose.model('Metadata', metadataSchema);
};