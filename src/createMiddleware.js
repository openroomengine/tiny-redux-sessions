import storageAvailable from 'storage-available'

const hasSessionStorage = storageAvailable('sessionStorage')
const hasLocalStorage = storageAvailable('localStorage')

export default (performLogin, performLogout, actions, options) => ({dispatch, getState}) => {
  // attempt login from browser storage
  const sessionUser = hasSessionStorage && JSON.parse(sessionStorage.getItem(options.storageKey))
  const localUser = hasLocalStorage && JSON.parse(localStorage.getItem(options.storageKey))
  const persistedUser = sessionUser || localUser

  if (persistedUser) dispatch(actions.loginSuccess(persistedUser))

  return next => action => {
    const state = getState()
    const session = options.getSession(state)
    const currentRoute = options.getCurrentRoute(state)

    // ACCESS CONTROL
    const accessControl = () => {
      // on: CHANGE_ROUTE
      const nextRoute = action.payload

      // instant logout
      if (
        options.instantLogout &&
        nextRoute.id === options.logoutRoute &&
        session.loggedIn
      ) {
        if (!options.swallowChangeRouteLogout) next(action)
        return dispatch(actions.logout())
      }

      // swallow CHANGE_ROUTE login when already logged in
      if (
        nextRoute.id === options.loginRoute &&
        session.loggedIn
      ) return

      // access allowed
      if (
        !options.redirectUnauthorized ||
        nextRoute.id === options.loginRoute ||
        nextRoute.roles.includes(session.user.role)
      ) return next(action)

      // default: access denied: redirect to login
      const redirect = nextRoute.id === options.logoutRoute && options.instantLogout
        // do not redirect to logout page when instaLogout is active; would immediately logout after logging in
        ? null
        : {
          id: nextRoute.id,
          keys: nextRoute.keys,
          redirect: nextRoute.redirect,
        }
      next(actions.changeRoute(
        options.loginRoute,
        null,
        redirect,
      ))
    }

    // LOGIN
    const login = () => {
      // swallow LOGIN when already logged in
      if (session.loggedIn) return

      const user = action.payload

      loginInit()
      performLogin(user)
        .then((user) => loginSuccess(user))
        .catch((error) => loginError(error))
    }

    const loginInit = () => {
      next(actions.loginInit())
    }

    const loginError = (error) => {
      next(actions.loginError(error))
    }

    const loginSuccess = (user) => {
      next(actions.loginSuccess(user))

      persistUser(user)

      // redirect after login
      if (options.redirectAfterLogin) {
        // default redirect
        let redirect = options.redirectAfterLogin

        // dynamic redirect
        if (
          options.dynamicRedirect && // dynamic redirect active
          currentRoute.redirect && // has redirect set
          (
            !currentRoute.redirect.userId || // redirect not restricted by user
            currentRoute.redirect.userId === user[options.userIdentifier] // current and previous user are the same
          )
        ) redirect = currentRoute.redirect

        // normalize redirect
        if (typeof redirect === 'string') redirect = {id: redirect}

        dispatch(actions.changeRoute(
          redirect.id,
          redirect.keys,
          redirect.redirect,
        ))
      }
    }

    // LOGOUT
    const logout = () => {
      // swallow LOGOUT when not logged in
      if (!session.loggedIn) return

      logoutInit()
      performLogout(session.user)
        .then(() => logoutSuccess())
        .catch((error) => logoutError(error))
    }

    const logoutInit = () => {
      next(actions.logoutInit())
    }

    const logoutError = (error) => {
      next(actions.logoutError(error))
    }

    const logoutSuccess = () => {
      next(actions.logoutSuccess())

      clearUser()

      // redirect after logout
      if (options.redirectAfterLogout) {
        let redirect = options.redirectAfterLogout

        if (typeof redirect === 'string') redirect = {id: redirect}

        dispatch(actions.changeRoute(
          redirect.id,
          redirect.keys,
          redirect.redirect,
        ))
      }
    }

    // DESTROY SESSION
    const destroySession = () => {
      // swallow DESTROY_SESSION when not logged in
      if (!session.loggedIn) return

      next(action)

      clearUser()

      // redirect after destroy session
      if (options.redirectAfterDestroySession) {
        let redirect = options.redirectAfterDestroySession

        if (typeof redirect === 'string') redirect = {id: redirect}

        // set current route as next redirect
        if (
          options.userIdentifier &&
          options.rememberRouteBeforeDestroySession
        ) {
          redirect.redirect = {
            id: currentRoute.id,
            keys: currentRoute.keys,
            redirect: currentRoute.redirect,
            userId: session.user[options.userIdentifier],
          }
        }

        dispatch(actions.changeRoute(
          redirect.id,
          redirect.keys,
          redirect.redirect,
        ))
      }
    }

    // PERSIST USER
    const persistUser = (user) => {
      const storage = getStorage(user.persist)
      if (storage) storage.setItem(options.storageKey, JSON.stringify(user))
    }

    // CLEAR USER
    const clearUser = () => {
      const storage = getStorage(session.user.persist)
      if (storage) storage.removeItem(options.storageKey)
    }

    // LISTEN TO ACTIONS
    if (action.type === options.CHANGE_ROUTE) accessControl()
    else if (action.type === options.LOGIN) login()
    else if (action.type === options.LOGOUT) logout()
    else if (action.type === options.DESTROY_SESSION) destroySession()
    else next(action)
  }
}

const getStorage = (persist) => {
  let storage = null
  if (persist === 'session' && hasSessionStorage) storage = sessionStorage
  else if (persist === 'local' && hasLocalStorage) storage = localStorage
  return storage
}
