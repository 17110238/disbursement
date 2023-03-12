import { callApi } from 'services/axios';
import { GET_LIST_DELEGATED_TO_URL } from 'helpers/constants/url';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'store/types';

function* getListDelegatedTo({ callback }) {
  try {
    const response = yield call(callApi, GET_LIST_DELEGATED_TO_URL);
    const data = response?.data;
    if (data?.length > 0) {
      callback?.(true, data);
    }
    callback?.(false, null);
  } catch (error) {
    callback?.(false, null);
  }
}

export function* watchGetListDelegatedTo() {
  yield takeLatest(types.GET_DELEGATE_TO_REQUEST, getListDelegatedTo);
}

export default watchGetListDelegatedTo;
