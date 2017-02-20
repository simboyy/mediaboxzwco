/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myOrders = myOrders;
exports.pubOrders = pubOrders;
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _order = require('./order.model');

var _order2 = _interopRequireDefault(_order);

var _shared = require('../../config/environment/shared');

var config = _interopRequireWildcard(_shared);

var _send = require('../sendmail/send');

var email = _interopRequireWildcard(_send);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function orderPlaced(res, statusCode) {
  res.req.body.to = res.req.body.email;
  res.req.body.id = 'Cash';
  email.send(config.mailOptions.orderPlaced(res.req.body));

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function orderUpdated(res, statusCode) {
  email.send(config.mailOptions.orderUpdated(res.req.body));

  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function respondWithResult(res, statusCode) {
  console.log(res);
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
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

// Get all orders by a user
function myOrders(req, res) {
  _order2.default.find({ email: req.user.email }, function (err, orders) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(orders);
  });
}

// Get all orders for a publisher
function pubOrders(req, res) {
  _order2.default.find({ 'items.publisheruid': req.user.email }, function (err, orders) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(orders);
  });
}

// Gets a list of Orders
function index(req, res) {
  return _order2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Order from the DB
function show(req, res) {
  return _order2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Order in the DB
function create(req, res) {
  req.body.uid = req.user.email; // id change on every user creation hence email is used
  var shortId = require('shortid');
  req.body.orderNo = shortId.generate();

  // When order.status is null, the client will replace with the Array[0] of order status at Settings page
  return _order2.default.create(req.body).then(orderPlaced(res, 201)).catch(handleError(res));
}

// Updates an existing Order in the DB
function update(req, res) {

  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.__v) {
    delete req.body.__v;
  }
  return _order2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(orderUpdated(res)).catch(handleError(res));
}

// Deletes a Order from the DB
function destroy(req, res) {
  return _order2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=order.controller.js.map
