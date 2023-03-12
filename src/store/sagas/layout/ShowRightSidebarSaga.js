import { manageBodyClass } from 'helpers/ui/ManageUIByBody';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* showRightSidebar() {
  try {
    yield call(manageBodyClass, 'right-bar-enabled', 'add');
  } catch (error) {}
}

export function* watchShowRightSidebar() {
  yield takeEvery(types.SHOW_RIGHT_SIDEBAR, showRightSidebar);
}

export default watchShowRightSidebar;
