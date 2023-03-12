import { changeBodyAttribute, manageBodyClass } from 'helpers/ui/ManageUIByBody';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';

function* changeLeftSidebarType({ payload: { sidebarType, isMobile } }) {
  try {
    switch (sidebarType) {
      case 'compact':
        yield call(changeBodyAttribute, 'data-sidebar-size', 'small');
        yield call(manageBodyClass, 'sidebar-enable', 'add');
        yield call(manageBodyClass, 'vertical-collpsed', 'remove');
        break;
      case 'icon':
        yield call(changeBodyAttribute, 'data-keep-enlarged', 'true');
        yield call(manageBodyClass, 'vertical-collpsed', 'add');
        break;
      case 'condensed':
        yield call(manageBodyClass, 'sidebar-enable', 'add');
        if (window.screen.width >= 992) {
          yield call(manageBodyClass, 'vertical-collpsed', 'remove');
          yield call(manageBodyClass, 'sidebar-enable', 'remove');
          yield call(manageBodyClass, 'vertical-collpsed', 'add');
          yield call(manageBodyClass, 'sidebar-enable', 'add');
        } else {
          yield call(manageBodyClass, 'sidebar-enable', 'add');
          yield call(manageBodyClass, 'vertical-collpsed', 'add');
        }
        break;
      default:
        yield call(changeBodyAttribute, 'data-sidebar-size', '');
        yield call(manageBodyClass, 'sidebar-enable', 'remove');
        if (!isMobile) yield call(manageBodyClass, 'vertical-collpsed', 'remove');
        break;
    }
  } catch (error) {}
}

export function* watchChangeLeftSidebarType() {
  yield takeEvery(types.CHANGE_SIDEBAR_TYPE, changeLeftSidebarType);
}

export default watchChangeLeftSidebarType;
