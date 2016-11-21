'use strict';

var express = require('express');
var controller = require('./address.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
//# sourceMappingURL=index.js.map