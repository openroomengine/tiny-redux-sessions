'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createMiddleware = require('./createMiddleware.js');

var _createMiddleware2 = _interopRequireDefault(_createMiddleware);

var _createReducer = require('./createReducer.js');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _createActions = require('./createActions.js');

var _createActions2 = _interopRequireDefault(_createActions);

var _createAuthorize2 = require('./createAuthorize.js');

var _createAuthorize3 = _interopRequireDefault(_createAuthorize2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  loginRoute: 'login',
  logoutRoute: 'logout',
  redirectUnauthorized: true,
  redirectAfterLogin: 'home', // false, string, object
  dynamicRedirect: true, // after successful login, should previous route be activated again?
  redirectAfterLogout: 'login', // false, string, object
  instantLogout: true, // should we dispatch LOGOUT for you if you navigate to logoutRoute?
  swallowChangeRouteLogout: false, // should session middleware absorb or propagate CHANGE_ROUTE logout? Only effective when instantLogout is true
  redirectAfterDestroySession: 'login', // false, string, object
  rememberRouteBeforeDestroySession: true, // when a session abruptly ends, should we redirect to the last visited route when the same user logs in again?
  userIdentifier: 'username', // if the values of user[userIdentifier] are strict equal (===), users are considered the same
  // pass false to never consider two users the same (all LOGINs behave the same)
  // (used to determine whether LOGIN after DESTROY_SESSION should redirect or not)
  defaultUser: {
    role: 'visitor', // mandatory
    persist: null // mandatory
    // false: do not persist user; each refresh requires new login
    // session: store user in browser's sessionStorage (if available); stay logged in until browser closes (or until LOGOUT or DESTROY_SESSION)
    // local: store user in browser's localStorage (if available); stay logged in until LOGOUT or DESTROY_SESSION (NOTE: certain browser settings may cause your browser to clear localStorage when closed)
  },
  getSession: function getSession(state) {
    return state.session;
  },
  getCurrentRoute: function getCurrentRoute(state) {
    return state.route.current;
  },
  storageKey: 'user',

  // action types
  LOGIN: 'LOGIN',
  LOGIN_INIT: 'LOGIN_INIT',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOGOUT_INIT: 'LOGOUT_INIT',
  LOGOUT_ERROR: 'LOGOUT_ERROR',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  DESTROY_SESSION: 'DESTROY_SESSION'
};

exports.default = function (performLogin, performLogout, changeRoute, options) {
  options = _extends({}, defaults, options);
  options.defaultUser = _extends({}, defaults.defaultUser, options.defaultUser);

  // extract changeRoute type
  if (!options.CHANGE_ROUTE) options.CHANGE_ROUTE = changeRoute().type;

  var actions = (0, _createActions2.default)(changeRoute, options);

  var _createAuthorize = (0, _createAuthorize3.default)(options),
      authorize = _createAuthorize.authorize,
      Authorize = _createAuthorize.Authorize;

  return {
    sessionMiddleware: (0, _createMiddleware2.default)(performLogin, performLogout, actions, options),
    sessionReducer: (0, _createReducer2.default)(options),
    sessionActions: actions,
    authorize: authorize,
    Authorize: Authorize
  };
};