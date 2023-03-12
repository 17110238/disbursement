import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_PAYMENT_DETAIL_URL } from 'helpers/constants/url';

function* getPaymentDetail({ payload, callback }) {
  try {
    const response = yield call(callApi, GET_PAYMENT_DETAIL_URL, { ...payload });
    const data = response?.data;
    if (Object.keys(data).length > 0) {
      callback(true, data);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchGetPaymentDetail() {
  yield takeEvery(types.GET_PAYMENT_DETAIL_REQUEST, getPaymentDetail);
}

export default watchGetPaymentDetail;
