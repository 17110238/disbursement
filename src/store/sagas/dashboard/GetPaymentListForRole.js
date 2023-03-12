import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_PAYMENT_LIST_FOR_ROLE_URL } from 'helpers/constants/url';

function* getPaymentForRole({ payload, callback }) {
  try {
    const response = yield call(callApi, GET_PAYMENT_LIST_FOR_ROLE_URL, { ...payload });
    const data = response?.data;
    if (data.content.length > 0) {
      callback(true, data);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchGetPaymentListForRole() {
  yield takeEvery(types.GET_PAYMENT_LIST_FOR_ROLE_REQUEST, getPaymentForRole);
}

export default watchGetPaymentListForRole;
