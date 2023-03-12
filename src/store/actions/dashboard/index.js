import * as types from 'store/types';

export const getPaymentList = (payload, callback) => ({
  type: types.GET_PAYMENT_LIST_REQUEST,
  payload,
  callback,
});

export const getPaymentListForRole = (payload, callback) => ({
  type: types.GET_PAYMENT_LIST_FOR_ROLE_REQUEST,
  payload,
  callback,
});

export const getPaymentDetail = (payload, callback) => ({
  type: types.GET_PAYMENT_DETAIL_REQUEST,
  payload,
  callback,
});

export const postPaymentDetailForMaker = (payload, callback) => ({
  type: types.POST_PAYMENT_FOR_MAKER_REQUEST,
  payload,
  callback,
});

export const postPaymentDetailForChecker = (payload, callback) => ({
  type: types.POST_PAYMENT_FOR_CHECKER_REQUEST,
  payload,
  callback,
});

export const getAuditTrail = (payload, callback) => ({
  type: types.GET_AUDIT_TRAIL_REQUEST,
  payload,
  callback,
});

export const getPresignedDocument = (payload, callback) => ({
  type: types.GET_PRESIGNED_DOCUMENT_REQUEST,
  payload,
  callback,
});

export const updateClearOSFail = (payload, callback) => ({
  type: types.UPDATE_CLEAR_OS_FAIL,
  payload,
  callback,
});
