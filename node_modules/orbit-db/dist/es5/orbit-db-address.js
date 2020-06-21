'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var CID = require('cids');

var notEmpty = function notEmpty(e) {
  return e !== '' && e !== ' ';
};

var OrbitDBAddress = function () {
  function OrbitDBAddress(root, path) {
    (0, _classCallCheck3.default)(this, OrbitDBAddress);

    this.root = root;
    this.path = path;
  }

  (0, _createClass3.default)(OrbitDBAddress, [{
    key: 'toString',
    value: function toString() {
      return OrbitDBAddress.join(this.root, this.path);
    }
  }], [{
    key: 'isValid',
    value: function isValid(address) {
      address = address.toString().replace(/\\/g, '/');

      var containsProtocolPrefix = function containsProtocolPrefix(e, i) {
        return !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb');
      };

      var parts = address.toString().split('/').filter(containsProtocolPrefix).filter(notEmpty);

      var accessControllerHash = void 0;

      try {
        accessControllerHash = parts[0].indexOf('zd') > -1 || parts[0].indexOf('Qm') > -1 || parts[0].indexOf('ba') > -1 ? new CID(parts[0]).toBaseEncodedString() : null;
      } catch (e) {
        return false;
      }

      return accessControllerHash !== null;
    }
  }, {
    key: 'parse',
    value: function parse(address) {
      if (!address) {
        throw new Error('Not a valid OrbitDB address: ' + address);
      }

      if (!OrbitDBAddress.isValid(address)) {
        throw new Error('Not a valid OrbitDB address: ' + address);
      }

      address = address.toString().replace(/\\/g, '/');

      var parts = address.toString().split('/').filter(function (e, i) {
        return !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb');
      }).filter(function (e) {
        return e !== '' && e !== ' ';
      });

      return new OrbitDBAddress(parts[0], parts.slice(1, parts.length).join('/'));
    }
  }, {
    key: 'join',
    value: function join() {
      var _ref;

      for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }

      return (_ref = path.posix || path).join.apply(_ref, ['/orbitdb'].concat(paths));
    }
  }]);
  return OrbitDBAddress;
}();

module.exports = OrbitDBAddress;