import React from 'react';
import { Link } from 'react-router-dom';
import logosmImg from 'assets/images/sunlife-logo-original-file.svg';

const Logo = () => {
  return (
    <div className='navbar-brand-box'>
      <Link to='/' className='logo'>
        <img src={logosmImg} alt='' height='40' />
        <span className='logo-lg system-name'>Disbursement</span>
      </Link>
    </div>
  );
};

export default Logo;
