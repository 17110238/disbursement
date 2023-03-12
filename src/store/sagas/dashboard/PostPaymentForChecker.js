import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { POST_PAYMENT_FOR_CHECKER_URL } from 'helpers/constants/url';

function* postPayment({ payload, callback }) {
  try {
    const response = yield call(callApi, POST_PAYMENT_FOR_CHECKER_URL, { ...payload });
    if (response) {
      callback(true, response);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchPostPayment() {
  yield takeEvery(types.POST_PAYMENT_FOR_CHECKER_REQUEST, postPayment);
}

export default watchPostPayment;
