var mongoose = require('mongoose');
var setting = require('../../setting');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = function (config) {
// define the schema for openid connect provider
  const entitySchema = mongoose.Schema({
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
    operatedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      type: {
        type: String
      }
    },
    url: {
      type: String
    },
    description: {
      type: String
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RegistrationAuthority'
    },
    federatedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Federation'
    }],
    metadata: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Metadata'
    },
    category: {
      type: String
    },
    supports: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schema'
    }]
  }, {
    timestamps: true
  }, {
    strict: false
  });

  entitySchema.plugin(deepPopulate, {
    whitelist: [
      'registeredBy',
      'federatedBy',
      'federatedBy.registeredBy',
      'federatedBy.sponsor',
      'federatedBy.federates',
      'federatedBy.member',
      'federatedBy.badgeSupported',
      'federatedBy.supports',
      'federatedBy.metadata',
      'metadata',
      'supports'
    ],
    populate: {
      'registeredBy': {
        select: '-_id -__v -updatedAt -createdAt'
      },
      'federatedBy': {
        select: '-_id -__v -updatedAt -createdAt'
      },
      'federatedBy.registeredBy': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.sponsor': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.federates': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.member': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.badgeSupported': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.supports': {
        select: {'@id': 1, _id: 0}
      },
      'federatedBy.metadata': {
        select: {'@id': 1, _id: 0}
      },
      'metadata': {
        select: '-_id -__v -updatedAt -createdAt'
      },
      'supports': {
        select: '-_id -__v -updatedAt -createdAt -supportedBy'
      }
    }
  });

  entitySchema.pre('save', function (next, done) {
    this['@id'] = config.baseURL + setting.entity + '/' + this._id;
    this['@context'] = config.contextEntity;
    next();
  });

  return mongoose.models.Entity || mongoose.model('Entity', entitySchema);
};
