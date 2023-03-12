import { callApi } from 'services/axios';
import { POST_ACTIVE_DELEGATION_USER_URL } from 'helpers/constants/url';
import { changeBodyAttribute } from 'helpers/ui/ManageUIByBody';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from 'store/types';
import { setCookie } from 'helpers/Cookie';

function* postActiveDelationUser({ payload, callback }) {
  try {
    const response = yield call(callApi, POST_ACTIVE_DELEGATION_USER_URL, { ...payload });
    const data = response?.data;
    if (Object.keys(data).length > 0) {
      setCookie('userRoles', data.userRoles);
      setCookie('transactionType', data.transactionType);
      setCookie('delegationId', payload.delegationId);
      setCookie('userName', data.userName);
      yield call(changeBodyAttribute, 'data-delegation', 'delegation');
      yield put({
        type: types.SHOW_DELEGATION_USER_FIXED,
      });
      callback?.(true, data);
    }
  } catch (error) {
    callback?.(false, null);
  }
}

export function* watchPostActiveDelationUser() {
  yield takeEvery(types.POST_ACTIVE_DELEGATION_REQUEST, postActiveDelationUser);
}

export default watchPostActiveDelationUser;
