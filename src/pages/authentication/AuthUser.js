import LoadingFullScreen from 'components/loading/LoadingFullScreen';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getInfoOfUser } from 'store/actions';

const AuthUser = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const getSSID = searchParams.get('ssid');
  useEffect(() => {
    setLoading(true);
    const payload = { ssid: getSSID };
    dispatch(
      getInfoOfUser(payload, (status) => {
        if (status) {
          navigate('/dashboard');
        }
        setLoading(false);
      })
    );
  }, [getSSID]);
  return (
    <div>
      <LoadingFullScreen loading={loading} />
    </div>
  );
};

export default AuthUser;
