import { callApi } from 'services/axios';
import { POST_LIST_PAYMENT_APPROVE_URL } from 'helpers/constants/url';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* postListPaymentApprove({ payload, callback }) {
  try {
    const data = yield call(callApi, POST_LIST_PAYMENT_APPROVE_URL, { ...payload });
    if (data) {
      callback(true, data);
    }
  } catch (error) {
    callback(false, null);
  }
}

export function* watchPostListPaymentApprove() {
  yield takeEvery(types.POST_LIST_PAYMENT_APPROVED_REQUEST, postListPaymentApprove);
}

export default watchPostListPaymentApprove;
