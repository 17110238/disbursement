import React from 'react';
import Logo from 'components/commonforboth/Logo';
import { showRightSidebarAction, toggleLeftmenu } from 'store/actions';
import NotificationDropdown from '../commonforboth/topbarDropdown/NotificationDropdown';
import ProfileMenu from '../commonforboth/topbarDropdown/ProfileMenu';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const dispatch = useDispatch();
  const showRightSidebar = useSelector((state) => state.Layout.showRightSidebar);
  const leftMenu = useSelector((state) => state.Layout.leftMenu);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  return (
    <>
      <header id='page-topbar'>
        <div className='navbar-header'>
          <div className='d-flex'>
            <Logo></Logo>
            <button
              type='button'
              onClick={() => {
                dispatch(toggleLeftmenu(!leftMenu));
              }}
              className='btn btn-sm me-2 font-size-24 d-lg-none header-item  waves-light'
              id='vertical-menu-btn'>
              <i className='mdi mdi-menu'></i>
            </button>
          </div>
          <div className='d-flex'>
            <form className='app-search d-none d-lg-block'>
              <div className='position-relative'>
                <input type='text' className='form-control' placeholder='Search...' />
                <span className='fa fa-search'></span>
              </div>
            </form>
            <div className='dropdown d-none d-lg-inline-block'>
              <button
                type='button'
                className='btn header-item noti-icon '
                onClick={() => {
                  toggleFullscreen();
                }}
                data-bs-toggle='fullscreen'>
                <i className='mdi mdi-fullscreen'></i>
              </button>
            </div>
            <NotificationDropdown />
            <ProfileMenu />
            <div className='dropdown d-inline-block'>
              <button
                onClick={() => {
                  dispatch(showRightSidebarAction(!showRightSidebar));
                }}
                type='button'
                className='btn header-item noti-icon right-bar-toggle '>
                <i className='mdi mdi-cog-outline'></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
