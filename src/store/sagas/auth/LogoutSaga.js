import { takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* logoutUser({ payload: { history } }) {
  localStorage.removeItem('authUser');
  history.push('/login');
}

function* watchLogout() {
  yield takeEvery(types.LOGOUT_USER, logoutUser);
}

export default watchLogout;
