// File : routes/metadata.js -->
var express = require('express');
var router = express.Router();
var setting = require('../setting');

module.exports = function (config) {
  var metadataController = require('../lib/controller/metadatacontroller')(config);

  /**
   * @swagger
   * resourcePath: /Metadata
   * description: Open Trust Taxonomy for Federation Operators
   */

  /**
   * @swagger
   * path: /otto/metadata
   * operations:
   *   -  httpMethod: POST
   *      summary: Create Metadata
   *      notes: Returns created Metadata Id
   *      nickname: Metadata
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: Metadata Json
   *          description: Your Metadata JSON
   *          paramType: body
   *          required: true
   *          dataType: string
   */
  router.post(setting.metadata, function (req, res) {
    try {
      metadataController.addMetadata(req, function (err, data) {
        console.log(err);
        if (err) {
          res.status(err.code).json({error: err.error});
        } else {
          res.status(201).json({
            '@id': config.baseURL + setting.metadata + '/' + data
          });
        }
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  /**
   * @swagger
   * path: /otto/metadata/{id}
   * operations:
   *   -  httpMethod: GET
   *      summary: Get Metadata By Id
   *      notes: Returns Metadata
   *      nickname: GetMetadataById
   *      parameters:
   *        - name: id
   *          paramType: path
   *          description: Your Metadata Id
   *          required: true
   *          dataType: string
   *        - name: depth
   *          description: depth
   *          paramType: query
   *          required: false
   *          dataType: string
   *        - name: filter
   *          description: jspath filter syntax
   *          paramType: query
   *          required: false
   *          dataType: string
   *
   */
  router.get(setting.metadata + '/:id', function (req, res) {
    try {
      metadataController.findMetadata(req, function (err, data) {
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

  /**
   * @swagger
   * path: /otto/metadata
   * operations:
   *   -  httpMethod: GET
   *      summary: Get Metadata
   *      notes: Returns Metadata
   *      nickname: GetMetadata
   *      parameters:
   *       - name: depth
   *         description: depth
   *         paramType: query
   *         required: false
   *         dataType: string
   *       - name: pageno
   *         description: pageno (Starts from 0)
   *         paramType: query
   *         required: false
   *         dataType: string
   *       - name: pagelength
   *         description: page length
   *         paramType: query
   *         required: false
   *         dataType: string
   *
   *
   */
  router.get(setting.metadata, function (req, res) {
    try {
      metadataController.getAllMetadataWithDepth(req, function (err, data) {
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

  /**
   * @swagger
   * path: /otto/metadata/{id}
   * operations:
   *   -  httpMethod: Delete
   *      summary: Delete Metadata
   *      notes: Returns Metadata status
   *      nickname: DeleteMetadata
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: id
   *          description: Your Metadata Id
   *          paramType: path
   *          required: true
   *          dataType: string
   */
  router.delete(setting.metadata + '/:id', function (req, res) {
    try {
      metadataController.deleteMetadata(req, function (err) {
        if (err) {
          res.status(err.code).json({error: err.error});
        } else {
          res.status(200).json();
        }
      });
    }
    catch (e) {
      res.status(500).json();
    }
  });


  /**
   * @swagger
   * path: /otto/metadata/{id}
   * operations:
   *   -  httpMethod: PUT
   *      summary: Update Metadata
   *      notes: Returns Status
   *      nickname: PutMetadata
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: id
   *          description: Your Metadata Id
   *          paramType: path
   *          required: true
   *          dataType: string
   *        - name: body
   *          description: Your Metadata Information
   *          paramType: body
   *          required: true
   *          dataType: string
   *
   */
  router.put(setting.metadata + '/:id', function (req, res) {
    try {
      metadataController.updateMetadata(req, function (err, data) {
        console.log(err);
        if (err) {
          res.status(err.code).json({error: err.error});
        } else {
          res.status(200).json();
        }
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  return router;
};