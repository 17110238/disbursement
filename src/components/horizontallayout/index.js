import React, { useState, useEffect } from 'react';
// import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { changeLayout, changeTopbarTheme, changeLayoutWidth } from 'store/actions';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import Delegation from 'components/commonforboth/Delegation';
import Rightbar from 'components/commonforboth/Rightbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const location = useLocation();
  const showRightSidebar = useSelector((state) => state.Layout.showRightSidebar);
  const showDelegationUser = useSelector((state) => state.Layout.showDelegationUser);
  const topbarTheme = useSelector((state) => state.Layout.topbarTheme);
  const layoutWidth = useSelector((state) => state.Layout.layoutWidth);

  useEffect(() => {
    window.scrollTo(0, 0);
    const title = location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title = currentage + ' | UI Sample';

    dispatch(changeLayout('horizontal'));
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, []);

  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <>
      <div id='layout-wrapper'>
        <Header theme={topbarTheme} isMenuOpened={isMenuOpened} openLeftMenuCallBack={openMenu} />
        <Navbar menuOpen={isMenuOpened} />
        <section className='main-content'>
          <div className='page-content'>{children}</div>
        </section>
        <Footer />
      </div>
      {showRightSidebar ? <Rightbar /> : null}
      {showDelegationUser ? <Delegation /> : null}
      <Delegation />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};

export default Layout;
