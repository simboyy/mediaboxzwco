/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Campaigns              ->  index
 * POST    /api/Campaigns              ->  create
 * GET     /api/Campaigns/:id          ->  show
 * PUT     /api/Campaigns/:id          ->  update
 * DELETE  /api/Campaigns/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myCampaigns = myCampaigns;
exports.pubCampaigns = pubCampaigns;
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _campaign = require('./campaign.model');

var _campaign2 = _interopRequireDefault(_campaign);

var _shared = require('../../config/environment/shared');

var config = _interopRequireWildcard(_shared);

var _send = require('../sendmail/send');

var email = _interopRequireWildcard(_send);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CampaignPlaced(res, statusCode) {
  res.req.body.to = res.req.body.email;
  email.send(config.mailOptions.CampaignPlaced(res.req.body));

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function CampaignUpdated(res, statusCode) {
  email.send(config.mailOptions.CampaignUpdated(res.req.body));

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {

  //console.log(updates);


  return function (entity) {

    var updated = _lodash2.default.merge(entity, updates);

    return updated.save().then(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Get all Campaigns by a user
function myCampaigns(req, res) {
  function isJson(str) {
    try {
      str = JSON.parse(str);
    } catch (e) {
      str = str;
    }
    return str;
  }
  var q = isJson(req.query.where);
  console.log(q);

  _campaign2.default.find(q, function (err, campaigns) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(campaigns);
  });
}

// Get all Campaigns by a publisher
function pubCampaigns(req, res) {
  function isJson(str) {
    try {
      str = JSON.parse(str);
    } catch (e) {
      str = str;
    }
    return str;
  }
  var q = isJson(req.query.where);
  console.log(q);

  _campaign2.default.find(q, function (err, campaigns) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(campaigns);
  });
}

// Gets a list of Campaigns
function index(req, res) {
  return _campaign2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Campaign from the DB
function show(req, res) {
  return _campaign2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Campaign in the DB
function create(req, res) {
  req.body.uid = req.user.email; // id change on every user creation hence email is used
  var shortId = require('shortid');
  req.body.campaignNo = shortId.generate();

  // When Campaign.status is null, the client will replace with the Array[0] of Campaign status at Settings page
  return _campaign2.default.create(req.body).then(CampaignPlaced(res, 201)).catch(handleError(res));
}

// Updates an existing Campaign in the DB
function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.__v) {
    delete req.body.__v;
  }
  console.log(req.body);

  if (!req.body.status) {

    _campaign2.default.update({ _id: req.params.id, "items.name": req.body.items.name }, { $set: { "items.$.price": req.body.items.price, "items.$.category": req.body.items.category, "items.$.quantity": req.body.items.quantity } }).exec().then(handleEntityNotFound(res)).then(CampaignUpdated(res)).catch(handleError(res));
  } else if (req.body.status) {
    return _campaign2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(CampaignUpdated(res)).catch(handleError(res));
  }
}

// Deletes a Campaign from the DB
function destroy(req, res) {
  return _campaign2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=campaign.controller.js.map
