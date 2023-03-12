import React, { memo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { Modal, ModalBody, ModalHeader, Col, Form, FormGroup, Label, Row } from 'reactstrap';
import { SAVE_PAYMENT } from 'helpers/constants/state';
import { formatDate } from 'helpers/formatDate';

export const optionFCRM = [
  { label: 'Alarm', value: 'ALARM' },
  { label: 'Closed', value: 'CLOSED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const FRCM = ({ isOpen, handleClose, paymentDetailData, callback }) => {
  const { control, register, setValue, handleSubmit } = useForm({
    mode: 'onSubmit',
  });
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    handleClose();
  };

  useEffect(() => {
    paymentDetailData.fcrmNote && setValue('fcrmNote', paymentDetailData.fcrmNote);
  }, [paymentDetailData]);

  useEffect(() => {
    isOpen && toggle();
  }, [isOpen]);

  const onSubmit = (data) => {
    const fcrmStatus = data?.fcrmStatus;
    const fcrmNote = data?.fcrmNote;
    const newData = {
      ...paymentDetailData,
      fcrmStatus,
      fcrmNote,
    };
    toggle();
    callback?.(newData, SAVE_PAYMENT);
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size='lg'
      centered={true}
      scrollable={false}
      backdrop='static'>
      <ModalHeader toggle={toggle}>FCRM Update</ModalHeader>
      <ModalBody>
        <div className='fcrm-body'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={4} sm={12}>
                <FormGroup className='d-flex flex-column mb-3'>
                  <Label htmlFor='payee-name'>Payee name</Label>
                  <input
                    name='payee-name'
                    type='text'
                    className='form-control bg-secondary'
                    disabled={true}
                    value={paymentDetailData.payeeName}
                    id='payee-name'
                  />
                </FormGroup>
              </Col>
              <Col md={4} sm={12}>
                <FormGroup className='d-flex flex-column mb-3'>
                  <Label htmlFor='payee-date-of-birth'>Payee Date of Birth</Label>
                  <input
                    name='payee-date-of-birth'
                    type='text'
                    className='form-control bg-secondary'
                    disabled={true}
                    value={formatDate(paymentDetailData?.dateOfBirth)}
                    id='payee-date-of-birth'
                  />
                </FormGroup>
              </Col>
              <Col md={4} sm={12}>
                <FormGroup className='d-flex flex-column mb-3'>
                  <Label>FCRM Status</Label>
                  <Controller
                    control={control}
                    name='fcrmStatus'
                    defaultValue={
                      paymentDetailData?.fcrmStatus
                        ? paymentDetailData.fcrmStatus
                        : optionFCRM[0].value
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
                          paymentDetailData?.fcrmStatus
                            ? optionFCRM.find((fcrm) => fcrm.value === paymentDetailData.fcrmStatus)
                            : optionFCRM[0]
                        }
                        options={optionFCRM}
                        value={optionFCRM.find((val) => val.value === value)}
                        onChange={(e) => {
                          onChange(e.value);
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>

              <Col sm={12}>
                <FormGroup className='d-flex flex-column mb-3'>
                  <Label htmlFor='fcrm-note'>FRCM Note</Label>
                  <div className='flex-column flex-1 d-flex'>
                    <Row>
                      <Col sm={12}>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex flex-column'>
                            <textarea
                              name='fcrm-note'
                              className='form-control'
                              maxLength={200}
                              {...register('fcrmNote')}
                              rows='5'
                              cols='100'
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <div className='d-flex justify-content-end pt-3'>
              <button type='submit' className='button btn-confirm'>
                Save
              </button>
              <button type='button' onClick={toggle} className='button btn-light'>
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default memo(FRCM);
