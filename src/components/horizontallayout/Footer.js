import React from 'react';
import { Container, Row } from 'reactstrap';

const Footer = () => {
  return (
    <>
      <footer className='footer'>
        <Container fluid={true}>
          <Row>
            <div className='col-12'>
              © {new Date().getFullYear()} Sunlife{' '}
              <span className='d-none d-sm-inline-block'>
                {' '}
                <i className='mdi mdi-heart text-danger'></i> VNIT
              </span>
            </div>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
