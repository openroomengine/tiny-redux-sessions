export default (changeRoute, options) => ({
  login: (user) => ({
    type: options.LOGIN,
    payload: user,
  }),
  loginInit: () => ({
    type: options.LOGIN_INIT,
  }),
  loginSuccess: (user) => ({
    type: options.LOGIN_SUCCESS,
    payload: user,
  }),
  loginError: (error) => ({
    type: options.LOGIN_ERROR,
    error: true,
    payload: error,
  }),
  logout: () => ({
    type: options.LOGOUT,
  }),
  logoutInit: () => ({
    type: options.LOGOUT_INIT,
  }),
  logoutError: (error) => ({
    type: options.LOGOUT_ERROR,
    error: true,
    payload: error,
  }),
  logoutSuccess: () => ({
    type: options.LOGOUT_SUCCESS,
  }),
  destroySession: () => ({
    type: options.DESTROY_SESSION,
  }),
  changeRoute,
})
