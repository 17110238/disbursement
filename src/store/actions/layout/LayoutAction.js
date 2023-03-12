import * as types from 'store/types';

export const changeLayout = (layout) => ({
  type: types.CHANGE_LAYOUT,
  payload: layout,
});

export const changeLayoutWidth = (width) => ({
  type: types.CHANGE_LAYOUT_WIDTH,
  payload: width,
});

export const changeSidebarTheme = (theme) => ({
  type: types.CHANGE_SIDEBAR_THEME,
  payload: theme,
});

export const changeSidebarType = (sidebarType, isMobile) => ({
  type: types.CHANGE_SIDEBAR_TYPE,
  payload: { sidebarType, isMobile },
});

export const changeTopbarTheme = (topbarTheme) => ({
  type: types.CHANGE_TOPBAR_THEME,
  payload: topbarTheme,
});

export const showRightSidebarAction = (isopen) => ({
  type: types.SHOW_RIGHT_SIDEBAR,
  payload: isopen,
});

export const showSidebar = (isopen) => ({
  type: types.SHOW_SIDEBAR,
  payload: isopen,
});

export const toggleLeftmenu = (isopen) => ({
  type: types.TOGGLE_LEFTMENU,
  payload: isopen,
});
