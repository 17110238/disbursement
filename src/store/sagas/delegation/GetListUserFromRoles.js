import { callApi } from 'services/axios';
import { GET_LIST_USER_FROM_ROLE_URL } from 'helpers/constants/url';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* getListUserFromRoles({ callback }) {
  try {
    const data = yield call(callApi, GET_LIST_USER_FROM_ROLE_URL);
    if (data?.data?.length > 0) {
      return callback?.(true, data.data);
    }
    return callback?.(false, null);
  } catch (error) {
    return callback?.(false, null);
  }
}

export function* watchGetListUserFromRoles() {
  yield takeEvery(types.GET_LIST_USER_FROM_ROLES_REQUEST, getListUserFromRoles);
}

export default watchGetListUserFromRoles;
