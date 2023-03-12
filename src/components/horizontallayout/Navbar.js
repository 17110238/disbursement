import React, { useEffect } from 'react';
import { Collapse } from 'reactstrap';
import listMenuSidebar from 'helpers/constants/listMenuSidebar';
import checkScope from 'helpers/checkScope';
import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const userRoles = ['DBM_CLAIM_DEPARTMENTHEAD'];

const Navbar = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const leftMenu = useSelector((state) => state.Layout.leftMenu);
  const handleClick = (e, index, path) => {
    e.preventDefault();
    path && navigate(`${path}`);
  };

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById('navigation');
    var items = ul.getElementsByTagName('a');
    for (var i = 0; i < items.length; ++i) {
      if (location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });
  const activateParentDropdown = (item) => {
    item.classList.add('active');
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add('active');
      const parent2 = parent.parentElement;
      parent2.classList.add('active');
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add('active');
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add('active');
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add('active');
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add('active');
            }
          }
        }
      }
    }
    return false;
  };

  const handleShowMenuNavBar = (menu, index) => {
    if (menu.scopes.length === 0 || checkScope(userRoles, menu.scopes)) {
      return (
        <span
          role='button'
          className='nav-link '
          onClick={(e) => handleClick(e, index, menu?.path)}>
          <i className={`${menu.icon} me-2`} />
          {menu.title}
        </span>
      );
    }
  };

  return (
    <>
      <div className='topnav'>
        <div className='container-fluid'>
          <nav className='navbar navbar-light navbar-expand-lg topnav-menu' id='navigation'>
            <Collapse isOpen={leftMenu} className='navbar-collapse' id='topnav-menu-content'>
              <ul className='navbar-nav'>
                {listMenuSidebar.map((menu, index) => (
                  <Fragment key={index}>
                    <li className='nav-item dropdown mega-dropdown'>
                      {handleShowMenuNavBar(menu, index)}
                    </li>
                  </Fragment>
                ))}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
