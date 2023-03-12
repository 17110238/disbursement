import { call, takeEvery, put } from 'redux-saga/effects';
import * as types from 'store/types';
import * as actions from 'store/actions';
import { changeBodyAttribute } from 'helpers/ui/ManageUIByBody';

function* changeLayoutWidth({ payload: width }) {
  try {
    if (width === 'boxed') {
      yield put(actions.changeSidebarType('icon'));
      yield call(changeBodyAttribute, 'data-layout-size', width);
    } else {
      yield put(actions.changeSidebarType('default'));
      yield call(changeBodyAttribute, 'data-layout-size', width);
    }
  } catch (error) {}
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(types.CHANGE_LAYOUT_WIDTH, changeLayoutWidth);
}

export default watchChangeLayoutWidth;
