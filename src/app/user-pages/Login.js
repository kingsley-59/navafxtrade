import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';


const Login = () => {
  const { currentUser, login, logout, emailVerified, verifyEmail } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  // const [identity, setIdentity] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');

  useEffect(() => {
    if (!currentUser) return
    if (!emailVerified) {
      setWarningMsg(`Email ${currentUser?.email} not verified!`)
    }

  }, [])

  useEffect(() => {
    setErrMsg('');
    setWarningMsg('');
  }, [email, password])

  if (currentUser && emailVerified) {
    return <Navigate to="/dashboard" />
  }

  const handleEmailVerification = () => {
    verifyEmail(currentUser)
      .then(() => setWarningMsg('Verification email sent! Please check your email.'))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      if (!emailVerified){
        setWarningMsg(`Email ${currentUser?.email} not verified! `)
        return;
      }
      navigate(from, { replace: true });
    } catch (error) {
      setErrMsg(error.code);
    }
   
  }

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await logout();
      navigate('/register');
    } catch (error) {
      setErrMsg(error.message);
      console.log(error.message);
    }
  }

  return (
    <div>
      <HelmetConfig title="NavafxTrade Login" description="" keywords={[]} />
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{height: "100vh"}}>
            <div className="col-lg-6 col-md-6 col-sm-10 mx-auto">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Login form</h4>
                {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
                <form className="forms-sample" onSubmit={handleSubmit}>
                {warningMsg && <Alert className='d-flex justify-content-between text-small' variant={'warning'}>{warningMsg} <button className='btn btn-small btn-warning' onClick={handleEmailVerification} >Verify Email</button></Alert>}
                  <Form.Group className="mb-3">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <Form.Control type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" placeholder="Email" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <Form.Control type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="Password" />
                  </Form.Group>
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input"/>
                      <i className="input-helper"></i>
                      Remember me
                    </label>
                  </div>
                  <Form.Group className='text-center p-3'>
                    <button type="submit" className="btn btn-primary m-auto">Login</button>
                  </Form.Group>
                </form>
              </div>
              <p className="text-center">Don't have an account? <a href="/register">Register</a></p>
              { currentUser && <p className="text-center">Want to register with another email? <a href="#" onClick={handleLogout}>Logout</a></p>}
            </div>
            </div>
          </div>
        </div>  
      </div>
  );
}


export default Login
