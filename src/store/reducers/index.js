import { combineReducers } from 'redux';
import Layout from './layout/LayoutReducer';
import Login from './auth/LoginReducer';

const rootReducer = combineReducers({
  Layout,
  Login,
});

export default rootReducer;
