import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Delegation = () => {
  const showDelegationUser = useSelector((state) => state.Layout.showDelegationUser);

  useEffect(() => {}, [showDelegationUser]);

  return (
    <div id='delegation-user'>
      <div className='content'>
        <span className='text-primary'>Authorizing under Nguyen Van A</span>
      </div>
    </div>
  );
};

export default Delegation;
