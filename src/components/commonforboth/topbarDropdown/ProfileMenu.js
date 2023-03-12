import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Cookie from 'js-cookie';

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const handleLogout = () => {
    Cookie.remove('ssid');
    Cookie.remove('transactionType');
    Cookie.remove('userRoles');
    Cookie.remove('delegationId');
    window.location.replace(`${process.env.REACT_APP_BFF}/home`);
  };

  return (
    <>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className='d-inline-block'>
        <DropdownToggle className='btn header-item ' id='page-header-user-dropdown' tag='button'>
          <i className='mdi mdi-account font-size-24'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <DropdownItem tag='a' href='/profile'>
            <i className='bx bx-user font-size-16 align-middle me-1' />
            Profile
          </DropdownItem>
          <DropdownItem tag='a' href='auth-lock-screen'>
            <i className='bx bx-lock-open font-size-16 align-middle me-1' />
            Lock screen
          </DropdownItem>
          <div className='dropdown-divider' />
          <div className='dropdown-item'>
            <i className='bx bx-power-off font-size-16 align-middle me-1 text-danger' />
            <span className='cursor-pointer' onClick={() => handleLogout()}>
              Logout
            </span>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ProfileMenu;
