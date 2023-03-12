import * as types from 'store/types';

const initialState = {
  error: '',
  loading: false,
  TransactionType: [],
  userRoles: [],
  userId: null,
  userName: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case types.LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;
    case types.LOGOUT_USER:
      state = { ...state };
      break;
    case types.LOGOUT_USER_SUCCESS:
      state = { ...state };
      break;
    case types.API_ERROR:
      state = { ...state, error: action.payload, loading: false };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
