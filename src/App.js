import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import 'assets/scss/theme.scss';
import 'flatpickr/dist/flatpickr.css';
import PrivateRoute from 'helpers/hooks/PrivateRoute';
import LoadingFullScreen from 'components/loading/LoadingFullScreen';
const AuthUser = lazy(() => import('pages/authentication/AuthUser'));
const HorizontalLayout = lazy(() => import('./components/horizontallayout'));
const VerticalLayout = lazy(() => import('./components/verticallayout'));
const Login = lazy(() => import('pages/authentication/Login'));
const Delegation = lazy(() => import('pages/delegation/DelegateContainer'));
const Dashboard = lazy(() => import('pages/dashboard'));

const App = () => {
  const layout = useSelector((state) => state.Layout.layoutType);
  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (layout) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  return (
    <Suspense fallback={<LoadingFullScreen loading={true} />}>
      <Router>
        <Routes>
          <Route path='auth-user/*' element={<AuthUser />} />
          <Route path='/*' element={<Login />} />
          <Route
            path='dashboard'
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path='delegation'
            element={
              <PrivateRoute>
                <Layout>
                  <Delegation />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
