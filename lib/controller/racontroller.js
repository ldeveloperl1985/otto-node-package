var mongoose = require('mongoose');
var Ajv = require('ajv');
var JSPath = require('jspath');

module.exports = function (config) {
  var module = {};
  var requirementModel = require('../models/ramodel')(config);
  var common = require('./common');

  var ajv = Ajv({
    allErrors: true
  });

  module.findRequirement = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return callback({
        error: ['Invalid Requirement Id'],
        code: 400
      }, null);
    }

    var query = requirementModel.findOne({
      _id: req.params.id
    })
      .select('-_id -__v -updatedAt -createdAt')
      .lean();

    query.exec(function (err, docs) {
      if (docs != null) {
        if (err) throw (err);

        if (req.query.filter == null) {
          callback(null, docs);
        } else {
          // Apply jsPath filter here.
          var filterdata = JSPath.apply(req.query.filter, docs);
          callback(null, filterdata);
        }
      } else {
        callback({
          error: ['Requirement not found'],
          code: 404
        }, null);
      }
    });
  };

  return module;
};