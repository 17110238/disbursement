import React from 'react';

function LoadingInline({ loading = false }) {
  return loading ? (
    <div className='loading-inline'>
      <div className='lds-ring'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoadingInline;
