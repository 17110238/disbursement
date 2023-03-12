import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

const ActionUser = ({ isOpen, setState, onCloseModal, userName, onClickAction, actionName }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    onCloseModal();
    setModal(!modal);
  };

  useEffect(() => {
    if (isOpen) {
      toggle(), setState(null);
    }
  }, [isOpen]);

  const handleActiveUser = () => {
    onClickAction?.();
    toggle();
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size='md'
      centered={true}
      className='modal-action-user'
      scrollable={false}
      backdrop='static'>
      <ModalHeader toggle={toggle}>
        <span>Confirmation</span>
      </ModalHeader>
      <ModalBody>
        <div className='d-flex flex-column align-items-center p-3'>
          <span className='font-size-18'>
            Are you sure want to
            {actionName === 'ACTIVE' ? ' active user as ' : ' cancel the delegation to '}
            <strong>{userName}</strong> ?
          </span>
          <div className='d-flex mt-5'>
            <button
              type='button'
              onClick={handleActiveUser}
              className='font-size-16 btn btn-secondary mx-3 btn-yes'>
              Yes
            </button>
            <button
              type='button'
              className='font-size-16 btn btn-secondary mx-3 btn-no'
              onClick={toggle}>
              No
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

ActionUser.propTypes = {
  isOpen: PropTypes.bool,
  userName: PropTypes.string,
  onCloseModal: PropTypes.func,
};

export default ActionUser;
