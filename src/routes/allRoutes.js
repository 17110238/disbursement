import Login from '../pages/authentication/Login';
import Dashboard from '../pages/dashboard';
import Delegation from '../pages/delegation/DelegateContainer';

const userRoutes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/delegation', component: Delegation },
  // { path: '/', exact: true, component: () => <Redirect to='/dashboard' /> },
  // { path: '/login', component: Login },
];

const authRoutes = [{ path: '/login', component: Login }];

export { userRoutes, authRoutes };
