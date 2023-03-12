import { callApi } from 'services/axios';
import { GET_LIST_MY_DELEGATED_URL } from 'helpers/constants/url';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* getListMyDelegated({ callback }) {
  try {
    const response = yield call(callApi, GET_LIST_MY_DELEGATED_URL);
    const data = response?.data;
    if (data?.length > 0) {
      callback?.(true, data);
    }
    callback?.(false, null);
  } catch (error) {
    callback?.(false, null);
  }
}

export function* watchGetListMyDelegated() {
  yield takeEvery(types.GET_LIST_MY_DELEGATED_REQUEST, getListMyDelegated);
}

export default watchGetListMyDelegated;
