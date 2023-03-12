import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from 'store/actions';

import Header from './Header';
import Footer from './Footer';
import Delegation from 'components/commonforboth/Delegation';
import Rightbar from 'components/commonforboth/Rightbar';
import SidebarContent from './SidebarContent';

const Index = ({ children }) => {
  const dispatch = useDispatch();
  const topbarTheme = useSelector((state) => state.Layout.topbarTheme);
  const showRightSidebar = useSelector((state) => state.Layout.showRightSidebar);
  const showDelegationUser = useSelector((state) => state.Layout.showDelegationUser);
  const leftSideBarTheme = useSelector((state) => state.Layout.leftSideBarTheme);
  const layoutWidth = useSelector((state) => state.Layout.layoutWidth);
  const leftSideBarType = useSelector((state) => state.Layout.leftSideBarType);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }

    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }

    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, []);

  const onToggleSidebarContent = () => {
    var body = document.body;
    if (window.screen.width <= 992) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
  };

  return (
    <>
      <div id='layout-wrapper'>
        <Header onToggleSidebarContent={onToggleSidebarContent} />

        <nav className='vertical-menu'>
          <div data-simplebar className='h-100'>
            <SidebarContent />
          </div>
        </nav>

        <section className='main-content'>
          <div className='page-content'>{children}</div>
        </section>
        <Footer />
      </div>
      {showRightSidebar && <Rightbar />}
      {showDelegationUser ? <Delegation /> : null}
    </>
  );
};

Index.propTypes = {
  children: PropTypes.object,
};

export default Index;
