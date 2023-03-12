import React, { useEffect } from 'react';
import { Col, FormGroup, Form, Row, Label } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import {
  REQUESTED_DATE,
  WAITING_FOR_CHECKER,
  TRANSACTION_TYPE,
  WAITING_FOR_APPROVAL,
  APPROVED,
  POLICY_NO,
} from 'helpers/constants/state';
import {
  optionSearchBy,
  optionPaymentStatus,
  listPaymentStatus,
} from 'helpers/constants/optionStatus';
import { listTransactionType } from 'helpers/constants/optionStatus';
import checkScope from 'helpers/checkScope';
import PropTypes from 'prop-types';
import { formatDate } from 'helpers/formatDate';
import { getTransTypeFromCookie, getUserRolesFromCookie } from 'helpers/GetDataFromCookie';
import getPaymentStatus from 'helpers/GetPaymentStatus';

const defaultToDate = moment(new Date()).format('DD/MM/YYYY');
const defaultFromDate = moment(new Date()).subtract(14, 'days').format('DD/MM/YYYY');

const Boxsearch = ({
  handleSubmitSearch,
  isLoading,
  activeTab,
  onClickApprove,
  filter,
  dataSelectedRow,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const watchSearchBy = watch('searchBy', { label: 'Policy no', value: POLICY_NO });
  const watchFromDate = watch('fromDate');
  const watchToDate = watch('toDate');
  const transactionType = getTransTypeFromCookie();
  const userRoles = getUserRolesFromCookie();

  useEffect(() => {
    setValue('fromDate', defaultFromDate);
    setValue('toDate', defaultToDate);
  }, []);

  useEffect(() => {
    if (filter.searchText) {
      setValue('searchText', filter.searchText);
    }
    if (filter.fromDate && filter.toDate) {
      setValue('fromDate', filter.fromDate);
      setValue('toDate', filter.toDate);
    }
  }, [filter]);

  const handleShowTransactionType = () => {
    const trnxFilter = transactionType.map((item) => item.value);
    const result = listTransactionType.filter((item) => {
      const find = checkScope(trnxFilter, [item.value]);
      if (find) {
        return item;
      }
    });
    return result;
  };

  const handleInputTextShow = () => {
    const type = watchSearchBy.value;
    if (type === REQUESTED_DATE || type === TRANSACTION_TYPE) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = (data) => {
    let fromDate = null;
    let toDate = null;
    let searchText = null;
    let transactionTypeId = null;
    let paymentStatus = null;

    const searchBy = watchSearchBy?.value;
    switch (watchSearchBy.value) {
      case REQUESTED_DATE:
        fromDate = data?.fromDate;
        toDate = data?.toDate;
        break;
      case TRANSACTION_TYPE:
        transactionTypeId = [data?.transactionType];
        break;
      default:
        searchText = data?.searchText;
        break;
    }

    switch (activeTab) {
      case 1:
        paymentStatus = data.paymentStatus.map((item) => item?.value);
        break;
      case 2:
        paymentStatus = [WAITING_FOR_CHECKER];
        break;
      case 3:
        paymentStatus = [WAITING_FOR_APPROVAL];
        break;
      case 4:
        paymentStatus = [APPROVED];
        break;
      default:
        break;
    }

    const newData = {
      searchBy,
      paymentStatus,
      searchText: searchText && searchText.trim(),
      fromDate,
      toDate,
      transactionTypeId,
    };

    if (
      !searchText &&
      watchSearchBy.value !== REQUESTED_DATE &&
      watchSearchBy.value !== TRANSACTION_TYPE
    ) {
      !searchText && delete newData.searchBy;
    }
    for (let [key, value] of Object.entries(newData)) {
      !value && delete newData[key];
    }
    handleSubmitSearch?.({ ...newData });
  };

  const showApproveButton = () => {
    const check = listPaymentStatus[2].scopes?.some((role) => {
      const find = userRoles.find((item) => item === role);
      if (find) {
        return true;
      }
    });
    return check;
  };

  return (
    <Form className='box-search' onSubmit={handleSubmit(onSubmit)}>
      <Row>
        {activeTab === 1 && (
          <Col md={3} sm={12}>
            <Label>Payment status</Label>
            <div className='mb-3'>
              <Controller
                control={control}
                name='paymentStatus'
                rules={{ required: 'Payment status is required' }}
                defaultValue={
                  filter?.paymentStatus
                    ? getPaymentStatus(filter?.paymentStatus)
                    : [{ value: optionPaymentStatus[0].value }]
                }
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    className='select1-selection'
                    isMulti={true}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        primary: '#f8bd40',
                      },
                    })}
                    defaultValue={
                      filter?.paymentStatus
                        ? getPaymentStatus(filter?.paymentStatus)
                        : optionPaymentStatus[0]
                    }
                    options={optionPaymentStatus}
                    value={optionPaymentStatus.find((val) => val.value === value)}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                )}
              />
              {errors?.paymentStatus?.message && (
                <div className='text-danger mt-2'>{errors?.paymentStatus?.message}</div>
              )}
            </div>
          </Col>
        )}

        <Col md={3} sm={12}>
          <Label>Search by</Label>
          <div className='mb-3'>
            <Controller
              control={control}
              name='searchBy'
              defaultValue={watchSearchBy}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  className='select1-selection'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary: '#f8bd40',
                    },
                  })}
                  defaultValue={optionSearchBy[0]}
                  options={optionSearchBy}
                  value={optionSearchBy.find((val) => val.value === value)}
                  onChange={(e) => {
                    onChange(e?.value);
                    setValue('searchBy', e);
                  }}
                />
              )}
            />
          </div>
        </Col>

        {handleInputTextShow() && (
          <Col md={4} sm={12}>
            <FormGroup className='mb-3'>
              <Label>Enter text</Label>
              <input type='text' className='form-control input-text' {...register('searchText')} />
            </FormGroup>
          </Col>
        )}

        {watchSearchBy.value === REQUESTED_DATE && (
          <Col sm={12} md={6}>
            <Row>
              <Col sm={12} md={6} className='mb-3'>
                <FormGroup>
                  <div className='d-flex flex-column'>
                    <Label>From date</Label>
                    <div className='d-flex align-items-center calendar-box flex-1'>
                      <Controller
                        control={control}
                        name='fromDate'
                        defaultValue={filter?.fromDate ? filter.fromDate : defaultFromDate}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <>
                            <Flatpickr
                              className={`form-control d-block calendar-input`}
                              defaultValue={filter?.fromDate ? filter.fromDate : defaultFromDate}
                              onChange={(date) => {
                                onChange(formatDate(date[0]));
                              }}
                              options={{
                                dateFormat: 'd/m/Y',
                                maxDate: watchToDate,
                              }}
                            />
                            <i className='ti-calendar calendar-icon' />
                          </>
                        )}
                      />
                    </div>
                  </div>
                </FormGroup>
              </Col>
              <Col sm={12} md={6} className='mb-3 pl-0'>
                <FormGroup>
                  <div className='d-flex flex-column'>
                    <Label>To date</Label>
                    <div className='d-flex align-items-center calendar-box flex-1'>
                      <Controller
                        control={control}
                        name='toDate'
                        defaultValue={filter?.toDate ? filter.toDate : defaultFromDate}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <>
                            <Flatpickr
                              className='form-control d-block calendar-input'
                              placeholder='Select time'
                              defaultValue={filter?.toDate ? filter.toDate : defaultFromDate}
                              onChange={(date) => {
                                onChange(formatDate(date[0]));
                              }}
                              options={{
                                dateFormat: 'd/m/Y',
                                maxDate: 'today',
                                minDate: watchFromDate,
                              }}
                            />
                            <i className='ti-calendar calendar-icon' />
                          </>
                        )}
                      />
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        )}

        {watchSearchBy.value === TRANSACTION_TYPE && (
          <Col md={3} sm={12}>
            <Label>Transaction type</Label>
            <div className='mb-3'>
              <Controller
                control={control}
                name='transactionType'
                defaultValue={
                  filter?.transactionType
                    ? getTransTypeFromCookie(filter.transactionType)?.value
                    : handleShowTransactionType()[0]?.value
                }
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    className='select1-selection'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        primary: '#f8bd40',
                      },
                    })}
                    defaultValue={
                      filter?.transactionType
                        ? getTransTypeFromCookie(filter.transactionType)
                        : handleShowTransactionType()[0]
                    }
                    options={handleShowTransactionType()}
                    value={handleShowTransactionType().find((val) => val.value === value)}
                    onChange={(e) => {
                      onChange(e?.value);
                      setValue('transactionType', e.value);
                    }}
                  />
                )}
              />
            </div>
          </Col>
        )}

        <Col sm={12} md={activeTab === 3 ? 3 : 2}>
          <div className='d-flex align-items-center'>
            <button
              className={`button btn-search d-flex align-items-center ${
                isLoading && 'opacity-75 cursor-not-allow'
              }`}
              type='submit'
              disabled={isLoading ? true : false}
              style={{ minWidth: '110px', padding: '0.5rem', margin: '0' }}>
              <span className='mx-2'>Search</span> <i className='ti-search font-size-17' />
            </button>

            {activeTab === 3 && dataSelectedRow?.length > 0 && showApproveButton() && (
              <button
                className={`button btn-submit d-flex align-items-center mx-2 ${
                  isLoading && 'opacity-75 cursor-not-allow'
                }`}
                type='button'
                onClick={() => onClickApprove()}
                disabled={isLoading ? true : false}
                style={{ minWidth: '110px', padding: '6px', margin: '0' }}>
                <span className='mx-2'>Approve</span> <i className='ti-check font-size-17' />
              </button>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
};

Boxsearch.propTypes = {
  handleSubmitSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  activeTab: PropTypes.number,
  onClickApprove: PropTypes.func,
  dataSelectedRow: PropTypes.array,
};

export default Boxsearch;
