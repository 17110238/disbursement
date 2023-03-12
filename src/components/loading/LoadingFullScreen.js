import React from 'react';

function LoadingFullScreen({ loading = false }) {
  return loading ? (
    <div className='loading-full-screen'>
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

export default LoadingFullScreen;
