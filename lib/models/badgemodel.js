var mongoose = require('mongoose');
var setting = require('../../setting');

module.exports = function (config) {

  // define the schema for badge
  const badgeSchema = mongoose.Schema({
    type: {
      type: String
    },
    '@id': {
      type: String
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    criteria: {
      narrative: {
        type: String
      }
    },
    issuer: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant'
    }]
  }, {
    timestamps: true
  }, {
    strict: false
  });

  badgeSchema.pre('save', function (next, done) {
    this['@id'] = config.baseURL + setting.badge + '/' + this._id;
    this['@context'] = config.contextBadge;
    next();
  });
  return mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
};