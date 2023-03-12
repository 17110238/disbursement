import { listTransactionType } from './constants/optionStatus';
import { getCookie } from './Cookie';

export function getTransTypeFromCookie(transType) {
  const getTranxFromCookie = getCookie('transactionType');
  if (transType) {
    if (Array.isArray(transType) && transType?.length > 0) {
      return transType.map((trans, index) => {
        const findTrx = listTransactionType.find((item) => item.value === trans);
        if (index === transType.length - 1) {
          return findTrx.label;
        } else {
          return findTrx.label + ', ';
        }
      });
    } else {
      return listTransactionType.find((item) => item.value === transType);
    }
  } else {
    const arrayTran = [];
    if (getTranxFromCookie?.length > 0) {
      getTranxFromCookie.map((item) => {
        const obj = {};
        const findTrx = listTransactionType.find((trx) => trx.value === item);
        if (findTrx) {
          obj.value = findTrx.value;
          obj.label = findTrx.label;
          arrayTran.push(obj);
        }
      });
      return arrayTran;
    }
  }
}

export function getUserRolesFromCookie() {
  const getUserRoles = getCookie('userRoles');
  if (getUserRoles?.length > 0) {
    return getUserRoles;
  } else {
    return getUserRoles;
  }
}

export function getDelegationIdFromCookie() {
  const getDelegationId = getCookie('delegationId');
  return getDelegationId;
}

export function getUserIdFromCookie() {
  const getUserId = getCookie('userId');
  return getUserId;
}
