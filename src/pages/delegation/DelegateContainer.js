import LoadingInline from 'components/loading/LoadingInline';
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';
import {
  getListMyDelegated,
  getListDelegatedTo,
  postCancelDelegationUser,
  postActiveDelegationUser,
} from 'store/actions';
import ActionUser from './modal/ActionUser';
import NewDelegateModal from './modal/NewDelegate';
import ImageNoData from 'assets/images/Nodata.jpg';
import LoadingFullScreen from 'components/loading/LoadingFullScreen';
import listMenuSidebar from 'helpers/constants/listMenuSidebar';
import checkScope from 'helpers/checkScope';
import Notification from 'helpers/ui/Notification';
import { FAIL, SUCCESS } from 'helpers/constants/state';
import { getTransTypeFromCookie, getUserRolesFromCookie } from 'helpers/GetDataFromCookie';

const DelegateContainer = () => {
  const dispatch = useDispatch();
  const ACTIVE = 'ACTIVE';
  const CANCEL = 'CANCEL';
  const [isOpenDelegateModal, setIsOpenDelegateModal] = useState(false);
  const [isOpenActiveUserModal, setIsActiveUserModal] = useState(false);
  const [userNameActive, setUserNameActive] = useState(null);
  const [actionName, setActionName] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const onCloseDelegateModal = () => setIsOpenDelegateModal(false);
  const onCloseActiveUserModal = () => setIsActiveUserModal(false);
  const [myDelegatedData, setMyDelegatedData] = useState([]);
  const [delegatedToData, setDelegatedToData] = useState([]);
  const [delegationId, setDelegationId] = useState(null);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [state, setState] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (activeTab === 1) {
      dispatch(
        getListMyDelegated((status, data) => {
          status && setMyDelegatedData(data);
          setIsLoading(false);
        })
      );
    } else {
      dispatch(
        getListDelegatedTo((status, data) => {
          status && setDelegatedToData(data);
          setIsLoading(false);
        })
      );
    }
  }, [activeTab, state]);

  const handleClick = (action, delegationId, userName) => {
    setIsActiveUserModal(true);
    setActionName(action);
    setUserNameActive(userName);
    setDelegationId(delegationId);
  };

  const onClickAction = () => {
    const payload = {
      delegationId,
    };
    if (actionName === ACTIVE) {
      setIsLoading(true);
      dispatch(
        postActiveDelegationUser(payload, (status, res) => {
          setIsShowNotify(true);
          if (status) {
            setState(SUCCESS);
            setMessage('Active sucess !');
          } else {
            setState(FAIL);
            setMessage('Active fail !');
          }
          setIsLoading(false);
        })
      );
      return;
    }
    if (actionName === CANCEL) {
      setIsLoading(true);
      dispatch(
        postCancelDelegationUser(payload, (status, res) => {
          setIsShowNotify(true);
          if (status) {
            setState(SUCCESS);
            setMessage('Cancel sucess !');
          } else {
            setState(FAIL);
            setMessage('Cancel fail !');
          }
          setIsLoading(false);
        })
      );
      return;
    }
  };

  const myDelegateBody = useMemo(() => {
    return (
      <>
        {myDelegatedData.length > 0 &&
          myDelegatedData?.map((item) => (
            <tr className='text-center' key={item.delegationId}>
              <th>{item?.from || '-'}</th>
              <th>{item?.to || '-'}</th>
              <th>{item?.fromUserId || '-'}</th>
              <th>{getTransTypeFromCookie(item.transactionType)}</th>
              <th>{item?.reason || '-'}</th>
              <th>{item?.status || '-'}</th>
              <th>
                <span
                  className='text-primary cursor-pointer'
                  onClick={() => handleClick(ACTIVE, item.delegationId, item.fromUserId)}>
                  Active
                </span>
              </th>
            </tr>
          ))}
      </>
    );
  }, [myDelegatedData]);

  const delegatedToBody = useMemo(() => {
    return (
      <>
        {delegatedToData?.length > 0 &&
          delegatedToData.map((item) => (
            <tr className='text-center' key={item.delegationId}>
              <th>{item.from || '-'}</th>
              <th>{item.to || '-'}</th>
              <th>{item.toUserId}</th>
              <th>{getTransTypeFromCookie(item.transactionType)}</th>
              <th>{item.reason || '-'}</th>
              <th>{item.status || '-'}</th>
              <th>
                <span
                  className='text-danger cursor-pointer'
                  onClick={() => handleClick(CANCEL, item.delegationId, item.toUserId)}>
                  Cancel
                </span>
              </th>
            </tr>
          ))}
      </>
    );
  }, [delegatedToData]);

  return (
    <>
      <Notification
        state={state}
        message={message}
        isOpen={isShowNotify}
        setIsShowNotify={setIsShowNotify}
      />
      <ActionUser
        isOpen={isOpenActiveUserModal}
        onCloseModal={onCloseActiveUserModal}
        userName={userNameActive}
        onClickAction={onClickAction}
        actionName={actionName}
        setState={setState}
      />
      <NewDelegateModal
        isOpen={isOpenDelegateModal}
        onCloseModal={onCloseDelegateModal}
        setState={setState}
        setMessage={setMessage}
        setIsLoading={setIsLoading}
        setIsShowNotify={setIsShowNotify}
      />
      <LoadingFullScreen loading={isLoading} />
      <div className='delegate-container'>
        <div className='delegate-header'>
          <h4>Delegate</h4>
        </div>
        <div className='delegate-content'>
          <div className='delegate-tab'>
            <div className='d-flex'>
              {checkScope(getUserRolesFromCookie(), listMenuSidebar[1].childrens.myDelegated) && (
                <div
                  className={`delegate-detail ${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => setActiveTab(1)}>
                  My Delegated
                </div>
              )}

              {checkScope(getUserRolesFromCookie(), listMenuSidebar[1].childrens.deletedTo) && (
                <div
                  className={`audit-trail ${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => setActiveTab(2)}>
                  Delegate to
                </div>
              )}
            </div>
            {activeTab === 2 && (
              <button
                onClick={() => setIsOpenDelegateModal(true)}
                className='button btn-delegated-to m-0 bg-secondary rounded-0 '>
                <span> New Delegation</span>
                <i className='ti-plus pt-1 mx-1'></i>
              </button>
            )}
          </div>
          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <table className='table table-bordered table-hover'>
                <thead>
                  <tr className='text-center'>
                    <th scope='col'>EFD from</th>
                    <th scope='col'>EFD to</th>
                    <th scope='col'>Delegated from</th>
                    <th scope='col'>Transaction type</th>
                    <th scope='col'>Reason</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>{myDelegateBody}</tbody>
              </table>
              {/* ) : (
                <div className='no-data'>
                  <img src={ImageNoData} />
                </div>
              )} */}
            </TabPane>

            <TabPane tabId={2}>
              <div className='delegation-to-content'>
                <div className='d-flex align-item-center'></div>

                <table className='table table-bordered table-hover'>
                  <thead>
                    <tr className='text-center'>
                      <th scope='col'>EFD from</th>
                      <th scope='col'>EFD to</th>
                      <th scope='col'>Delegated to</th>
                      <th scope='col'>Transaction type</th>
                      <th scope='col'>Reason</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>{delegatedToBody}</tbody>
                </table>
                {/* ) : (
                  <div className='no-data'>
                    <img src={ImageNoData} alt='No data' />
                  </div>
                )} */}
              </div>
              {/* <button onClick={() => setIsOpenDelegateModal(true)} className='button btn-submit'>
                <span> New Delegation</span>
                <i className='ti-plus pt-1'></i>
              </button> */}
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default DelegateContainer;
