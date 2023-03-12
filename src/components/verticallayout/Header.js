import React, { useState } from 'react';
import { Form, Dropdown, DropdownMenu, DropdownToggle, Input, Button } from 'reactstrap';
import NotificationDropdown from '../commonforboth/topbarDropdown/NotificationDropdown';
import ProfileMenu from '../commonforboth/topbarDropdown/ProfileMenu';
import Logo from 'components/commonforboth/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { showRightSidebarAction } from 'store/actions';

const Header = ({ onToggleSidebarContent }) => {
  const dispatch = useDispatch();
  const showRightSidebar = useSelector((state) => state.Layout.showRightSidebar);
  const [search, setsearch] = useState(false);

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
            <Logo />
            <button
              type='button'
              className='btn btn-sm px-3 font-size-24 header-item waves-effect'
              id='vertical-menu-btn'
              onClick={() => {
                onToggleSidebarContent();
              }}
              data-target='#topnav-menu-content'>
              <i className='mdi mdi-menu'></i>
            </button>
          </div>

          <div className='d-flex'>
            <Dropdown
              className='d-inline-block d-lg-none ms-2'
              onClick={() => {
                setsearch(!search);
              }}
              type='button'>
              <DropdownToggle
                className='btn header-item noti-icon waves-effect'
                id='page-header-search-dropdown'
                tag='button'>
                <i className='mdi mdi-magnify'></i>
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu-lg dropdown-menu-end p-0'>
                <Form className='p-3'>
                  <div className='form-group m-0'>
                    <div className='input-group'>
                      <Input
                        type='text'
                        className='form-control'
                        placeholder='Search ...'
                        aria-label="Recipient's username"
                      />
                      <div className='input-group-append'>
                        <Button className='btn btn-primary' type='submit'>
                          <i className='mdi mdi-magnify'></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </DropdownMenu>
            </Dropdown>

            <div className='dropdown d-none d-lg-inline-block'>
              <button
                type='button'
                onClick={() => {
                  toggleFullscreen();
                }}
                className='btn header-item noti-icon waves-effect'
                data-toggle='fullscreen'>
                <i className='mdi mdi-fullscreen'></i>
              </button>
            </div>

            <NotificationDropdown />
            <ProfileMenu />

            <div
              onClick={() => {
                dispatch(showRightSidebarAction(!showRightSidebar));
              }}
              className='dropdown d-inline-block'>
              <button
                type='button'
                className='btn header-item noti-icon right-bar-toggle waves-effect'>
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
