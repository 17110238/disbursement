import React from 'react';
import PropTypes from 'prop-types';
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  showRightSidebarAction,
} from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Rightbar = () => {
  const dispatch = useDispatch();
  const layoutType = useSelector((state) => state.Layout.layoutType);
  const layoutWidth = useSelector((state) => state.Layout.layoutWidth);
  const topbarTheme = useSelector((state) => state.Layout.topbarTheme);
  const leftSideBarType = useSelector((state) => state.Layout.leftSideBarType);
  const leftSideBarTheme = useSelector((state) => state.Layout.leftSideBarTheme);

  return (
    <aside>
      <div className='right-bar'>
        <div data-simplebar>
          <div className='rightbar-title px-3 py-4'>
            <Link
              to='#'
              onClick={(e) => {
                e.preventDefault();
                dispatch(showRightSidebarAction(false));
              }}
              className='right-bar-toggle float-end'>
              <i className='mdi mdi-close noti-icon' />
            </Link>
            <h5 className='m-0'>Settings</h5>
          </div>

          <hr className='my-0' />

          <div className='p-4'>
            <div className='radio-toolbar'>
              <span className='mb-2 d-block'>Layouts</span>
              <input
                type='radio'
                id='radioVertical'
                name='radioFruit'
                value='vertical'
                checked={layoutType === 'vertical' || layoutType === ''}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeLayout(e.target.value));
                  }
                }}
              />
              <label htmlFor='radioVertical'>Vertical</label>

              <input
                type='radio'
                id='radioHorizontal'
                name='radioFruit'
                value='horizontal'
                checked={layoutType === 'horizontal'}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeLayout(e.target.value));
                  }
                }}
              />
              <label htmlFor='radioHorizontal'>Horizontal</label>
            </div>

            <hr className='mt-1' />

            <div className='radio-toolbar'>
              <span className='mb-2 d-block' id='radio-title'>
                Layout Width
              </span>
              <input
                type='radio'
                id='radioFluid'
                name='radioWidth'
                value='fluid'
                checked={layoutWidth === 'fluid'}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeLayoutWidth(e.target.value));
                  }
                }}
              />
              <label htmlFor='radioFluid'>Fluid</label>
              <input
                type='radio'
                id='radioBoxed'
                name='radioWidth'
                value='boxed'
                checked={layoutWidth === 'boxed'}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeLayoutWidth(e.target.value));
                  }
                }}
              />{' '}
              <label htmlFor='radioBoxed'>Boxed</label>
            </div>
            <hr className='mt-1' />

            <div className='radio-toolbar'>
              <span className='mb-2 d-block' id='radio-title'>
                Topbar Theme
              </span>
              <input
                type='radio'
                id='radioThemeLight'
                name='radioTheme'
                value='light'
                checked={topbarTheme === 'light'}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeTopbarTheme(e.target.value));
                  }
                }}
              />
              <label htmlFor='radioThemeLight'>Light</label>

              <input
                type='radio'
                id='radioThemeDark'
                name='radioTheme'
                value='dark'
                checked={topbarTheme === 'dark'}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(changeTopbarTheme(e.target.value));
                  }
                }}
              />

              <label htmlFor='radioThemeDark'>Dark</label>
            </div>

            {layoutType !== 'horizontal' ? (
              <>
                <hr className='mt-1' />
                <div className='radio-toolbar'>
                  <span className='mb-2 d-block' id='radio-title'>
                    Left Sidebar Type{' '}
                  </span>
                  <input
                    type='radio'
                    id='sidebarDefault'
                    name='sidebarType'
                    value='default'
                    checked={leftSideBarType === 'default'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarType(e.target.value));
                      }
                    }}
                  />
                  <label htmlFor='sidebarDefault'>Default</label>

                  <input
                    type='radio'
                    id='sidebarCompact'
                    name='sidebarType'
                    value='compact'
                    checked={leftSideBarType === 'compact'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarType(e.target.value));
                      }
                    }}
                  />
                  <label htmlFor='sidebarCompact'>Compact</label>

                  <input
                    type='radio'
                    id='sidebarIcon'
                    name='sidebarType'
                    value='icon'
                    checked={leftSideBarType === 'icon'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarType(e.target.value));
                      }
                    }}
                  />
                  <label htmlFor='sidebarIcon'>Icon</label>
                </div>

                <hr className='mt-1' />

                <div className='radio-toolbar'>
                  <span className='mb-2 d-block' id='radio-title'>
                    Left Sidebar Color
                  </span>
                  <input
                    type='radio'
                    id='leftsidebarThemelight'
                    name='leftsidebarTheme'
                    value='light'
                    checked={leftSideBarTheme === 'light'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarTheme(e.target.value));
                      }
                    }}
                  />

                  <label htmlFor='leftsidebarThemelight'>Light</label>

                  <input
                    type='radio'
                    id='leftsidebarThemedark'
                    name='leftsidebarTheme'
                    value='dark'
                    checked={leftSideBarTheme === 'dark'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarTheme(e.target.value));
                      }
                    }}
                  />

                  <label htmlFor='leftsidebarThemedark'>Dark</label>

                  <input
                    type='radio'
                    id='leftsidebarThemecolored'
                    name='leftsidebarTheme'
                    value='colored'
                    checked={leftSideBarTheme === 'colored'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch(changeSidebarTheme(e.target.value));
                      }
                    }}
                  />
                  <label htmlFor='leftsidebarThemecolored'>Colored</label>
                </div>
                <hr className='mt-1' />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className='rightbar-overlay' />
    </aside>
  );
};

Rightbar.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  layoutType: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
};

export default Rightbar;
