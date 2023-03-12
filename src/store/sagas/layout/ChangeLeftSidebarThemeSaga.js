import { changeBodyAttribute } from 'helpers/ui/ManageUIByBody';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* changeLeftSidebarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, 'data-sidebar', theme);
  } catch (error) {}
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(types.CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme);
}

export default watchChangeLeftSidebarTheme;
