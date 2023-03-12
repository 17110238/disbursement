import * as types from 'store/types';

export const loginUser = (user, history) => {
  return {
    type: types.LOGIN_USER,
    payload: { user, history },
  };
};

export const loginSuccess = (user) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutUser = (history) => {
  return {
    type: types.LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = () => {
  return {
    type: types.LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const apiError = (error) => {
  return {
    type: types.API_ERROR,
    payload: error,
  };
};

export const getInfoOfUser = (payload, callback) => ({
  type: types.GET_INFO_OF_USER_REQUEST,
  payload,
  callback,
});
