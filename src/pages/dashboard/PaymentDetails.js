import React, { useState, useMemo, useRef, Fragment, useEffect } from 'react';
import { Col, Form, FormGroup, InputGroup, Label, Row, TabContent, TabPane } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import FileSaver from 'file-saver';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { onlyNumber } from 'helpers/onlyNumber';
import { handleFormatMoney } from 'helpers/formatNumber';
import {
  currencyOption,
  optionCountry,
  bankCountry,
  listTransactionType,
  listPaymentStatus,
} from 'helpers/constants/optionStatus';
import {
  NEW,
  REJECTED,
  APPROVED,
  WAITING_FOR_CHECKER,
  WAITING_FOR_APPROVAL,
  SAVE_PAYMENT,
  APPROVE_PAYMENT,
  REJECT_PAYMENT,
  CANCEL_PAYMENT,
  REPLACE_FILE_EXIST,
  SUBMIT_PAYMENT,
} from 'helpers/constants/state';
import AuditTrail from './AuditTrail';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getPresignedDocument } from 'store/actions/dashboard';
import convertTextVNToEN from 'helpers/convertTextVNToEN';
import { formatDate } from 'helpers/formatDate';
import { getUserIdFromCookie, getUserRolesFromCookie } from 'helpers/GetDataFromCookie';
import getFRCMStatus from 'helpers/getFRCMStatus';
import LoadingFullScreen from 'components/loading/LoadingFullScreen';
import formatRejectReason from 'helpers/formatRejectReason';

