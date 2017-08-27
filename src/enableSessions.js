import createMiddleware from './createMiddleware.js'
import createReducer from './createReducer.js'
import createActions from './createActions.js'
import createAuthorize from './createAuthorize.js'

const defaults = {
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
    persist: null, // mandatory
    // false: do not persist user; each refresh requires new login
    // session: store user in browser's sessionStorage (if available); stay logged in until browser closes (or until LOGOUT or DESTROY_SESSION)
    // local: store user in browser's localStorage (if available); stay logged in until LOGOUT or DESTROY_SESSION (NOTE: certain browser settings may cause your browser to clear localStorage when closed)
  },
  getSession: (state) => state.session,
  getCurrentRoute: (state) => state.route.current,
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
  DESTROY_SESSION: 'DESTROY_SESSION',
}

export default (performLogin, performLogout, changeRoute, options) => {
  options = {...defaults, ...options}
  options.defaultUser = {...defaults.defaultUser, ...options.defaultUser}

  // extract changeRoute type
  if (!options.CHANGE_ROUTE) options.CHANGE_ROUTE = changeRoute().type

  const actions = createActions(changeRoute, options)

  const {authorize, Authorize} = createAuthorize(options)

  return {
    sessionMiddleware: createMiddleware(performLogin, performLogout, actions, options),
    sessionReducer: createReducer(options),
    sessionActions: actions,
    authorize,
    Authorize,
  }
}
