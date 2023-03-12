export default function getPaymentStatus(status) {
  const obj = {
    PROCESSING: ' Processing',
    INVALID: ' Invalid',
    NEW: ' New',
    ALL: 'All',
    CHECKING_FRCM: ' Checking FCRM',
    WAITING_FOR_CHECKER: 'Waiting For Checker',
    CANCELLED: 'Cancelled',
    WAITING_FOR_APPROVAL: 'Waiting For Approval',
    REJECTED_BY_CHECKER: 'Rejected By Checker',
    APPROVED: 'Approved',
    REJECTED_BY_APPROVER: 'Rejected By Approver',
    REJECTED_BY_ACCOUNTING: 'Rejected By Accounting',
    PROCESSED_BY_ACCOUNTING: 'Processed By Accounting',
    SENT_PAYMENT: 'Sent Payment',
    ACK: 'ACK',
    PROCESSED: 'PROCESSED',
    REJECTED_BY_BANK: 'Rejected By Bank',
    CLEAR_OS_SUCCESS: 'Clear OS Success',
    CLEAR_OS_FAIL: 'Clear OS Failed',
    CHECKING_FCRM: 'Checking FCRM',
  };

  if (Array.isArray(status) && status?.length > 0) {
    const keys = Object.keys(obj);
    const result = status?.map((item) => {
      const findKey = keys.find((key) => key === item);
      if (findKey) {
        return {
          label: obj[findKey],
          value: findKey,
        };
      }
    });
    return result;
  }

  return obj[status] || (status ? status : '-');
}
