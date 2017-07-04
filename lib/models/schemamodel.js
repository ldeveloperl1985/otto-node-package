var mongoose = require('mongoose');
var setting = require('../../setting');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function (config) {

// define the schema for meta data
  const schemaSchema = mongoose.Schema({
    '@id': {
      type: String
    },
    '@context': {
      type: String
    },
    name: {
      type: String
    },
    category: {
      type: String
    },
    url: {
      type: String
    },
    required: {
      type: Boolean
    },
    supportedBy: [{
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      type: {
        type: String
      }
    }],
    sameAs: {
      type: String
    }
  }, {
    timestamps: true
  });

  schemaSchema.pre('save', function (next, done) {
    this['@id'] = config.baseURL + setting.schema + '/' + this._id;
    this['@context'] = config.contextSchemaClass;
    next();
  });

  return mongoose.models.Schema || mongoose.model('Schema', schemaSchema);
};