import React, { useState, useEffect } from 'react';
import { Col, Form, FormGroup, InputGroup, Label, Modal, ModalBody, Row } from 'reactstrap';
import { Controller, useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import LoadingFullScreen from 'components/loading/LoadingFullScreen';
import { postConfirmDelegatedTo, getListUserFromRoles } from 'store/actions';
import { useDispatch } from 'react-redux';
import { FAIL, SUCCESS } from 'helpers/constants/state';
import { formatDateAndHour } from 'helpers/formatDate';
import { getTransTypeFromCookie } from 'helpers/GetDataFromCookie';

const NewDelegate = ({
  isOpen,
  setIsLoading,
  onCloseModal,
  setState,
  setMessage,
  setIsShowNotify,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const defaultDate = formatDateAndHour(new Date());
  const watchEFDFrom = watch('from');
  const watchEFDTo = watch('to');
  const [listUser, setListUser] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (isOpen) {
      toggle();
      setState(null);
      dispatch(
        getListUserFromRoles((status, data) => {
          if (status) {
            const result = [];
            data?.map((item) => {
              const obj = {};
              obj.label = item.userId + ' - ' + item.fullName;
              obj.value = item.userId;
              obj.userName = item.fullName;
              result.push(obj);
            });
            setListUser(result);
          }
        })
      );
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    onCloseModal();
    toggle();
    reset();
    setSelectedValue([]);
    setIsChecked(false);
  };

  const onSubmit = (data) => {
    const transactionTypeFilter = data.transactionType.map((item) => item.value);
    const newData = {
      ...data,
      transactionType: transactionTypeFilter,
      userId: data?.delegateTo?.value,
      userName: data?.delegateTo?.userName,
    };
    delete newData.user;
    delete newData.delegateTo;
    const payload = { ...newData };
    setIsLoading(true);
    dispatch(
      postConfirmDelegatedTo(payload, (status, res) => {
        setIsShowNotify(true);
        if (status) {
          handleCloseModal();
          setState(SUCCESS);
          setMessage('Delegation success !');
        } else {
          setState(FAIL);
          setMessage('Delegation fail !');
        }
        setIsLoading(false);
      })
    );
  };

  const handleSelectAllTrx = () => {
    setIsChecked(!isChecked);
    const getValue = getTransTypeFromCookie();
    !isChecked
      ? (setSelectedValue(getValue), setValue('transactionType', getValue))
      : (setSelectedValue([]), setValue('transactionType', null));
  };

  return (
    <Modal
      isOpen={modal}
      size='lg'
      className='modal-delegation'
      centered={true}
      scrollable={false}
      backdrop='static'>
      <ModalBody className='px-4'>
        <h4>Delegation detail</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className='delegation-body mt-4'>
            <Col md={6} sm={12}>
              <FormGroup className='mb-4'>
                <InputGroup className='d-flex flex-column'>
                  <Label>
                    Effective date from <span className='text-danger'> *</span>
                  </Label>
                  <div className='d-flex calendar-box'>
                    <Controller
                      control={control}
                      name='from'
                      defaultValue={defaultDate}
                      render={({ field: { onChange } }) => (
                        <Flatpickr
                          className='form-control d-block calendar-input'
                          placeholder='Select time'
                          defaultValue={defaultDate}
                          onChange={(date) => {
                            onChange(formatDateAndHour(date[0]));
                          }}
                          options={{
                            dateFormat: 'd/m/Y H:i',
                            enableTime: true,
                            minDate: 'today',
                            time_24hr: true,
                            maxDate: watchEFDTo,
                          }}
                        />
                      )}
                    />
                    <i className='ti-calendar calendar-icon' />
                  </div>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6} sm={12}>
              <FormGroup className='mb-4'>
                <InputGroup className='d-flex flex-column'>
                  <Label>
                    Effective date to <span className='text-danger'> *</span>
                  </Label>
                  <div className='d-flex calendar-box'>
                    <Controller
                      control={control}
                      name='to'
                      defaultValue={defaultDate}
                      render={({ field: { onChange } }) => (
                        <Flatpickr
                          className='form-control d-block calendar-input'
                          placeholder='Select time'
                          defaultValue={defaultDate}
                          onChange={(date) => {
                            onChange(formatDateAndHour(date[0]));
                          }}
                          options={{
                            enableTime: true,
                            dateFormat: 'd/m/Y H:i',
                            time_24hr: true,
                            minDate: watchEFDFrom,
                          }}
                        />
                      )}
                    />
                    <i className='ti-calendar calendar-icon' />
                  </div>
                </InputGroup>
              </FormGroup>
            </Col>

            <Col md={6} sm={12}>
              <FormGroup className='d-flex flex-column mb-4'>
                <Label>
                  Delegate to <span className='text-danger'> *</span>
                </Label>
                <Controller
                  control={control}
                  name='delegateTo'
                  rules={{ required: 'Delegate to is required' }}
                  render={({ field: { onChange, value } }) => (
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
                      placeholder='Select...'
                      options={listUser}
                      value={listUser.find((val) => val?.value === value)}
                      onChange={(e) => {
                        onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.delegateTo?.message && (
                  <span className='text-danger mt-2'>{errors?.delegateTo?.message}</span>
                )}
              </FormGroup>
            </Col>

            <Col md={6} sm={12}>
              <FormGroup className='d-flex flex-column mb-4'>
                <Label>
                  <div className='d-flex align-items-center'>
                    Transaction type <span className='text-danger mx-1'>*</span>
                    <input
                      type='checkbox'
                      checked={isChecked}
                      className='form-check-input font-size-16 mx-3 cursor-pointer'
                      onChange={handleSelectAllTrx}
                    />
                  </div>
                </Label>
                <Controller
                  control={control}
                  name='transactionType'
                  rules={{ required: 'Transaction type is required' }}
                  render={({ field: { onChange, value } }) => (
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
                      placeholder='Select...'
                      isMulti={true}
                      options={getTransTypeFromCookie()}
                      value={selectedValue}
                      onChange={(e) => {
                        onChange(e);
                        setSelectedValue(e);
                      }}
                    />
                  )}
                />
                {errors?.transactionType?.message && (
                  <span className='text-danger mt-2'>{errors?.transactionType?.message}</span>
                )}
              </FormGroup>
            </Col>
            <Col sm={12}>
              <div className='d-flex align-items-center'>
                <div className='d-flex flex-column'>
                  <Label htmlFor='reason'>Reason</Label>
                  <textarea
                    name='reason'
                    className='form-control reason'
                    maxLength={200}
                    {...register('reason')}
                    rows='5'
                    cols='120'
                  />
                </div>
              </div>
            </Col>
            <div className='d-flex justify-content-center pt-4'>
              <button type='submit' className='button btn-confirm'>
                Confirm
              </button>
              <button type='button' className='button btn-search' onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

NewDelegate.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default NewDelegate;
