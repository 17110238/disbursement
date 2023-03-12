import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { callApi } from 'services/axios';
import { GET_INFO_OF_USER_URL } from 'helpers/constants/url';
import { setCookie } from 'helpers/Cookie';

function* getInfoOfUser({ payload, callback }) {
  try {
    setCookie('ssid', payload.ssid);
    const response = yield call(callApi, GET_INFO_OF_USER_URL, { ...payload });
    const data = response?.data;
    if (Object.keys(data).length > 0) {
      setCookie('userRoles', data.userRoles);
      setCookie('transactionType', data.transactionType);
      setCookie('userId', data.userId);
      callback(true);
    } else {
      callback(false);
    }
  } catch (error) {
    callback(false);
  }
}

function* watchGetInfoOfUser() {
  yield takeEvery(types.GET_INFO_OF_USER_REQUEST, getInfoOfUser);
}

export default watchGetInfoOfUser;
