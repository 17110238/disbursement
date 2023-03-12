import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { UPDATE_CLEAR_OS_FAIL_URL } from 'helpers/constants/url';

function* updateClearOSFail({ payload, callback }) {
  try {
    const response = yield call(callApi, UPDATE_CLEAR_OS_FAIL_URL, { ...payload });
    if (response) {
      callback(true, response);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchUpdateClearOSFail() {
  yield takeEvery(types.UPDATE_CLEAR_OS_FAIL, updateClearOSFail);
}

export default watchUpdateClearOSFail;
