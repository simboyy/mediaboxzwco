'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _ref;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema,
    ObjectId = Schema.ObjectId;

var ProductSchema = new _mongoose2.default.Schema((_ref = {
  sku: String,
  name: String,
  nameLower: String,
  phone: String,
  email: String,
  slug: String,
  logo: Array,
  info: String,
  website: String,
  terms: String
}, (0, _defineProperty3.default)(_ref, 'slug', String), (0, _defineProperty3.default)(_ref, 'category', { type: ObjectId, ref: 'Category' }), (0, _defineProperty3.default)(_ref, 'status', String), (0, _defineProperty3.default)(_ref, 'brand', { type: ObjectId, ref: 'Brand' }), (0, _defineProperty3.default)(_ref, 'description', String), (0, _defineProperty3.default)(_ref, 'variants', [{ image: String, sku: String, name: String, price: Number, size: String, model: String, maxSize: String, formart: String, preview: Object }]), (0, _defineProperty3.default)(_ref, 'features', Array), (0, _defineProperty3.default)(_ref, 'keyFeatures', Array), (0, _defineProperty3.default)(_ref, 'stats', [{ key: String, val: String }]), (0, _defineProperty3.default)(_ref, 'active', { type: Boolean, default: true }), (0, _defineProperty3.default)(_ref, 'uid', String), (0, _defineProperty3.default)(_ref, 'created_at', { type: Date }), (0, _defineProperty3.default)(_ref, 'updated_at', { type: Date, default: Date.now }), (0, _defineProperty3.default)(_ref, 'updated', { type: Date, default: Date.now }), _ref), { versionKey: false });

exports.default = _mongoose2.default.model('Product', ProductSchema);
//# sourceMappingURL=product.model.js.map
