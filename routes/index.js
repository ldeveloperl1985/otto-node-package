var express = require('express');
var router = express.Router();
var setting = require('../setting');

module.exports = function (config) {
  /**
   * @swagger
   * resourcePath: /OTTO
   * description: Open Trust Taxonomy for Federation Operators
   */
  router.get('/', function (req, res) {
    var result = {
      "status": "200",
      "api": "Open Trust Taxonomy for Federation Operators"
    };
    res.status(200).json(result);
  });

  /**
   * @swagger
   * path: /.well-known/otto-configuration
   * operations:
   *   -  httpMethod: GET
   *      summary: Discovery Endpoint
   *      notes: Endpoint to return discovery metadata that are hosted by given server.
   *      nickname: DiscoveryEndpointAPI
   */
  router.get(setting.discoveryEndpoint, function (req, res) {
    var discoveryList = {
      "@id": config.baseURL,
      "name": config.RA_NAME,
      "url": config.baseURL,
      "description": "OTTO Registration Authority",
      "federation_endpoint": config.baseURL + setting.discoveryEndpoint,
      "participant_endpoint": config.baseURL + setting.participant,
      "entity_endpoint": config.baseURL + setting.entity,
      "registers": []
    };

    res.status(200).json(discoveryList);
  });

  return router;
};
