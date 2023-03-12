import React, { useState, useEffect, memo } from 'react';
import { Form, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { CANCEL_PAYMENT, REJECT_PAYMENT } from 'helpers/constants/state';

const Note = ({ isOpen, handleClose, paymentDetailData, callback, nameAction }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    handleClose();
    reset();
    setModal(!modal);
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    isOpen && toggle();
    if (isOpen) {
      setValue('note', paymentDetailData.note);
    }
  }, [isOpen]);

  const onSubmit = (data) => {
    const noteNew = data?.note;
    const newData = {
      paymentId: paymentDetailData.paymentId,
      note: noteNew,
    };
    if (nameAction === REJECT_PAYMENT || nameAction === CANCEL_PAYMENT) {
      newData.paymentStatus = paymentDetailData.paymentStatus;
    }
    callback?.(newData, nameAction);
    toggle();
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size='lg'
      centered={true}
      scrollable={false}
      backdrop='static'>
      <ModalHeader toggle={toggle}>Note</ModalHeader>
      <ModalBody>
        <div className='note-content'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='d-flex align-items-center'>
              <div className='d-flex flex-column'>
                <textarea
                  name='note'
                  className='form-control'
                  {...register('note', {
                    required: 'Note is required',
                  })}
                  rows='15'
                  cols='100'
                />
                {errors?.note?.message && (
                  <span className='text-danger pt-2'>{errors.note.message}</span>
                )}
              </div>
            </div>
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

export default memo(Note);
