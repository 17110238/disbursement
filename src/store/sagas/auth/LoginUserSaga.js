import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import * as actions from 'store/actions';
import { callApi } from 'services/axios';
import { URL_LOGIN } from 'helpers/constants/url';

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(callApi, URL_LOGIN, {
      email: user.email,
      password: user.password,
    });
    localStorage.setItem('authUser', JSON.stringify(response));
    yield put(actions.loginSuccess(response));
    history.push('/dashboard');
  } catch (error) {
    yield put(actions.apiError(error));
  }
}

function* watchLoginSaga() {
  yield takeEvery(types.LOGIN_USER, loginUser);
}

export default watchLoginSaga;
