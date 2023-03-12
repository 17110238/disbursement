import * as types from 'store/types';

const INIT_STATE = {
  layoutType: '',
  layoutWidth: 'fluid',
  leftSideBarTheme: 'light',
  leftSideBarType: 'default',
  topbarTheme: 'light',
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
  showDelegationUser: false,
};

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      };
    case types.CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidth: action.payload,
      };
    case types.CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSideBarTheme: action.payload,
      };
    case types.CHANGE_SIDEBAR_TYPE:
      return {
        ...state,
        leftSideBarType: action.payload.sidebarType,
      };
    case types.CHANGE_TOPBAR_THEME:
      return {
        ...state,
        topbarTheme: action.payload,
      };
    case types.SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: action.payload,
      };
    case types.SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: action.payload,
      };
    case types.TOGGLE_LEFTMENU:
      return {
        ...state,
        leftMenu: action.payload,
      };
    case types.SHOW_DELEGATION_USER_FIXED:
      return {
        ...state,
        showDelegationUser: true,
      };
    case types.HIDE_DELEGATION_USER_FIXED:
      return {
        ...state,
        showDelegationUser: false,
      };

    default:
      return state;
  }
};

export default Layout;
