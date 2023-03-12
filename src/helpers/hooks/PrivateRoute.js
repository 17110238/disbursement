import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom/dist';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
  const isLogin = () => {
    if (Cookies.get('ssid') && Cookies.get('transactionType') && Cookies.get('userRoles')) {
      return true;
    }
    return false;
  };
  return isLogin() ? (
    children
  ) : (
    <Routes>
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

export default PrivateRoute;
