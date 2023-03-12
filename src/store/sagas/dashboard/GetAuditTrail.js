import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_AUDIT_TRAILS_URL } from 'helpers/constants/url';

function* getAuditTrail({ payload, callback }) {
  try {
    const response = yield call(callApi, GET_AUDIT_TRAILS_URL, { ...payload });
    const data = response?.data;
    if (data.length > 0) {
      callback(true, data);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchAuditTrail() {
  yield takeEvery(types.GET_AUDIT_TRAIL_REQUEST, getAuditTrail);
}

export default watchAuditTrail;
