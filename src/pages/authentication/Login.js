import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Container, Form } from 'reactstrap';
import logoSm from 'assets/images/logo-sm.jpg';

export default function Login() {
  return (
    <React.Fragment>
      <div className='account-pages my-5 pt-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col md={8} lg={6} xl={4}>
              <Card className='overflow-hidden'>
                <div className='bg-primary'>
                  <div className='text-primary text-center p-4'>
                    <h5 className='text-white font-size-20'>Welcome Back local 3001!</h5>
                    <p className='text-white-50'>Sign in to continue to Disbursement</p>
                    <Link to='/' className='logo logo-admin'>
                      <img src={logoSm} height='24' alt='logo' />
                    </Link>
                  </div>
                </div>

                <CardBody className='p-4'>
                  <div className='p-3'>
                    <Form className='form-horizontal mt-4'>
                      <div className='mb-3'>
                        <input
                          name='username'
                          label='Username'
                          className='form-control'
                          placeholder='Enter username'
                          type='text'
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='password'
                          label='Password'
                          className='form-control'
                          type='password'
                          required
                          placeholder='Enter password'
                        />
                      </div>

                      <Row className='mb-3'>
                        <Col sm={6}>
                          <div className='form-check'>
                            <input
                              type='checkbox'
                              className='form-check-input'
                              id='customControlInline'
                            />
                            <label className='form-check-label' htmlFor='customControlInline'>
                              Remember me
                            </label>
                          </div>
                        </Col>
                        <Col sm={6} className='text-end'>
                          <button className='btn btn-primary w-md  waves-light' type='button'>
                            Log In
                          </button>
                        </Col>
                      </Row>
                      <Row className='mt-2 mb-0 row'>
                        <div className='col-12 mt-4'>
                          <Link to='/forgot-password'>
                            <i className='mdi mdi-lock'></i> Forgot your password?
                          </Link>
                        </div>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className='mt-5 text-center'>
                <p>
                  Don't have an account ?
                  <Link to='pages-register' className='fw-medium text-primary'>
                    Signup now
                  </Link>
                </p>
                <p className='mb-0'>
                  © {new Date().getFullYear()} Sunlife
                  <i className='mdi mdi-heart text-danger'></i> by VNIT
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
