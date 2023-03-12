import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_PAYMENT_URL } from 'helpers/constants/url';

function* getPaymentList({ payload, callback }) {
  try {
    const response = yield call(callApi, GET_PAYMENT_URL, { ...payload });
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

function* watchGetPaymentList() {
  yield takeEvery(types.GET_PAYMENT_LIST_REQUEST, getPaymentList);
}

export default watchGetPaymentList;
