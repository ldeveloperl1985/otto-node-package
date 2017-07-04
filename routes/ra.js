// File : routes/requirement.js -->
var express = require('express');
var router = express.Router();
var setting = require('../setting');

module.exports = function (config) {
  var requirementController = require('../lib/controller/racontroller')(config);

  router.get(setting.registrationAuthorityURL + '/:id', function (req, res) {
    try {
      requirementController.findRequirement(req, function (err, data) {
        if (err) {
          res.status(err.code).json({error: err.error});
        } else {
          res.status(200).json(data);
        }
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  return router;
};