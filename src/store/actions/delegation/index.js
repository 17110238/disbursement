import * as types from 'store/types';

export const postConfirmDelegatedTo = (payload, callback) => ({
  type: types.POST_CONFIRM_DELEGATE_TO_REQUEST,
  payload,
  callback,
});

export const getListMyDelegated = (callback) => ({
  type: types.GET_LIST_MY_DELEGATED_REQUEST,
  callback,
});

export const getListDelegatedTo = (callback) => ({
  type: types.GET_DELEGATE_TO_REQUEST,
  callback,
});

export const postActiveDelegationUser = (payload, callback) => ({
  type: types.POST_ACTIVE_DELEGATION_REQUEST,
  payload,
  callback,
});

export const postCancelDelegationUser = (payload, callback) => ({
  type: types.POST_CANCEL_DELEGATION_USER_REQUEST,
  payload,
  callback,
});

export const getListUserFromRoles = (callback) => ({
  type: types.GET_LIST_USER_FROM_ROLES_REQUEST,
  callback,
});
