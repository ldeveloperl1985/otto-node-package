var config = {
  dbConfig: "mongodb://localhost:27017/otto-node-pack",
  port: "5053",
  RA_NAME: "otto-test",
  baseURL: "http://localhost:5053",
  contextParticipant: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#participant",
  contextFederation: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#federation",
  contextEntity: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#entity",
  contextRegistrationAuthority: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#registration-authority",
  contextMetadata: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#metadata",
  contextRequirement: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#requirement",
  contextACR: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#acr",
  contextSchemaClass: "https://rawgit.com/KantaraInitiative/wg-otto/master/html/otto-vocab-1.0.html#schema",
  contextBadge: "https://w3id.org/openbadges/v2",
  RA_ID: "",
  isServerStart: true
};

var otto = require('./index')(config);

// var req = {
//   body: {
//     "name": "entity 1",
//     "url": "http://otto-test.gluu.org/otto/entity",
//     "description": "entity entity",
//     "registeredBy": "58f5da4957d53d2ffbbb31df",
//     "redirectUri": "dsdsdsd"
//   }
// };
//
// otto.controller.entitycontroller.addEntity(req, function (err, part) {
//   if (err) {
//     console.log('error', err);
//   }
//
//   console.log('metadata : ', part);
// });

// 595a47ea4ada485b40dd652b