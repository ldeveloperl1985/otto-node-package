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
  isServerStart: true
};

var otto = require('./index')(config);

var req = {
  params: {
    mid: "595a47ea4ada485b40dd652b",
    fid: "595a41b8665cbc58c77b4e79"
  }
};

otto.controller.federationcontroller.addMetadata(req, function (err, part) {
  if (err) {
    console.log('error', err);
  }

  console.log('metadata : ', part);
});

// 595a47ea4ada485b40dd652b