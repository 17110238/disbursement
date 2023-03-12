import React, { useCallback, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import servicesIcon1 from 'assets/images/services-icon/01.png';
import servicesIcon2 from 'assets/images/services-icon/02.png';
import servicesIcon3 from 'assets/images/services-icon/03.png';
import servicesIcon4 from 'assets/images/services-icon/04.png';
import DataTable from 'components/datatable';
import PaymentDetails from './PaymentDetails';
import {
  getPaymentDetail,
  getPaymentList,
  getPaymentListForRole,
  postPaymentDetailForChecker,
  updateClearOSFail,
} from 'store/actions/dashboard';
import { useDispatch } from 'react-redux';
import Boxsearch from './BoxSearch';
import {
  APPROVED,
  APPROVE_PAYMENT,
  CANCEL_PAYMENT,
  FAIL,
  MAIN_SCREEN,
  NEW,
  REJECTED,
  PAYMENT_DETAILS_SCREEN,
  REJECT_PAYMENT,
  REPLACE_FILE_EXIST,
  SAVE_PAYMENT,
  SUBMIT_PAYMENT,
  WAITING_FOR_APPROVAL,
  WAITING_FOR_CHECKER,
  WARNING,
  ALL,
  APPROVE_MULTI_PAYMENT,
  UPDATE_CLEAR_OS_FAIL,
} from 'helpers/constants/state';
import { handleFormatMoney } from 'helpers/formatNumber';
import { postPaymentDetailForMaker } from 'store/actions/dashboard';
import Notification from 'helpers/ui/Notification';
import checkScope from 'helpers/checkScope';
import { listPaymentStatus } from 'helpers/constants/optionStatus';
import Note from './modal/Note';
import FCRM from './modal/FCRM';
import uploadFile from 'services/uploadFile';
import { formatDate } from 'helpers/formatDate';
import {
  getDelegationIdFromCookie,
  getTransTypeFromCookie,
  getUserRolesFromCookie,
} from 'helpers/GetDataFromCookie';
import getPaymentStatus from 'helpers/GetPaymentStatus';
import getFRCMStatus from 'helpers/getFRCMStatus';

const handleShowImage = (index) => {
  let image = null;
  switch (index) {
    case 1:
      image = servicesIcon1;
      break;
    case 2:
      image = servicesIcon2;
      break;
    case 3:
      image = servicesIcon3;
      break;
    case 4:
      image = servicesIcon4;
      break;
    default:
      break;
  }
  return image;
};

const Index = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(20);
  const [activeTab, setActiveTab] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isShowScreen, setIsShowScreen] = useState(MAIN_SCREEN);
  const [submitForm, setSubmitForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [isShowNote, setIsShowNote] = useState(false);
  const [isShowFCRM, setIsShowFCRM] = useState(false);
  const [paymentDetailData, setPaymentDetailData] = useState({});
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [message, setMessage] = useState(null);
  const [state, setState] = useState(null);
  const [dataSelectedRow, setDataSelectedRow] = useState([]);
  const [nameAction, setNameAction] = useState(null);
  const delegationId = getDelegationIdFromCookie();
  const handleSubmitSearch = (data) => {
    const filterNew = { ...data };
    if (delegationId) {
      filterNew.delegationId = delegationId;
    }
    setFilter({ ...filterNew });
    setSubmitForm(true);
  };

  const handleGetListPayment = () => {
    function handleGetListPayment(payload) {
      if (delegationId) {
        payload.delegationId = delegationId;
      }
      setIsLoading(true);
      if (activeTab === 1) {
        dispatch(
          getPaymentList(payload, (status, data) => {
            if (status) {
              setTableData(data.content);
              setPaging(data.lastEvaluatedKey);
            } else {
              setTableData([]);
              setPaging(null);
            }
            setSubmitForm(false);
            setIsLoading(false);
          })
        );
      } else {
        dispatch(
          getPaymentListForRole(payload, (status, data) => {
            if (status) {
              setTableData(data.content);
              setPaging(data.lastEvaluatedKey);
            } else {
              setTableData([]);
              setPaging(null);
            }
            setSubmitForm(false);
            setIsLoading(false);
          })
        );
      }
    }
    return {
      filter,
      getList: handleGetListPayment,
      submitForm,
      setSubmitForm,
    };
  };

  const handleActiveTab = (itemTab) => {
    if (itemTab) {
      const data = {};
      switch (itemTab) {
        case 1:
          data.paymentStatus = [ALL];
          break;
        case 2:
          data.paymentStatus = [WAITING_FOR_CHECKER];
          break;
        case 3:
          data.paymentStatus = [WAITING_FOR_APPROVAL];
          break;
        case 4:
          data.paymentStatus = [APPROVED];
          break;
        default:
          break;
      }
      setFilter({ ...data });
      setActiveTab(itemTab);
      setSubmitForm(true);
    }
  };

  const handleActionForMaker = (payload) => {
    if (nameAction !== SAVE_PAYMENT) {
      setIsShowScreen(MAIN_SCREEN);
    }
    dispatch(
      postPaymentDetailForMaker(payload, (status, res) => {
        if (status) {
          setMessage('Update Success !');
          setState('SUCCESS');
        } else {
          setMessage('Update Fail !');
          setState('FAIL');
        }
        setIsLoading(false);
        setSubmitForm(true);
        setIsShowNotify(true);
      })
    );
  };

  const handleActionForChecker = (payload) => {
    setIsShowScreen(MAIN_SCREEN);
    dispatch(
      postPaymentDetailForChecker(payload, (status, res) => {
        if (status) {
          setMessage('Update Success !');
          setState('SUCCESS');
        } else {
          setMessage('Update Fail !');
          setState('FAIL');
        }
        setIsLoading(false);
        setSubmitForm(true);
        setIsShowNotify(true);
      })
    );
  };

  const handler = async (payload, action) => {
    setIsShowNote(false);

    const checkerPayload = {
      paymentId:
        action === APPROVE_PAYMENT || REJECT_PAYMENT ? [payload?.paymentId] : payload?.paymentId,
    };

    if (delegationId) {
      checkerPayload.delegationId = delegationId;
    }

    switch (action) {
      case REJECT_PAYMENT:
        setIsLoading(true);
        checkerPayload.note = payload.note;
        switch (payload.paymentStatus) {
          case WAITING_FOR_CHECKER:
            checkerPayload.actionType = 'CHECKER_REJECT';
            break;
          case WAITING_FOR_APPROVAL:
            checkerPayload.actionType = 'APPROVAL_REJECT';
            break;
          case APPROVED:
            checkerPayload.actionType = 'ACCOUNTING_REJECT';
            break;
          default:
            break;
        }
        handleActionForChecker(checkerPayload);
        break;
      case APPROVE_PAYMENT:
        setIsLoading(true);
        switch (payload.paymentStatus) {
          case WAITING_FOR_CHECKER:
            checkerPayload.actionType = 'CHECKER_APPROVE';
            break;
          case WAITING_FOR_APPROVAL:
            checkerPayload.actionType = 'APPROVAL_APPROVE';
            break;
          case APPROVED:
            checkerPayload.actionType = 'ACCOUNTING_APPROVE';
            break;
          default:
            break;
        }
        handleActionForChecker(checkerPayload);
        break;
      case APPROVE_MULTI_PAYMENT:
        handleActionForChecker({
          paymentId: payload,
          actionType: 'CHECKER_APPROVE',
        });
        break;
      case SAVE_PAYMENT:
      case SUBMIT_PAYMENT:
      case CANCEL_PAYMENT:
        setIsLoading(true);
        const markerPayload = {
          ...payload,
        };
        if (delegationId) {
          markerPayload.delegationId = delegationId;
        }
        const isHasNewFile = payload?.documentDetails?.some((file) => file.status);

        action === SAVE_PAYMENT
          ? (markerPayload.actionType = 'SAVE')
          : action === SUBMIT_PAYMENT
          ? (markerPayload.actionType = 'SUBMIT')
          : (markerPayload.actionType = 'CANCEL');

        if (action === CANCEL_PAYMENT) {
          handleActionForMaker(markerPayload);
          break;
        }
        if (markerPayload?.documentDetails?.length > 0 && isHasNewFile) {
          const formData = new FormData();
          formData.append('paymentId', markerPayload.paymentId);
          formData.append('transactionTypeId', markerPayload.transactionTypeId);
          markerPayload.documentDetails.map((doc) => {
            formData.append('file', doc.path);
          });
          const res = await uploadFile(formData);
          const documentS3 = res?.data?.data?.documents;
          if (documentS3?.length > 0) {
            const documentDetailsNew = markerPayload.documentDetails.map((doc) => {
              const findURL = documentS3?.find((item) => item.name === doc.documentName);
              if (findURL) {
                const docNew = {
                  ...doc,
                  path: findURL?.name,
                };
                docNew?.status && delete docNew.status;
                return docNew;
              }
              return doc;
            });
            const payloadData = {
              ...markerPayload,
              documentDetails: [...documentDetailsNew],
            };
            handleActionForMaker(payloadData);
          }
          setIsLoading(false);
        } else {
          handleActionForMaker(markerPayload);
        }
        break;
      case REPLACE_FILE_EXIST:
        if (payload?.documentDetails.length > 0 && payload?.fileExist) {
          const filterDocument = payload.documentDetails.filter((item) => {
            return item.documentName !== payload.fileExist.documentName;
          });
          const documentDetailsNew = {
            ...payload,
            documentDetails: [...filterDocument, payload.fileExist],
          };
          setPaymentDetailData(documentDetailsNew);
        }
        break;
      case UPDATE_CLEAR_OS_FAIL:
        dispatch(
          updateClearOSFail(payload, (status, res) => {
            if (status) {
            }
          })
        );

        break;
      default:
        break;
    }
  };

  const handleShowModal = (status, paymentData) => {
    const paymentId = paymentData?.paymentId;
    if (paymentId) {
      if (status === 'FCRM') {
        handleOpenPaymentDetail(paymentId);
        setIsShowFCRM(true);
      } else {
        setIsShowNote(true);
        setPaymentDetailData(paymentData);
        setNameAction(SAVE_PAYMENT);
      }
    }
  };

  const onClickBackToDashboard = () => {
    setIsShowScreen(MAIN_SCREEN);
  };

  const handleCloseNote = useCallback(() => {
    setIsShowNote(false);
  }, [isShowNote]);

  const handleCloseFCRM = useCallback(() => {
    setIsShowFCRM(false);
  }, [isShowFCRM]);

  const handleOpenPaymentDetail = (paymentId, screen) => {
    let payload = {
      paymentId,
    };

    if (delegationId) {
      payload.delegationId = delegationId;
    }
    setIsLoading(true);
    dispatch(
      getPaymentDetail(payload, (status, res) => {
        res && setPaymentDetailData(res);
        setIsLoading(false);
        screen === PAYMENT_DETAILS_SCREEN && setIsShowScreen(screen);
      })
    );
  };

  const COLUMNS = [
    {
      Header: 'Payment ID',
      accessor: 'paymentId',
      Cell: ({ row }) => {
        return (
          <span
            className='text-primary cursor-pointer'
            onClick={() =>
              handleOpenPaymentDetail(row?.original?.paymentId, PAYMENT_DETAILS_SCREEN)
            }>
            {row?.original?.paymentId || '-'}
          </span>
        );
      },
      minWidth: 201,
      maxWidth: 390,
    },
    {
      Header: 'Policy no',
      accessor: 'policyNo',
      minWidth: 150,
      maxWidth: 200,
      Cell: ({ row }) => {
        return <p className='text-left'> {row?.original?.policyNo || '-'}</p>;
      },
    },

    {
      Header: 'PO name',
      accessor: 'policyOwnerName',
      minWidth: 280,
      Cell: ({ row }) => {
        return <p> {row?.original?.policyOwnerName || '-'}</p>;
      },
    },
    {
      Header: 'Transaction type',
      accessor: 'transactionTypeId',
      minWidth: 200,
      Cell: ({ row }) => {
        return <p> {getTransTypeFromCookie(row?.original?.transactionTypeId)?.label || '-'}</p>;
      },
    },
    {
      Header: 'Requested by',
      accessor: 'requestedBy',
      minWidth: 180,
      maxWidth: 200,
      Cell: ({ row }) => {
        return <p> {row?.original?.requestedBy || '-'}</p>;
      },
    },
    {
      Header: 'Requested date',
      accessor: 'requestedDate',
      minWidth: 108,
      maxWidth: 200,
      Cell: ({ row }) => {
        return (
          <p> {row?.original?.requestedDate ? formatDate(row?.original?.requestedDate) : '-'}</p>
        );
      },
    },
    {
      Header: 'Payee name',
      accessor: 'payeeName',
      minWidth: 280,
      Cell: ({ row }) => {
        return <p> {row?.original?.payeeName || '-'}</p>;
      },
    },
    {
      Header: 'Amount (VND)',
      accessor: 'amount',
      minWidth: 100,
      maxWidth: 180,
      Cell: ({ row }) => {
        return <p className='text-right m-0'>{handleFormatMoney(row?.original?.amount) || '-'}</p>;
      },
    },
    {
      Header: 'FCRM Status',
      accessor: 'fcrmStatus',
      width: 200,
      Cell: ({ row }) => {
        return (
          <div
            className='text-primary cursor-pointer'
            onClick={() => {
              if (
                row?.original?.paymentStatus === NEW ||
                row?.original?.paymentStatus === REJECTED
              ) {
                handleShowModal('FCRM', row?.original);
              } else {
                setState(FAIL);
                setMessage('Application has been sumitted and user cannot update FCRM decision.');
                setIsShowNotify(true);
              }
            }}>
            {getFRCMStatus(row?.original?.fcrmStatus)}
          </div>
        );
      },
    },
    {
      Header: 'Payment Status',
      accessor: 'paymentStatus',
      minWidth: 240,
      Cell: ({ row }) => {
        return <p> {getPaymentStatus(row?.original?.paymentStatus)}</p>;
      },
    },
    {
      Header: 'Actions',
      width: 100,
      Cell: ({ row }) => {
        return (
          <div className='d-flex align-items-center text-primary cursor-pointer font-size-24'>
            <div onClick={() => handleShowModal('NOTE', row?.original)}>
              {row?.original?.note ? (
                <i title='View note' className='mdi mdi-eye text-success' />
              ) : (
                <i title='Note' className='mdi mdi-pencil-circle' />
              )}
            </div>
            {row?.original?.paymentStatus === 'CLEAR_OS_FAIL' && (
              <i
                onClick={() => handleUpdateCOF(row?.original?.paymentId)}
                title='Clear OS fail'
                className='mdi mdi-update mx-2'
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleUpdateCOF = (paymentId) => {
    setNameAction(UPDATE_CLEAR_OS_FAIL);
    setState(WARNING);
    setMessage('Do you want to update payment status to Clear OS success ?');
    setIsShowNotify(true);
    setPaymentDetailData({ paymentId });
  };

  const onDataSelectedRow = (data) => {
    setDataSelectedRow(data);
  };

  const onClickApprove = () => {
    setNameAction(APPROVE_MULTI_PAYMENT);
    setState(WARNING);
    setMessage('Are you sure want to Approve this payment request ?');
    setPaymentDetailData(dataSelectedRow);
    setIsShowNotify(true);
  };

  return (
    <div className='dashboard-container'>
      <FCRM
        isOpen={isShowFCRM}
        handleClose={handleCloseFCRM}
        paymentDetailData={paymentDetailData}
        callback={handler}
      />
      <Note
        isOpen={isShowNote}
        handleClose={handleCloseNote}
        paymentDetailData={paymentDetailData}
        callback={handler}
        nameAction={nameAction}
      />
      <Notification
        state={state}
        message={message}
        isOpen={isShowNotify}
        setIsShowNotify={setIsShowNotify}
        callback={handler}
        data={paymentDetailData}
        nameAction={nameAction}
      />
      {isShowScreen === MAIN_SCREEN && (
        <Container fluid={true} className='mt-4'>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <Row>
                    {listPaymentStatus.map((item, index) => {
                      if (
                        item.scopes.length === 0 ||
                        checkScope(getUserRolesFromCookie(), item.scopes)
                      ) {
                        return (
                          <Col xl={3} md={6} key={index}>
                            <Card
                              className={`mini-stat ${activeTab === index + 1 ? 'current' : ''}`}
                              onClick={() => handleActiveTab(index + 1)}>
                              <CardBody className='mini-body'>
                                <div className='title'>{item.title}</div>
                                <div className='mini-stat-img'>
                                  <img src={handleShowImage?.(index + 1)} alt='' />
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      }
                    })}
                  </Row>
                  <Boxsearch
                    handleSubmitSearch={handleSubmitSearch}
                    isLoading={isLoading}
                    activeTab={activeTab}
                    onClickApprove={onClickApprove}
                    dataSelectedRow={dataSelectedRow}
                    delegationId={delegationId}
                    filter={filter}
                  />
                  <div className='data-table'>
                    <DataTable
                      tableData={tableData}
                      paging={paging}
                      tableColumn={COLUMNS}
                      isLoading={isLoading}
                      getDataList={handleGetListPayment}
                      onDataSelectedRow={onDataSelectedRow}
                      limit={limit}
                      setLimit={setLimit}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      {isShowScreen === PAYMENT_DETAILS_SCREEN && (
        <PaymentDetails
          onClickBackToDashboard={onClickBackToDashboard}
          setIsShowNotify={setIsShowNotify}
          paymentDetailData={paymentDetailData}
          setPaymentDetailData={setPaymentDetailData}
          setMessage={setMessage}
          isLoading={isLoading}
          setState={setState}
          setNameAction={setNameAction}
          delegationId={delegationId}
          setIsShowNote={setIsShowNote}
          isShowNote={isShowNote}
        />
      )}
    </div>
  );
};

export default Index;
