import { all, fork } from 'redux-saga/effects';
// auth
import loginUserSaga from './auth/LoginUserSaga';
import logoutSaga from './auth/LogoutSaga';
import AuthenUser from './auth/AuthenUserSaga';
// layout
import changeLayoutSaga from './layout/ChangeLayoutSaga';
import changeLayoutWidthSaga from './layout/ChangeLayoutWidthSaga';
import changeLeftSidebarThemeSaga from './layout/ChangeLeftSidebarThemeSaga';
import changeLeftSidebarTypeSaga from './layout/ChangeLeftSidebarTypeSaga';
import changeTopbarThemeSaga from './layout/ChangeTopbarThemeSaga';
import showRightSidebarSaga from './layout/ShowRightSidebarSaga';
// dasboard
import GetPaymentList from './dashboard/GetPaymentList';
import GetPaymentListForRole from './dashboard/GetPaymentListForRole';
import getPaymentDetail from './dashboard/GetPaymentDetail';
import PostPaymentDetailForMaker from './dashboard/PostPaymentForMaker';
import PostPaymentForChecker from './dashboard/PostPaymentForChecker';
import getAuditTrail from './dashboard/GetAuditTrail';
import GetPresignedDocument from './dashboard/GetPresignedDocument';
import UpdateClearOSFail from './dashboard/UpdateClearOSFail';

// delegation
import PostConfirmDelegatedTo from './delegation/PostConfirmDelegatedTo';
import GetListDelegatedTo from './delegation/GetListDelegatedTo';
import GetListMyDelegated from './delegation/GetListMyDelegated';
import PostActiveUser from './delegation/PostActiveUser';
import PostCancelDelegationuser from './delegation/PostCancelDelegationUser';
import GetListUserFromRoles from './delegation/GetListUserFromRoles';

export default function* rootSaga() {
  yield all([
    fork(loginUserSaga),
    fork(logoutSaga),
    fork(AuthenUser),
    fork(changeLayoutSaga),
    fork(changeLayoutWidthSaga),
    fork(changeLeftSidebarThemeSaga),
    fork(UpdateClearOSFail),
    fork(changeLeftSidebarTypeSaga),
    fork(changeTopbarThemeSaga),
    fork(showRightSidebarSaga),
    fork(PostConfirmDelegatedTo),
    fork(GetPaymentList),
    fork(GetPaymentListForRole),
    fork(GetPresignedDocument),
    fork(getPaymentDetail),
    fork(PostPaymentDetailForMaker),
    fork(PostPaymentForChecker),
    fork(getAuditTrail),
    fork(GetListDelegatedTo),
    fork(GetListMyDelegated),
    fork(PostCancelDelegationuser),
    fork(GetListUserFromRoles),
    fork(PostActiveUser),
  ]);
}
