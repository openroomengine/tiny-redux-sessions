'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerError = function (_Error) {
  _inherits(ServerError, _Error);

  function ServerError(res) {
    _classCallCheck(this, ServerError);

    var _this = _possibleConstructorReturn(this, (ServerError.__proto__ || Object.getPrototypeOf(ServerError)).call(this, res.status + ': ' + res.statusText));

    _this.name = 'ServerError';
    _this.response = res;
    return _this;
  }

  return ServerError;
}(Error);

exports.default = ServerError;