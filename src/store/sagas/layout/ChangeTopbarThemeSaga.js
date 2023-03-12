import { changeBodyAttribute } from 'helpers/ui/ManageUIByBody';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* changeTopbarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, 'data-topbar', theme);
  } catch (error) {}
}

export function* watchChangeTopbarTheme() {
  yield takeEvery(types.CHANGE_TOPBAR_THEME, changeTopbarTheme);
}

export default watchChangeTopbarTheme;
