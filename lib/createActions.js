"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (changeRoute, options) {
  return {
    login: function login(user) {
      return {
        type: options.LOGIN,
        payload: user
      };
    },
    loginInit: function loginInit() {
      return {
        type: options.LOGIN_INIT
      };
    },
    loginSuccess: function loginSuccess(user) {
      return {
        type: options.LOGIN_SUCCESS,
        payload: user
      };
    },
    loginError: function loginError(error) {
      return {
        type: options.LOGIN_ERROR,
        error: true,
        payload: error
      };
    },
    logout: function logout() {
      return {
        type: options.LOGOUT
      };
    },
    logoutInit: function logoutInit() {
      return {
        type: options.LOGOUT_INIT
      };
    },
    logoutError: function logoutError(error) {
      return {
        type: options.LOGOUT_ERROR,
        error: true,
        payload: error
      };
    },
    logoutSuccess: function logoutSuccess() {
      return {
        type: options.LOGOUT_SUCCESS
      };
    },
    destroySession: function destroySession() {
      return {
        type: options.DESTROY_SESSION
      };
    },
    changeRoute: changeRoute
  };
};