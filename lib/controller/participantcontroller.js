var mongoose = require('mongoose');
var Ajv = require('ajv');

module.exports = function (config) {
  var module = {};
  var participantModel = require('../models/participantmodel')(config);
  var common = require('./common');

  var ajv = Ajv({
    allErrors: true
  });
  var participantAJVSchema = {
    properties: {
      name: {
        type: 'string'
      },
      registeredBy: {
        type: 'string'
      }
    },
    required: ['name', 'registeredBy']
  };

  module.getAllParticipantWithDepth = function (req, callback) {
    var pageNo = (!!req.query) ? (+req.query.pageno) : 0;
    pageNo = pageNo > 0 ? pageNo -= 1 : pageNo;

    var pageLength = (!!req.query) ? +req.query.pagelength : 0;
    var depth = '';

    if (!!req.query && !!req.query.depth) {
      depth = [
        'memberOf',
        'memberOf.registeredBy',
        'memberOf.sponsor',
        'memberOf.federates',
        'memberOf.member',
        'memberOf.badgeSupported',
        'memberOf.supports',
        'memberOf.metadata',
        'operates',
        'operates.registeredBy',
        'operates.federatedBy',
        'operates.supports',
        'registeredBy',
        'badgeSupported'
      ];
    }

    var totalResults = 0;
    participantModel
      .find({})
      .lean()
      .then(function (participants) {
        totalResults = participants.length;
        if (totalResults / pageLength < pageNo) {
          return Promise.reject({error: ['Invalid page no'], code: 400});
        }

        return participantModel.find({}).select('-_id -__v -updatedAt -createdAt')
          .skip((!!pageLength && !!pageNo ? pageNo * pageLength : 0))
          .limit((!!pageLength ? pageLength : 0))
          .deepPopulate(depth)
          .lean()
      })
      .then(function (participants) {
        if (participants.length <= 0) {
          return Promise.reject({error: ['No records found'], code: 404});
        }

        participants.forEach(function (item) {
          item.registeredBy = !!item.registeredBy ? item.registeredBy['@id'] : '';
        });

        if (!!req.query && !req.query.depth) {
          participants = participants.map(function (item) {
            return item['@id'];
          });
          return Promise.resolve(participants);
        } else if (!!req.query && req.query.depth == 'participant') {
          participants.forEach(function (item) {
            item.operates = !!item.operates ? item.operates['@id'] : '';
          });

          return common.customCollectionFilter(participants, ['memberOf', 'badgeSupported']);
        } else {
          participants = participants.map(function (item) {
            return item['@id'];
          });
          return Promise.resolve(participants);
        }
      })
      .then(function (participant) {
        return callback(null, {
          participant: participant,
          totalResults: totalResults,
          itemsPerPage: (!!pageLength ? pageLength : 0),
          startIndex: (!!pageNo ? pageNo + 1 : 1)
        });
      })
      .catch(function (err) {
        return callback(err, null);
      });
  };

  module.addParticipant = function (req, callback) {
    var valid = ajv.validate(participantAJVSchema, req.body);
    if (valid) {
      var oParticipant = new participantModel(req.body);
      oParticipant.save(function (err, obj) {
        if (err) {
          if (!!err.code && err.code == 11000) {
            return callback({error: ['Participant with same name already exist'], code: 404}, null);
          }
          return callback({error: err, code: 404}, null);
        }
        callback(null, obj._id);
      });
    } else {
      var errorMsg = Array();
      ajv.errors.forEach(function (element) {
        errorMsg.push(element.message);
      });
      callback({
        error: errorMsg,
        code: 400
      }, null);
    }
  };

  module.findParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    participantModel.findById(req.params.id).select('-_id -__v -updatedAt -createdAt')
      .deepPopulate([
        'memberOf',
        'memberOf.registeredBy',
        'memberOf.sponsor',
        'memberOf.federates',
        'memberOf.member',
        'memberOf.badgeSupported',
        'memberOf.supports',
        'memberOf.metadata',
        'operates',
        'operates.registeredBy',
        'operates.federatedBy',
        'operates.supports',
        'registeredBy',
        'badgeSupported'
      ])
      .lean()
      .exec()
      .then(function (participant) {
        if (!participant) {
          return Promise.reject({
            error: ['Participant doesn\'t exist'],
            code: 404
          });
        }
        participant.registeredBy = participant.registeredBy['@id'];
        participant.operates = !!participant.operates ? participant.operates['@id'] : '';
        participant = common.customObjectFilter(participant, ['memberOf', 'badgeSupported']);
        if (req.query.depth == null) {
          return Promise.resolve(participant);
        } else {
          return common.depth(participant, req.query.depth)
            .then(function (depthParticipant) {
              return Promise.resolve(depthParticipant);
            });
        }
      })
      .then(function (participant) {
        if (req.query.filter == null)
          callback(null, participant);
        else {
          try {
            var data = common.jsPathFilter(req.query.filter, participant);
            callback(null, data);
          } catch (e) {
            return callback({
              error: ['Invalid jspath'],
              code: 400
            }, null);
          }
        }
      })
      .catch(function (err) {
        return callback(err, null);
      });
  };

  module.deleteParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    participantModel.findById(req.params.id)
      .then(function (oParticipant) {
        if (!oParticipant) {
          return Promise.reject({
            error: ['Participant doesn\'t exist'],
            code: 404
          });
        }

        return participantModel.findOneAndRemove({_id: req.params.id});
      })
      .then(function (oParticipant) {
        return callback(null, oParticipant);
      })
      .catch(function (err) {
        return callback(err, null);
      });
  };

  module.updateParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    var valid = true; //ajv.validate(participantAJVSchema, req.body);
    if (valid) {
      participantModel.findById(req.params.id)
        .then(function (doc) {
          if (!doc) {
            return Promise.reject({
              error: ['Participant doesn\'t exist'],
              code: 404
            });
          }
          return participantModel.findOneAndUpdate({_id: req.params.id}, req.body);
        })
        .then(function (oParticipant) {
          return callback(null, oParticipant);
        })
        .catch((function (err) {
          callback(err, null);
        }));
    } else {
      var errorMsg = Array();
      ajv.errors.forEach(function (element) {
        errorMsg.push(element.message);
      });
      callback({
        error: errorMsg,
        code: 400
      }, null);
    }
  };

  module.joinFederationParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.fid)) {
      return callback({
        error: ['Invalid Federation Id'],
        code: 400
      }, null);
    }

    participantModel.findById(req.params.pid)
      .then(function (oParticipant) {
        if (!oParticipant) {
          return Promise.reject({
            error: ['Participant doesn\'t exists'],
            code: 404
          });
        }

        if (oParticipant.memberOf.indexOf(req.params.fid) > -1)
          return Promise.reject({
            error: ['Federation already exist'],
            code: 404
          });

        oParticipant.memberOf.push(req.params.fid);
        return oParticipant.save();
      })
      .then(function (oParticipant) {
        return callback(null, oParticipant);
      })
      .catch(function (err) {
        return callback(err, null);
      });
  };

  module.joinEntityParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.eid)) {
      return callback({
        error: ['Invalid Federation Entity Id'],
        code: 400
      }, null);
    }

    participantModel.findById(req.params.pid)
      .then(function (oParticipant) {
        if (!oParticipant) {
          return Promise.reject({
            error: ['Participant doesn\'t exists'],
            code: 404
          });
        }
        oParticipant.operates = req.params.eid;
        return oParticipant.save();
      })
      .then(function (oParticipant) {
        return callback(null, oParticipant);
      })
      .catch(function (err) {
        return callback(err, null);
      });
  };

  module.patchParticipant = function (req, callback) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return callback({
        error: ['Invalid Participant Id'],
        code: 400
      }, null);
    }

    return participantModel.findById(req.params.id)
      .then(function (participant) {
        if (!participant) {
          return Promise.reject({
            error: ['Participant doesn\'t exist'],
            code: 404
          });
        }

        req.body = Array.isArray(req.body) ? req.body : [req.body];

        req.body.forEach(function (operation) {
          if (!operation.op) {
            return Promise.reject({
              error: ['op property must required'],
              code: 400
            }, null);
          }

          if (operation.op == 'add') {
            participant = common.patchAdd(operation, participant);
          } else if (operation.op == 'replace') {
            participant = common.patchReplace(operation, participant);
          } else if (operation.op == 'remove') {
            participant = common.patchRemove(operation, participant);
          }
        });
        return Promise.resolve(participant);
      })
      .then(function (oParticipant) {
        return oParticipant.save();
      })
      .then(function (oParticipant) {
        return callback(null, oParticipant);
      })
      .catch((function (err) {
        return callback(err, null);
      }));
  };

  return module;
};