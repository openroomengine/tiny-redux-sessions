'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var createAuthorize = function createAuthorize(options) {
  // Authorize component
  var mapStateToProps = function mapStateToProps(state, _ref) {
    var roles = _ref.roles;

    var _options$getSession = options.getSession(state),
        user = _options$getSession.user;

    roles = roles instanceof Array ? roles : [roles];

    return {
      authorized: roles.includes(user.role)
    };
  };

  var Authorize = function Authorize(_ref2) {
    var authorized = _ref2.authorized,
        alwaysRender = _ref2.alwaysRender,
        child = _ref2.children,
        roles = _ref2.roles,
        dispatch = _ref2.dispatch,
        rest = _objectWithoutProperties(_ref2, ['authorized', 'alwaysRender', 'children', 'roles', 'dispatch']);

    if (authorized) return _react2.default.cloneElement(child, rest);

    if (alwaysRender) return _react2.default.cloneElement(child, _extends({ unauthorized: true }, rest));

    return null;
  };
  Authorize = (0, _reactRedux.connect)(mapStateToProps)(Authorize);


  // authorize decorator
  var authorize = function authorize(roles, alwaysRenderDec) {
    return function (Child) {
      var AuthorizeDecorator = function AuthorizeDecorator(_ref3) {
        var alwaysRender = _ref3.alwaysRender,
            rest = _objectWithoutProperties(_ref3, ['alwaysRender']);

        return _react2.default.createElement(
          Authorize,
          {
            roles: roles,
            alwaysRender: alwaysRenderDec || alwaysRender
          },
          _react2.default.createElement(Child, rest)
        );
      };

      return AuthorizeDecorator;
    };
  };

  return {
    authorize: authorize,
    Authorize: Authorize
  };
};

exports.default = createAuthorize;