const PaymentDetail = ({
  onClickBackToDashboard,
  paymentDetailData,
  setPaymentDetailData,
  setMessage,
  setState,
  isLoading,
  setIsShowNotify,
  setNameAction,
  setIsShowNote,
}) => {
  const {
    register,
    getValues,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'submit',
    reValidateMode: 'onSubmit',
  });

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const fileInput = useRef({});
  const watchPaymentMethod = watch('paymentMethod');
  const watchDocumentDetails = watch('documentDetails') || [];

  useEffect(() => {
    for (let item in paymentDetailData) {
      paymentDetailData[item] && setValue(`${item}`, paymentDetailData[item]);
    }
    setValue('amount', handleFormatMoney(paymentDetailData.amount) || '');
  }, []);

  useEffect(() => {
    if (paymentDetailData?.documentDetails?.length > 0) {
      setValue('documentDetails', paymentDetailData.documentDetails);
    }
  }, [paymentDetailData]);

  const onActionForMaker = () => {
    if (paymentDetailData.paymentStatus === NEW || paymentDetailData.paymentStatus === REJECTED) {
      return false;
    }
    return true;
  };

  const onApproveOrReject = () => {
    // const isRoleChecker = listPaymentStatus[1].scopes.some((role) => {
    //   const find = getUserRolesFromCookie()?.find((item) => item === role);
    //   if (find) {
    //     return true;
    //   }
    // });
    // const isRoleApprove = listPaymentStatus[2].scopes.some((role) => {
    //   const find = getUserRolesFromCookie()?.find((item) => item === role);
    //   if (find) {
    //     return true;
    //   }
    // });
    // const isRoleAccounting = listPaymentStatus[3].scopes.some((role) => {
    //   const find = getUserRolesFromCookie()?.find((item) => item === role);
    //   if (find) {
    //     return true;
    //   }
    // });

    // if (
    //   (paymentDetailData.paymentStatus === WAITING_FOR_CHECKER && isRoleChecker) ||
    //   (paymentDetailData.paymentStatus === WAITING_FOR_APPROVAL && isRoleApprove) ||
    //   (paymentDetailData.paymentStatus === APPROVED && isRoleAccounting)
    // ) {
    //   return true;
    // }
    // return false;

    return paymentDetailData?.isApprovable ? true : false;
  };

  const handleShowLabelTransactionType = (sign) => {
    const findLabel = listTransactionType.find(
      (item) => paymentDetailData.transactionTypeId === item.value
    );
    return sign === 'EN' ? findLabel?.label || '' : findLabel?.labelVN || '';
  };

  const handleGeneratePaymentDetail = () => {
    let text = '';
    if (watchPaymentMethod === 'BANK_TRANSFER') {
      text = `HD ${getValues('policyNo')} ${handleShowLabelTransactionType(
        'VN'
      )} ${convertTextVNToEN(getValues('payeeName'))} `;
      setValue('paymentDetail', text);
    } else {
      text = `${getValues('policyNo')} ${convertTextVNToEN(getValues('payeeName'))} CMND/CCCD ${
        getValues('idNumber') || ''
      } NGAY CAP ${formatDate(getValues('issueDate'))} NOI CAP ${convertTextVNToEN(
        getValues('issuePlace')
      )} ${handleShowLabelTransactionType('VN')} ${
        getValues('rejectedReasonCode') ? formatRejectReason(getValues('rejectedReasonCode')) : ''
      } 
      `;
      setValue('paymentDetail', text);
    }
  };

  const handleClickOpenFileSystem = () => {
    fileInput.current.click();
  };

  const handleUploadFile = (event) => {
    const filesFormats = [
      'image/jpeg',
      'image/png',
      '.png',
      '.jpg',
      '.jpeg',
      '.txt',
      'application/pdf',
      '.pdf',
    ];
    const file = event.target.files[0];
    const msgFile = file?.name?.endsWith('.msg');
    const isCorrectFormatFile = filesFormats.includes(file.type);
    const documentName = file.name;
    const maxSize = 3 * 1024 * 1024;
    const size = file.size;
    const isNotSpecialCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,/<>\/?~]/;

    fileInput.current.value = null;

    if (watchDocumentDetails?.length > 4) {
      setMessage('Maximum of files is 5 !');
      setState('FAIL');
      setIsShowNotify(true);
      return;
    }

    if (!isCorrectFormatFile && !msgFile) {
      setMessage('File incorrect format !');
      setState('FAIL');
      setIsShowNotify(true);
      return;
    }

    if (size > maxSize) {
      setMessage('Maximum is 3MB !');
      setState('FAIL');
      setIsShowNotify(true);
      return;
    }
    if (isNotSpecialCharacter.test(documentName)) {
      setMessage('File not contain special characters !');
      setState('FAIL');
      setIsShowNotify(true);
      return;
    }
    const createdDate = formatDate(new Date());
    const createdUser = getUserIdFromCookie();
    const path = file;
    let flag = false;
    const status = 'NEW';
    const data = { path, status, documentName, createdUser, createdDate };

    if (documentName) {
      watchDocumentDetails.map((document) => {
        if (document.documentName === documentName) {
          const newData = {
            ...getValues(),
            fileExist: data,
          };
          setMessage('The filename already exists. Do you want to overwrite it ?');
          setState('WARNING');
          setIsShowNotify(true);
          setPaymentDetailData(newData);
          setNameAction(REPLACE_FILE_EXIST);
          flag = true;
        }
      });
      if (flag) {
        return;
      }
    }
    const newDataFile = watchDocumentDetails.concat(data);
    setValue('documentDetails', newDataFile);
    return;
  };

  const handleDeleteDataFile = (id) => {
    const newData = watchDocumentDetails.filter((item, index) => {
      if (index !== id) {
        return item;
      }
    });
    setValue('documentDetails', newData);
  };
  const handleToSubmit = () => {
    if (
      getValues('fcrmStatus') === 'HIT_CRIMINAL' ||
      getValues('fcrmStatus') === 'REJECTED' ||
      getValues('fcrmStatus') === 'ALARM'
    ) {
      setMessage(`FRCM status is ${getFRCMStatus(getValues('fcrmStatus'))}`);
      return;
    }

    if (
      getValues('policyOwnerName') !== getValues('payeeName') ||
      (getValues('policyOwnerIdNumber') !== getValues('payeeName') && !getValues('payeeName'))
    ) {
      setMessage('Payee is different from Policy owner. Are you sure want to submit ?');
    } else {
      setMessage('Are you sure want to Submit data ?');
    }
    setNameAction(SUBMIT_PAYMENT);
    setState('WARNING');
  };

  const handleApprove = () => {
    setMessage('Are you sure want to Approve this payment request ?');
    setNameAction(APPROVE_PAYMENT);
  };

  const handleReject = () => {
    setMessage('Are you sure want to Reject this payment request ?');
    setNameAction(REJECT_PAYMENT);
    setPaymentDetailData(getValues());
    setIsShowNote(true);
  };

  const handleCancle = () => {
    setMessage('Are you sure want to Cancel this payment request ?');
    setNameAction(CANCEL_PAYMENT);
    setPaymentDetailData(getValues());
    setIsShowNote(true);
  };

  const handleSave = () => {
    setMessage('Are you sure want to save data ?');
    setNameAction(SAVE_PAYMENT);
  };

  const handleDonwloadFile = (url, name, status) => {
    if (status === NEW) {
      FileSaver.saveAs(url, name);
    } else {
      const payload = { url };
      dispatch(
        getPresignedDocument(payload, (status, res) => {
          if (status) {
            FileSaver.saveAs(res, name);
          }
        })
      );
    }
  };

  const documentBody = useMemo(() => {
    return (
      watchDocumentDetails?.length > 0 &&
      watchDocumentDetails?.map((item, index) => (
        <tr className='text-center' key={index}>
          <Fragment key={index}>
            <th>
              <Link
                title='Download file'
                to='#'
                onClick={() => handleDonwloadFile(item?.path, item?.documentName, item?.status)}>
                <div className='d-flex justify-content-center align-items-center mt-2'>
                  {item?.documentName}
                  <i className='mdi mdi-download mx-3 font-size-18 text-primary ' />
                </div>
              </Link>
            </th>
            <th>
              <div className='d-flex justify-content-center align-items-center mt-2'>
                {formatDate(item?.createdDate)}
              </div>
            </th>
            <th>
              <div className='d-flex justify-content-center align-items-center mt-2'>
                {item?.createdUser}
              </div>
            </th>
            <th>
              <div
                className={`${onActionForMaker() ? 'display-none' : ''}`}
                onClick={() => handleDeleteDataFile(index)}>
                <div>
                  <i title='Delete file' className='mdi mdi-close-circle' />
                </div>
              </div>
            </th>
          </Fragment>
        </tr>
      ))
    );
  }, [watchDocumentDetails]);

  const onSubmit = (data) => {
    const formatAmount = data.amount.replaceAll('.', '');
    const payload = {
      ...data,
      amount: +formatAmount,
    };
    for (let [key, value] of Object.entries(payload)) {
      if (!value && key !== 'phone' && key !== 'email') {
        !value && delete payload[key];
      }
    }
    if (
      getValues('fcrmStatus') === 'HIT_CRIMINAL' ||
      getValues('fcrmStatus') === 'REJECTED' ||
      getValues('fcrmStatus') === 'ALARM'
    ) {
      setState('FAIL');
    } else {
      setState('WARNING');
    }
    setIsShowNotify(true);
    setPaymentDetailData(payload);
  };

  return (
    <div className='payment-request-detail'>
      <LoadingFullScreen loading={isLoading} />
      <div className='payment-header'>
        <i
          className='mdi mdi-arrow-left-bold-circle cursor-pointer font-size-24'
          onClick={() => onClickBackToDashboard()}></i>
        <h4>Back to Payment Dashboard - [{paymentDetailData.paymentId}]</h4>
      </div>
      <div className='payment-content'>
        <div className='payment-tab'>
          <div
            className={`payment-detail ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}>
            Payment Detail
          </div>
          <div
            className={`audit-trail ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}>
            Audit Trail
          </div>
        </div>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={1}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className='policy-infomation'>
                <h5 className='title-header mb-4'>Policy Infomation</h5>
                <Col md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label className='title-policyNo' htmlFor='policyNo'>
                      Policy no
                    </Label>
                    <input
                      name='policyNo'
                      type='text'
                      className='form-control bg-secondary'
                      disabled={true}
                      id='policyNo'
                      {...register('policyNo')}
                    />
                  </FormGroup>
                </Col>
                <Col md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label className='title-policyOwnerName' htmlFor='policyOwnerName'>
                      Policy Owner name
                    </Label>
                    <input
                      name='policyOwnerName'
                      type='text'
                      className='form-control bg-secondary'
                      disabled={true}
                      id='policyOwnerName'
                      {...register('policyOwnerName')}
                    />
                  </FormGroup>
                </Col>
                <Col md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label className='title-policyOwnerID' htmlFor='policyOwnerID'>
                      Policy Owner ID
                    </Label>
                    <input
                      name='policyOwnerID'
                      type='text'
                      className='form-control bg-secondary'
                      disabled={true}
                      id='policyOwnerID'
                      {...register('policyOwnerIdNumber')}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className='payee-infomation'>
                <h5 className='title-header mb-4'>Payee Infomation</h5>
                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='payee-name'>
                      Payee name <span className='text-danger'> *</span>
                    </Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='payee-name'
                        type='text'
                        className={`form-control ${
                          onActionForMaker()
                            ? 'bg-secondary'
                            : errors.payeeName
                            ? 'border border-danger'
                            : ''
                        }`}
                        id='payee-name'
                        disabled={onActionForMaker() && true}
                        maxLength={40}
                        {...register('payeeName', { required: 'Payee name is required' })}
                      />
                      {errors?.payeeName && (
                        <span className='text-danger pt-2'>{errors?.payeeName?.message}</span>
                      )}
                    </div>
                  </FormGroup>
                </Col>

                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='mb-4'>
                    <InputGroup className='d-flex flex-column'>
                      <Label htmlFor='dateOfBirth nowrap'>
                        Date of Birth <span className='text-danger'> *</span>
                      </Label>
                      <div
                        className={`d-flex calendar-box ${onActionForMaker() && 'bg-secondary'}`}>
                        <Controller
                          control={control}
                          name='dateOfBirth'
                          defaultValue={formatDate(
                            paymentDetailData?.dateOfBirth
                              ? paymentDetailData.dateOfBirth
                              : new Date()
                          )}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Flatpickr
                              className='form-control d-block calendar-input'
                              disabled={onActionForMaker() && true}
                              placeholder='Select time'
                              defaultValue={formatDate(
                                paymentDetailData?.dateOfBirth
                                  ? paymentDetailData.dateOfBirth
                                  : new Date()
                              )}
                              onChange={(date) => {
                                onChange(formatDate(date[0]));
                              }}
                              options={{
                                dateFormat: 'd/m/Y',
                              }}
                            />
                          )}
                        />
                        <i className='ti-calendar calendar-icon' />
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>

                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='country'>
                      Country <span className='text-danger'> *</span>
                    </Label>
                    <div
                      className={`${onActionForMaker() && 'bg-secondary'}`}
                      style={{ zIndex: 100000 }}>
                      <Controller
                        control={control}
                        name='country'
                        defaultValue={
                          paymentDetailData?.country
                            ? paymentDetailData.country
                            : optionCountry[0].value
                        }
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            className='select1-selection'
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 5,
                              colors: {
                                ...theme.colors,
                                primary: '#f8bd40',
                              },
                            })}
                            isDisabled={onActionForMaker() && true}
                            defaultValue={
                              paymentDetailData?.country
                                ? optionCountry.find(
                                    (bank) => bank.value === paymentDetailData.country
                                  )
                                : optionCountry[0]
                            }
                            options={optionCountry}
                            value={optionCountry.find((val) => val.value === value)}
                            onChange={(e) => {
                              onChange(e.value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </FormGroup>
                </Col>

                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='phone'>Phone</Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='phone'
                        type='text'
                        disabled={onActionForMaker() && true}
                        id='phone'
                        className={`form-control ${onActionForMaker() && 'bg-secondary'}`}
                        maxLength={11}
                        {...register('phone')}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='email'>Email</Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='email'
                        type='text'
                        disabled={onActionForMaker() && true}
                        className={`form-control ${
                          onActionForMaker()
                            ? 'bg-secondary'
                            : errors?.email?.message
                            ? 'border border-danger'
                            : ''
                        }`}
                        maxLength={40}
                        {...register('email', {
                          pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: 'Email is incorrect format',
                          },
                        })}
                      />
                      {errors?.email?.message && (
                        <span className='text-danger pt-2'>{errors.email.message}</span>
                      )}
                    </div>
                  </FormGroup>
                </Col>

                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='mb-4'>
                    <InputGroup className='d-flex flex-column'>
                      <Label htmlFor='nowrap'>
                        Document received date <span className='text-danger'> *</span>
                      </Label>
                      <div
                        className={`d-flex calendar-box ${onActionForMaker() && 'bg-secondary'}`}>
                        <Controller
                          control={control}
                          name='documentReceivedDate'
                          defaultValue={formatDate(
                            paymentDetailData?.dateOfBirth
                              ? paymentDetailData.dateOfBirth
                              : new Date()
                          )}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Flatpickr
                              className='form-control d-block calendar-input'
                              disabled={onActionForMaker() && true}
                              placeholder='Select time'
                              defaultValue={formatDate(
                                paymentDetailData?.dateOfBirth
                                  ? paymentDetailData.dateOfBirth
                                  : new Date()
                              )}
                              onChange={(date) => {
                                onChange(formatDate(date[0]));
                              }}
                              options={{
                                dateFormat: 'd/m/Y',
                              }}
                            />
                          )}
                        />
                        <i className='ti-calendar calendar-icon' />
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>

                <Col xl={4} md={4} sm={12}>
                  <FormGroup className='mb-4'>
                    <InputGroup className='d-flex flex-column'>
                      <Label htmlFor='nowrap'>
                        Client signed date <span className='text-danger'> *</span>
                      </Label>
                      <div
                        className={`d-flex calendar-box ${onActionForMaker() && 'bg-secondary'}`}>
                        <Controller
                          control={control}
                          name='clientSignedDate'
                          defaultValue={formatDate(
                            paymentDetailData?.dateOfBirth
                              ? paymentDetailData.dateOfBirth
                              : new Date()
                          )}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Flatpickr
                              className='form-control d-block calendar-input'
                              disabled={onActionForMaker() && true}
                              placeholder='Select time'
                              defaultValue={formatDate(
                                paymentDetailData?.dateOfBirth
                                  ? paymentDetailData.dateOfBirth
                                  : new Date()
                              )}
                              onChange={(date) => {
                                onChange(formatDate(date[0]));
                              }}
                              options={{
                                dateFormat: 'd/m/Y',
                              }}
                            />
                          )}
                        />
                        <i className='ti-calendar calendar-icon' />
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row className='payment-infomation'>
                <h5 className='title-header mb-4'>Payment Infomation</h5>
                <Col sm={12} md={4}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='transactiontype'>Transaction type</Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='transactiontype'
                        type='text'
                        disabled={true}
                        className='form-control bg-secondary'
                        id='transactiontype'
                        value={handleShowLabelTransactionType('EN')}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={12} md={4}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='paymentMethod'>
                      Payment method <span className='text-danger'> *</span>
                    </Label>
                    <Row className='d-flex align-items-center'>
                      <Col sm={6}>
                        <div className='form-check form-check-inline d-flex align-item-center'>
                          <input
                            type='radio'
                            disabled={onActionForMaker() && true}
                            defaultChecked={
                              paymentDetailData?.paymentMethod === 'BANK_TRANSFER' ? true : false
                            }
                            {...(!onActionForMaker() && {
                              ...register('paymentMethod', {
                                required: 'Payment method is required',
                              }),
                            })}
                            value='BANK_TRANSFER'
                            id='bank-transfer'
                            className='form-check-input font-size-18 mt-1 cursor-pointer'
                          />
                          <Label className='mx-3 mt-2' htmlFor='bank-transfer'>
                            Bank Transfer
                          </Label>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className='form-check form-check-inline d-flex align-item-center'>
                          <input
                            type='radio'
                            defaultChecked={
                              paymentDetailData?.paymentMethod === 'BANK_CASH' ? true : false
                            }
                            {...(!onActionForMaker() && {
                              ...register('paymentMethod', {
                                required: 'Payment method is required',
                              }),
                            })}
                            value='BANK_CASH'
                            id='bank-cash'
                            disabled={onActionForMaker() && true}
                            className='form-check-input font-size-18 mt-1 cursor-pointer'
                          />
                          <Label className='mx-3 mt-2' htmlFor='bank-cash'>
                            Bank Cash
                          </Label>
                        </div>
                      </Col>
                      {errors?.paymentMethod?.message && (
                        <span className='text-danger pt-2'>{errors?.paymentMethod?.message}</span>
                      )}
                    </Row>
                  </FormGroup>
                </Col>

                <Col sm={12} md={4}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='bankname'>
                      Bank name<span className='text-danger'> *</span>
                    </Label>
                    <div className={`d-flex flex-column`}>
                      <Controller
                        control={control}
                        name='bankName'
                        defaultValue={
                          paymentDetailData?.bankName
                            ? bankCountry.find((bank) => {
                                if (bank.value === paymentDetailData.bankName) {
                                  return bank.value;
                                }
                              })
                            : bankCountry[0].value
                        }
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            className='select1-selection currency'
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 5,
                              colors: {
                                ...theme.colors,
                                primary: '#f8bd40',
                              },
                            })}
                            isDisabled={onActionForMaker() && true}
                            defaultValue={
                              paymentDetailData?.bankName
                                ? bankCountry.find((bank) => {
                                    if (bank.value === paymentDetailData.bankName) {
                                      return bank;
                                    }
                                  })
                                : bankCountry[0]
                            }
                            options={bankCountry}
                            value={bankCountry.find((val) => val.value === value)}
                            onChange={(e) => {
                              onChange(e.value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </FormGroup>
                </Col>

                {getValues('paymentMethod') === 'BANK_TRANSFER' && (
                  <Col md={4} sm={12} className='bank-account-name'>
                    <FormGroup className='d-flex flex-column mb-4'>
                      <Label htmlFor='bankaccountnumber' className='title-bacc-number'>
                        Bank Account Number
                        <span className='text-danger'>
                          {getValues('paymentMethod') === 'BANK_TRANSFER' && ' *'}
                        </span>
                      </Label>
                      <div className='d-flex flex-column'>
                        <input
                          name='bankaccountnumber'
                          type='text'
                          disabled={onActionForMaker() && true}
                          maxLength={20}
                          className={`form-control bank-account-number ${
                            onActionForMaker()
                              ? 'bg-secondary'
                              : errors?.bankAccountNumber
                              ? 'border border-danger'
                              : ''
                          }`}
                          {...register('bankAccountNumber', {
                            required: 'Bank account number is required',
                          })}
                        />
                        {errors?.bankAccountNumber?.message && (
                          <span className='text-danger pt-2'>
                            {errors.bankAccountNumber.message}
                          </span>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                )}

                <Col sm={12} md={4}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='bankbranch'>
                      Bank Branch
                      <span className='text-danger'>
                        {getValues('paymentMethod') === 'BANK_CASH' ? ' *' : ''}
                      </span>
                    </Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='bankbranch'
                        disabled={onActionForMaker() && true}
                        type='text'
                        maxLength={100}
                        className={`form-control ${
                          onActionForMaker()
                            ? 'bg-secondary'
                            : errors?.bankBranch
                            ? 'border border-danger'
                            : ''
                        }`}
                        {...register('bankBranch', {
                          required:
                            getValues('paymentMethod') === 'BANK_CASH'
                              ? 'Bank branch is required'
                              : false,
                        })}
                      />
                      {errors?.bankBranch?.message && (
                        <span className='text-danger pt-2'>{errors.bankBranch.message}</span>
                      )}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={12} md={4} className='bank-account-name'>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='bankbranchaddress' className='title-badd'>
                      Bank Branch Address
                    </Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='bankbranchaddress'
                        type='text'
                        maxLength={200}
                        disabled={onActionForMaker() && true}
                        className={`form-control bank-branch-address ${
                          onActionForMaker()
                            ? 'bg-secondary'
                            : errors?.bankBranchAddress
                            ? 'border border-danger'
                            : ''
                        }`}
                        {...register('bankBranchAddress')}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={12} md={4}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='amount'>
                      Amount<span className='text-danger'> *</span>
                    </Label>
                    <div className='d-flex flex-column'>
                      <input
                        name='amount'
                        type='text'
                        onKeyPress={(event) => {
                          onlyNumber(event);
                        }}
                        disabled={onActionForMaker() && true}
                        {...register('amount', {
                          required: 'Amount is required',
                          min: {
                            value: 1,
                            message:
                              'Amount must be greater than 0 and less than or equal to Outstanding amount',
                          },
                        })}
                        onChange={(e) => setValue('amount', handleFormatMoney(e.target.value))}
                        className={`form-control ${
                          onActionForMaker()
                            ? 'bg-secondary'
                            : errors?.amount
                            ? 'border border-danger'
                            : ''
                        }`}
                      />
                      {errors?.amount?.message && (
                        <span className='text-danger pt-2'>{errors.amount.message}</span>
                      )}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={12} md={4} className='bank-account-name'>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='currency' className='title-currency'>
                      Currency<span className='text-danger'> *</span>
                    </Label>
                    <div className='d-flex flex-column'>
                      <Controller
                        control={control}
                        name='currency'
                        defaultValue='VND'
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            className='select1-selection currency'
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 5,
                              colors: {
                                ...theme.colors,
                                primary: '#f8bd40',
                              },
                            })}
                            isDisabled={onActionForMaker() && true}
                            defaultValue={{
                              label: 'VND',
                              value: 'VND',
                            }}
                            options={currencyOption}
                            value={currencyOption.find((val) => val.value === value)}
                            onChange={(e) => {
                              onChange(e.value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </FormGroup>
                </Col>
                {getValues('paymentMethod') === 'BANK_CASH' && (
                  <>
                    <Col sm={12} md={4}>
                      <FormGroup className='d-flex flex-column mb-4'>
                        <Label htmlFor='id-number'>
                          ID Number<span className='text-danger'> *</span>
                        </Label>
                        <div className='d-flex flex-column'>
                          <input
                            name='id-number'
                            disabled={onActionForMaker() && true}
                            type='text'
                            maxLength={30}
                            className={`form-control ${onActionForMaker() && 'bg-secondary'}`}
                            {...register('idNumber', { required: 'Id number is required' })}
                          />
                          {errors?.idNumber?.message && (
                            <span className='text-danger pt-2'>{errors.idNumber.message}</span>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={4}>
                      <FormGroup className='d-flex flex-column mb-4'>
                        <Label htmlFor='issue-place'>
                          Issue Place
                          <span className='text-danger'>
                            {getValues('paymentMethod') === 'BANK_CASH' && ' *'}
                          </span>
                        </Label>
                        <div className='d-flex flex-column'>
                          <input
                            name='issue-place'
                            type='text'
                            maxLength={200}
                            disabled={onActionForMaker() && true}
                            className={`form-control mdb-2 ${onActionForMaker() && 'bg-secondary'}`}
                            {...register('issuePlace', {
                              required:
                                getValues('paymentMethod') === 'BANK_CASH'
                                  ? 'Issue place is required'
                                  : false,
                            })}
                          />
                          {errors?.issuePlace?.message && (
                            <span className='text-danger pt-2'>{errors.issuePlace.message}</span>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm={12} md={4}>
                      <FormGroup className='d-flex flex-column mb-4'>
                        <Label htmlFor='issueDate'>
                          Issue Date
                          <span className='text-danger'>
                            {getValues('paymentMethod') === 'BANK_CASH' && ' *'}
                          </span>
                        </Label>
                        <div className='d-flex calendar-box'>
                          <Controller
                            control={control}
                            defaultValue={formatDate(
                              paymentDetailData?.issueDate
                                ? paymentDetailData.issueDate
                                : new Date()
                            )}
                            name='issueDate'
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <>
                                <Flatpickr
                                  className={`form-control d-block calendar-input ${
                                    onActionForMaker() && 'bg-secondary'
                                  }`}
                                  placeholder='Select time'
                                  disabled={onActionForMaker() && true}
                                  defaultValue={formatDate(
                                    paymentDetailData?.issueDate
                                      ? paymentDetailData.issueDate
                                      : new Date()
                                  )}
                                  onChange={(date) => {
                                    onChange(formatDate(date[0]));
                                  }}
                                  options={{
                                    dateFormat: 'd/m/Y',
                                  }}
                                />
                                <i className='ti-calendar calendar-icon' />
                              </>
                            )}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </>
                )}

                <Col sm={12}>
                  <FormGroup className='d-flex flex-column mb-4'>
                    <Label htmlFor='payment-detail'>
                      Payment detail<span className='text-danger'> *</span>
                    </Label>
                    <div className='flex-column flex-1 d-flex'>
                      <Row>
                        <Col sm={12} md={8}>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex flex-column'>
                              <textarea
                                name='payment-detail'
                                disabled={onActionForMaker() && true}
                                className={`form-control payment-detail ${
                                  onActionForMaker()
                                    ? 'bg-secondary'
                                    : errors?.paymentDetail
                                    ? 'border border-danger'
                                    : ''
                                }`}
                                style={{ textAlign: 'justify' }}
                                maxLength={400}
                                {...register('paymentDetail', {
                                  required: 'Payment detail is required',
                                })}
                                rows='4'
                                cols='100'
                              />
                              {errors?.paymentDetail?.message && (
                                <span className='text-danger pt-2'>
                                  {errors.paymentDetail.message}
                                </span>
                              )}
                            </div>
                            {!onActionForMaker() && (
                              <div className='mx-4' onClick={handleGeneratePaymentDetail}>
                                <i
                                  className='mdi mdi-sync-circle cursor-pointer'
                                  style={{ fontSize: '32px' }}></i>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className='attachment'>
                <h5 className='title-header mb-4'>Attachment</h5>
                <Col sm={12} className='mb-4'>
                  <Row>
                    <Col sm={3} md={2}>
                      <div className='d-flex flex-column'>
                        <Label htmlFor='file-upload'>
                          <button
                            title='msg, pdf, png, jpg, JPEG'
                            type='button'
                            onClick={handleClickOpenFileSystem}
                            disabled={onActionForMaker() ? true : false}
                            className={`btn btn-add-file ${
                              onActionForMaker() ? 'cursor-not-allow' : ''
                            }`}>
                            Upload file
                            <i className='mdi mdi-upload' />
                          </button>
                        </Label>

                        <input
                          type='file'
                          className='input-file'
                          id='file-upload'
                          disabled={onActionForMaker() ? true : false}
                          ref={fileInput}
                          onChange={(e) => handleUploadFile(e)}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col sm={12} className='p-0 data-table'>
                  <div className='wrap-table'>
                    {watchDocumentDetails?.length > 0 && (
                      <table className='table table-bordered table-hover'>
                        <thead>
                          <tr className='text-center'>
                            <th scope='col'>Document name</th>
                            <th scope='col'>Updated date</th>
                            <th scope='col'>Updated by</th>
                            <th scope='col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>{documentBody}</tbody>
                      </table>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Row sm={12}>
                  <div className='group-button'>
                    {!onActionForMaker() && (
                      <>
                        <button type='submit' className='button btn-save' onClick={handleSave}>
                          Save
                        </button>

                        <button
                          type='submit'
                          className='button btn-submit'
                          onClick={handleToSubmit}>
                          Submit
                        </button>

                        <button type='button' className='button btn-cancel' onClick={handleCancle}>
                          Cancel Payment
                        </button>
                      </>
                    )}

                    {onApproveOrReject() && (
                      <>
                        <button type='submit' className='button btn-submit' onClick={handleApprove}>
                          Approve
                        </button>
                        <button type='button' className='button btn-cancel' onClick={handleReject}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </Row>
              </Row>
            </Form>
          </TabPane>
          <TabPane tabId={2}>
            <AuditTrail activeTab={activeTab} paymentId={getValues('paymentId')} />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

PaymentDetail.propTypes = {
  onClickBackToDashboard: PropTypes.func,
  paymentDetailData: PropTypes.object,
  setPaymentDetailData: PropTypes.func,
  setMessage: PropTypes.func,
  setState: PropTypes.func,
  setIsShowNotify: PropTypes.func,
};

export default PaymentDetail;
