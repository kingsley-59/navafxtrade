import React, { useRef, useState, useEffect, Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import auth from '../Firebase';
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';


const Login = () => {
  const { currentUser, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  // const [identity, setIdentity] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  if (currentUser) {
    return <Navigate to="/dashboard" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {name: "John Davis", email: "jdavis@gmail.com"};

    let requestSettings = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    // try {
    //   let response = await fetch('/.netlify/functions/Hello', requestSettings)
    //   let data = await response.json()
    //   console.log(data);
    //   setErrMsg('');
    //   return true;
    // } catch (error) {
    //   console.log(error.message)
    //   setErrMsg(error.message);
    //   return false;
    // }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setErrMsg(error.code);
      alert(error.message);
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
            </div>
            </div>
          </div>
        </div>  
      </div>
  );
}


export default Login
