import { call, takeEvery, put } from 'redux-saga/effects';
import * as types from 'store/types';
import * as actions from 'store/actions';
import { changeBodyAttribute } from 'helpers/ui/ManageUIByBody';

function* changeLayout({ payload: layout }) {
  try {
    if (layout === 'horizontal') {
      yield put(actions.changeTopbarTheme('dark'));
      document.body.removeAttribute('data-sidebar');
      document.body.removeAttribute('data-sidebar-size');
    } else {
      yield put(actions.changeTopbarTheme('light'));
    }
    yield call(changeBodyAttribute, 'data-layout', layout);
  } catch (error) {}
}

export function* watchChangeLayoutType() {
  yield takeEvery(types.CHANGE_LAYOUT, changeLayout);
}

export default watchChangeLayoutType;
