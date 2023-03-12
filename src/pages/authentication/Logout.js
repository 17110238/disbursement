import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from 'store/actions';

const Logout = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logoutUser(props.history));
  });

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
  logoutUser: PropTypes.func,
};

export default Logout;
