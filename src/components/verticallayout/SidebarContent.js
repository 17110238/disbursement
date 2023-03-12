import { Link, useLocation } from 'react-router-dom';
import listMenuSidebar from 'helpers/constants/listMenuSidebar';
import checkScope from 'helpers/checkScope';
import { useEffect, useState } from 'react';
import { getCookie } from 'helpers/Cookie';

const SidebarContent = () => {
  const location = useLocation();
  const [userRoles, setUserRole] = useState([]);

  useEffect(() => {
    const getUserRole = getCookie('userRoles');
    if (!getUserRole) {
      return;
    } else {
      const newRole = [...getUserRole];
      setUserRole(newRole);
    }
  }, []);

  const handleShowMenu = (menu) => {
    if (menu.scopes.length === 0 || checkScope(userRoles, menu.scopes)) {
      return (
        <Link to={`${menu.path ? menu.path : '/#'}`}>
          <i className={`${menu.icon}`}></i>
          <span className='text-show'>{menu.title}</span>
        </Link>
      );
    }
  };

  return (
    <div id='sidebar-menu'>
      <ul className='metismenu list-unstyled' id='side-menu'>
        <li className='menu-title font-size-12'>MAIN</li>
        {listMenuSidebar.map((menu, index) => {
          return (
            <div key={index}>
              <li className={`${location.pathname === menu.path ? 'mm-active' : ''}`}>
                {handleShowMenu(menu)}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarContent;
