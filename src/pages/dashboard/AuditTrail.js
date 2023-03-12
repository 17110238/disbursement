import LoadingInline from 'components/loading/LoadingInline';
import React, { useState, useEffect, memo, useMemo, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { getAuditTrail } from 'store/actions/dashboard';
import ImageNoData from 'assets/images/Nodata.jpg';
import { getDelegationIdFromCookie } from 'helpers/GetDataFromCookie';
import PropTypes from 'prop-types';
const AuditTrail = ({ activeTab, paymentId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [auditTrailData, setAuditTrailData] = useState([]);

  useEffect(() => {
    if (activeTab === 2) {
      const payload = {
        paymentId,
      };
      if (getDelegationIdFromCookie()) {
        payload.delegationId = getDelegationIdFromCookie();
      }
      setIsLoading(true);
      dispatch(
        getAuditTrail(payload, (status, data) => {
          setIsLoading(false);
          setAuditTrailData(data);
        })
      );
    }
  }, [activeTab]);

  const dataAudit = useMemo(() => {
    return (
      auditTrailData?.length > 0 &&
      auditTrailData?.map((item, index) => (
        <tr className='text-center' key={index}>
          <Fragment key={index}>
            <th>{item?.paymentId || '-'}</th>
            <th>{item?.action || '-'}</th>
            <th>{item?.applicationStatus || '-'}</th>
            <th>{item?.authorizedBy || '-'}</th>
            <th>{item?.updatedBy || '-'}</th>
          </Fragment>
        </tr>
      ))
    );
  }, [auditTrailData]);

  return (
    <div className='audit-trail'>
      <LoadingInline loading={isLoading} />
      {auditTrailData?.length > 0 ? (
        <table className='table table-bordered table-hover'>
          <thead className='bg-primary'>
            <tr className='text-center'>
              <th scope='col'>Payment Id</th>
              <th scope='col'>Action</th>
              <th scope='col'>Application Status</th>
              <th scope='col'>Authorized By</th>
              <th scope='col'>Updated By</th>
            </tr>
          </thead>
          <tbody>{dataAudit}</tbody>
        </table>
      ) : (
        <div className='d-flex justify-content-center align-items-center h-100 w-100'>
          {isLoading ? (
            ''
          ) : (
            <img
              src={ImageNoData}
              style={{ width: '150px', height: '150px', marginTop: '60px' }}
              alt='image'
            />
          )}
        </div>
      )}
    </div>
  );
};

AuditTrail.propTypes = {
  activeTab: PropTypes.number,
  paymentId: PropTypes.string,
};

export default memo(AuditTrail);
