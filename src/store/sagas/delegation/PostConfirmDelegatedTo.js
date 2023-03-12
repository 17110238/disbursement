import { callApi } from 'services/axios';
import { POST_CONFIRM_DELEGATE_TO_URL } from 'helpers/constants/url';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* postConfirmDelegatedTo({ payload, callback }) {
  try {
    const data = yield call(callApi, POST_CONFIRM_DELEGATE_TO_URL, { ...payload });
    if (data) {
      return callback(true, data);
    }
    return callback(false, null);
  } catch (error) {
    return callback(false, null);
  }
}

export function* watchPostConfirmDelegatedTo() {
  yield takeEvery(types.POST_CONFIRM_DELEGATE_TO_REQUEST, postConfirmDelegatedTo);
}

export default watchPostConfirmDelegatedTo;
