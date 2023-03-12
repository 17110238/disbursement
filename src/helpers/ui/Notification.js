import React, { useState, useEffect } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import SuccessImage from 'assets/images/success.png';
import FailImage from 'assets/images/fail.png';
import WarningImage from 'assets/images/warning.png';
import { FAIL, SUCCESS, WARNING } from '../constants/state';

export default function Notification({
  state,
  message,
  isOpen,
  setIsShowNotify,
  callback,
  data,
  nameAction,
}) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setIsShowNotify(false);
  };

  useEffect(() => {
    if (isOpen) {
      toggle();
      if (state === SUCCESS || state === FAIL) {
        setTimeout(() => {
          setModal(false);
          setIsShowNotify(false);
        }, 1500);
      }
    }
  }, [isOpen]);

  const showImage = () => {
    if (state === SUCCESS) {
      return SuccessImage;
    } else if (state === WARNING) {
      return WarningImage;
    } else {
      return FailImage;
    }
  };

  const handleConfirm = () => {
    setModal(!modal);
    setIsShowNotify(false);
    callback?.(data, nameAction);
  };

  return (
    <Modal isOpen={modal} centered={true} toggle={toggle} className='notification-modal'>
      <ModalBody className='py-5'>
        <div className='content'>
          <div className='d-flex justify-content-center'>
            <img src={showImage()} alt='image' />
          </div>
          <span className='mt-3 font-size-18 text-black text-center'>{message}</span>
          {state === WARNING ? (
            <div className='d-flex'>
              <button onClick={handleConfirm} type='button' className='button btn-submit warning'>
                Yes
              </button>

              <button type='button' onClick={toggle} className='button btn-cancel warning'>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={toggle}
              className={`button ${state === SUCCESS ? 'success' : 'danger'}`}>
              Close
            </button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
