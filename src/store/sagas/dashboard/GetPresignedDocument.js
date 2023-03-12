import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_PRESIGNED_URL } from 'helpers/constants/url';

function* getPresignedDocument({ payload, callback }) {
  try {
    const response = yield call(callApi, GET_PRESIGNED_URL, { ...payload });
    const data = response?.data?.url;
    if (data) {
      callback(true, data);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, null);
  }
}

function* watchGetPresignedDocument() {
  yield takeEvery(types.GET_PRESIGNED_DOCUMENT_REQUEST, getPresignedDocument);
}

export default watchGetPresignedDocument;
