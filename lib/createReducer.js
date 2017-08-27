"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (options) {
  var initial = {
    loggedIn: false,
    loggingIn: false,
    loggingOut: false,
    user: options.defaultUser
  };

  return function () {
    var sessionState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial;
    var action = arguments[1];

    switch (action.type) {
      case options.LOGIN_INIT:
        {
          return _extends({}, sessionState, {
            loggingIn: true
          });
        }

      case options.LOGIN_ERROR:
        {
          return _extends({}, sessionState, {
            loggingIn: false
          });
        }

      case options.LOGIN_SUCCESS:
        {
          return _extends({}, sessionState, {
            loggedIn: true,
            loggingIn: false,
            user: action.payload
          });
        }

      case options.LOGOUT_INIT:
        {
          return _extends({}, sessionState, {
            loggingOut: true
          });
        }

      case options.LOGOUT_ERROR:
        {
          return _extends({}, sessionState, {
            loggingOut: false
          });
        }

      case options.LOGOUT_SUCCESS:
        {
          return _extends({}, sessionState, {
            loggedIn: false,
            loggingOut: false,
            user: options.defaultUser
          });
        }

      case options.DESTROY_SESSION:
        {
          return _extends({}, sessionState, {
            loggedIn: false,
            loggingIn: false,
            loggingOut: false,
            user: options.defaultUser
          });
        }

      default:
        {
          return sessionState;
        }
    }
  };
};