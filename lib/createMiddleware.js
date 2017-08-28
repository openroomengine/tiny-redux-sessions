'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _storageAvailable = require('storage-available');

var _storageAvailable2 = _interopRequireDefault(_storageAvailable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasSessionStorage = (0, _storageAvailable2.default)('sessionStorage');
var hasLocalStorage = (0, _storageAvailable2.default)('localStorage');

exports.default = function (performLogin, performLogout, actions, options) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    // attempt login from browser storage
    var sessionUser = hasSessionStorage && JSON.parse(sessionStorage.getItem(options.storageKey));
    var localUser = hasLocalStorage && JSON.parse(localStorage.getItem(options.storageKey));
    var persistedUser = sessionUser || localUser;

    if (persistedUser) dispatch(actions.loginSuccess(persistedUser));

    return function (next) {
      return function (action) {
        var state = getState();
        var session = options.getSession(state);
        var currentRoute = options.getCurrentRoute(state);

        // ACCESS CONTROL
        var accessControl = function accessControl() {
          // on: CHANGE_ROUTE
          var nextRoute = action.payload;

          // instant logout
          if (options.instantLogout && nextRoute.id === options.logoutRoute && session.loggedIn) {
            if (!options.swallowChangeRouteLogout) next(action);
            return dispatch(actions.logout());
          }

          // swallow CHANGE_ROUTE login when already logged in
          if (nextRoute.id === options.loginRoute && session.loggedIn) return;

          // access allowed
          if (!options.redirectUnauthorized || nextRoute.id === options.loginRoute || nextRoute.roles.includes(session.user.role)) return next(action);

          // default: access denied: redirect to login
          var redirect = nextRoute.id === options.logoutRoute && options.instantLogout
          // do not redirect to logout page when instaLogout is active; would immediately logout after logging in
          ? null : {
            id: nextRoute.id,
            keys: nextRoute.keys,
            redirect: nextRoute.redirect
          };
          next(actions.changeRoute(options.loginRoute, null, redirect));
        };

        // LOGIN
        var login = function login() {
          // swallow LOGIN when already logged in
          if (session.loggedIn) return;

          var user = action.payload;

          loginInit();
          performLogin(user).then(function (user) {
            return loginSuccess(user);
          }).catch(function (error) {
            return loginError(error);
          });
        };

        var loginInit = function loginInit() {
          next(actions.loginInit());
        };

        var loginError = function loginError(error) {
          next(actions.loginError(error));
        };

        var loginSuccess = function loginSuccess(user) {
          next(actions.loginSuccess(user));

          persistUser(user);

          // redirect after login
          if (options.redirectAfterLogin) {
            // default redirect
            var redirect = options.redirectAfterLogin;

            // dynamic redirect
            if (options.dynamicRedirect && // dynamic redirect active
            currentRoute.redirect && ( // has redirect set
            !currentRoute.redirect.userId || // redirect not restricted by user
            currentRoute.redirect.userId === user[options.userIdentifier] // current and previous user are the same
            )) redirect = currentRoute.redirect;

            // normalize redirect
            if (typeof redirect === 'string') redirect = { id: redirect };

            dispatch(actions.changeRoute(redirect.id, redirect.keys, redirect.redirect));
          }
        };

        // LOGOUT
        var logout = function logout() {
          // swallow LOGOUT when not logged in
          if (!session.loggedIn) return;

          logoutInit();
          performLogout(session.user).then(function () {
            return logoutSuccess();
          }).catch(function (error) {
            return logoutError(error);
          });
        };

        var logoutInit = function logoutInit() {
          next(actions.logoutInit());
        };

        var logoutError = function logoutError(error) {
          next(actions.logoutError(error));
        };

        var logoutSuccess = function logoutSuccess() {
          next(actions.logoutSuccess());

          clearUser();

          // redirect after logout
          if (options.redirectAfterLogout) {
            var redirect = options.redirectAfterLogout;

            if (typeof redirect === 'string') redirect = { id: redirect };

            dispatch(actions.changeRoute(redirect.id, redirect.keys, redirect.redirect));
          }
        };

        // DESTROY SESSION
        var destroySession = function destroySession() {
          // swallow DESTROY_SESSION when not logged in
          if (!session.loggedIn) return;

          next(action);

          clearUser();

          // redirect after destroy session
          if (options.redirectAfterDestroySession) {
            var redirect = options.redirectAfterDestroySession;

            if (typeof redirect === 'string') redirect = { id: redirect

              // set current route as next redirect
            };if (options.userIdentifier && options.rememberRouteBeforeDestroySession) {
              redirect.redirect = {
                id: currentRoute.id,
                keys: currentRoute.keys,
                redirect: currentRoute.redirect,
                userId: session.user[options.userIdentifier]
              };
            }

            dispatch(actions.changeRoute(redirect.id, redirect.keys, redirect.redirect));
          }
        };

        // PERSIST USER
        var persistUser = function persistUser(user) {
          var storage = getStorage(user.persist);
          if (storage) storage.setItem(options.storageKey, JSON.stringify(user));
        };

        // CLEAR USER
        var clearUser = function clearUser() {
          var storage = getStorage(session.user.persist);
          if (storage) storage.removeItem(options.storageKey);
        };

        // LISTEN TO ACTIONS
        if (action.type === options.CHANGE_ROUTE) accessControl();else if (action.type === options.LOGIN) login();else if (action.type === options.LOGOUT) logout();else if (action.type === options.DESTROY_SESSION) destroySession();else next(action);
      };
    };
  };
};

var getStorage = function getStorage(persist) {
  var storage = null;
  if (persist === 'session' && hasSessionStorage) storage = sessionStorage;else if (persist === 'local' && hasLocalStorage) storage = localStorage;
  return storage;
};