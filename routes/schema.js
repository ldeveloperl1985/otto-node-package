// File : routes/schema.js -->
var express = require('express');
var fs = require('fs');
var router = express.Router();
var setting = require('../setting');

module.exports = function (config) {
  var schemaController = require('../lib/controller/schemacontroller')(config);

  /**
   * @swagger
   * resourcePath: /Schema
   * description: Open Trust Taxonomy for Federation Operators
   */
  router.get(setting.schema + '/categories', function (req, res) {
    try {
      var arr = [];
      fs.readdir('./public/schema_category/', function (err, files) {
        files.forEach(function (file) {
          arr.push(settings.baseURL + '/schema_category/' + file)
        });
        return res.status(200).json(arr);
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  /**
   * @swagger
   * path: /otto/schema
   * operations:
   *   -  httpMethod: POST
   *      summary: Create Schema
   *      notes: Returns created Schema Id
   *      nickname: Schema
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: Schema Json
   *          description: Your Schema JSON
   *          paramType: body
   *          required: true
   *          dataType: string
   */
  router.post(setting.schema, function (req, res) {
    try {
      schemaController.addSchema(req, function (err, data) {
        console.log(err);
        if (err) {
          res.status(err.code).json({error: err.error});
        } else {
          res.status(201).json({
            '@id': baseURL + setting.schema + '/' + data
          });
        }
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  /**
   * @swagger
   * path: /otto/schema/{id}
   * operations:
   *   -  httpMethod: GET
   *      summary: Get Schema By Id
   *      notes: Returns Schema
   *      nickname: GetSchemaById
   *      parameters:
   *        - name: id
   *          paramType: path
   *          description: Your Schema Id
   *          required: true
   *          dataType: string
   *        - name: depth
   *          description: depth
   *          paramType: query
   *          required: false
   *          dataType: string
   *        - name: filter
   *          description: jspath filter syntax (Example- .name)
   *          paramType: query
   *          required: false
   *          dataType: string
   *
   */
  router.get(setting.schema + '/:id', function (req, res) {
    try {
      schemaController.findSchema(req, function (err, data) {
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
   * path: /otto/schema
   * operations:
   *   -  httpMethod: GET
   *      summary: Get Schema
   *      notes: Returns Schema
   *      nickname: GetSchema
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
  router.get(setting.schema, function (req, res) {
    try {
      schemaController.getAllSchemaWithDepth(req, function (err, data) {
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
   * path: /otto/schema/{id}
   * operations:
   *   -  httpMethod: Delete
   *      summary: Delete Schema
   *      notes: Returns Schema status
   *      nickname: DeleteSchema
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: id
   *          description: Your Schema Id
   *          paramType: path
   *          required: true
   *          dataType: string
   */
  router.delete(setting.schema + '/:id', function (req, res) {
    try {
      schemaController.deleteSchema(req, function (err) {
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
   * path: /otto/schema/{id}
   * operations:
   *   -  httpMethod: PUT
   *      summary: Update Schema
   *      notes: Returns Status
   *      nickname: PutSchema
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: id
   *          description: Your Schema Id
   *          paramType: path
   *          required: true
   *          dataType: string
   *        - name: body
   *          description: Your Schema Information
   *          paramType: body
   *          required: true
   *          dataType: string
   *
   */
  router.put(setting.schema + '/:id', function (req, res) {
    try {
      schemaController.updateSchema(req, function (err, data) {
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

  /**
   * @swagger
   * path: /otto/schema/{sid}/federation/{fid}
   * operations:
   *   -  httpMethod: post
   *      summary: Join schema (Existing federation)
   *      notes: The federation to which this schema is affiliated
   *      nickname: JoinFederation
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: sid
   *          description: Your Schema Id
   *          paramType: path
   *          required: true
   *          dataType: string
   *        - name: fid
   *          description: Your Federation Id
   *          paramType: path
   *          required: true
   *          dataType: string
   */
  router.post(setting.schema + '/:sid/federation/:fid', function (req, res) {
    try {
      schemaController.joinSchemaWithFederation(req, function (err, callback) {
        if (err) {
          res.status(err.code).json({
            error: err.error
          });
        }
        res.status(200).json();
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  /**
   * @swagger
   * path: /otto/schema/{sid}/entity/{eid}
   * operations:
   *   -  httpMethod: post
   *      summary: Join schema (Existing entity)
   *      notes: The entity to which this schema is affiliated
   *      nickname: JoinEntity
   *      consumes:
   *        - text/html
   *      parameters:
   *        - name: sid
   *          description: Your Schema Id
   *          paramType: path
   *          required: true
   *          dataType: string
   *        - name: eid
   *          description: Your Entity Id
   *          paramType: path
   *          required: true
   *          dataType: string
   */
  router.post(setting.schema + '/:sid/entity/:eid', function (req, res) {
    try {
      schemaController.joinSchemaWithEntity(req, function (err, callback) {
        if (err) {
          res.status(err.code).json({
            error: err.error
          });
        }
        res.status(200).json();
      });
    } catch (e) {
      res.status(500).json();
    }
  });

  /**
   * @swagger
   * path: /otto/schema/categories
   * operations:
   *   -  httpMethod: GET
   *      summary: Get all available category
   *      notes: Returns Schema
   *      nickname: GetSchema
   *
   *
   */

  return router;
};