import { callApi } from 'services/axios';
import { POST_CANCEL_DELEGATION_USER_URL } from 'helpers/constants/url';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* postCancelDelegationuser({ payload, callback }) {
  try {
    const data = yield call(callApi, POST_CANCEL_DELEGATION_USER_URL, { ...payload });
    if (data) {
      // yield put({
      //   type: types.HIDE_DELEGATION_USER_FIXED,
      // });
      callback?.(true, data);
    }
  } catch (error) {
    callback?.(false, null);
  }
}

export function* watchPostCancelDelegationuser() {
  yield takeEvery(types.POST_CANCEL_DELEGATION_USER_REQUEST, postCancelDelegationuser);
}

export default watchPostCancelDelegationuser;
