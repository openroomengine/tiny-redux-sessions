# Tiny redux sessions

## API surface
- `enableSessions(performLogin, performLogout, changeRoute, options)`

### User

    {
      role: String,
      // whatever-you-want
    }

### performLogin
- in: User
- out: Promise
  - fulfill: User
  - reject: Error

### performLogout
- in: User
- out: Promise
  - fulfill: Void
  - reject: Error

### changeRoute
- action creator you get from tiny redux router
- in: id: String, keys: Object, redirect: Object
  - id: route id
  - keys: `:name` in route path
  - redirect: object with changeRoute arguments

### LOGIN action
- payload: User

### LOGIN_INIT action
- payload: Void

### LOGIN_ERROR action
- error: true
- payload: Error

### LOGIN_SUCCESS action
- payload: User (value from performLogin)

### LOGOUT action
- payload: Void

### LOGOUT_INIT action
- payload: Void

### LOGOUT_ERROR action
- error: true
- payload: Error

### LOGOUT_SUCCESS action
- payload: Void

### DESTROY_SESSION action
Destroy the current session on client side (because it was destroyed already on server side.)
Call this action when the server rejects the currently active session.
(e.g. You are successfully logged in -> server terminates session -> [not knowing about the termination; one-way communication] you request a resource using the aforementioned session -> server responds with [say] 401 -> [knowing the server has terminated aforementioned session] you call DESTROY_SESSION)

## Notes
- sessionMiddleware should be placed after routerEnhancer in order to catch all events
- access control does not apply to login and logout routes
- `changeRoute('logout')` does never hit reducer, instead logout procedure is performed and user is redirected to `logoutRedirect` (default: `login`).
- best to wrap `sessionActions.login` in another function that provides an api for the keys you want to use on the user object.
- lib user himself is responsible for resetting the store after logout and/or unauthorized (if necessary) (after all, we don't know what's safe to persist...)
- lib user himself is responsible for persisting sessions through refreshes (after all, we don't know what you need to persist, what's safe to persist and how you want to do it (cookies, sessionStorage, localStorage))
- lib user himself is responsible to call DESTROY_SESSION when appropriate.

## Regarding 401
https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
https://www.loggly.com/blog/http-status-code-diagram/

## ServerError
Creates a generic error with the http status response and http status name as message (e.g. 401: Unauthorized).
Also attaches the response object, meaning you have access to all relevant info in the middleware chain and reducers.

## Middleware
                                         +- sessionMiddleware -+
    -- unrelated action ---------------> |                     | -- unrelated action ----->
    -- CHANGE_ROUTE x -----------------> | access allowed      | -- CHANGE_ROUTE x ------->
                                         | access denied       | -- CHANGE_ROUTE login --->
