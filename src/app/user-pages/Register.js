import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { sendEmailVerification } from "firebase/auth";
import { CountryDropdown } from 'react-country-region-selector';
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';
import auth from "../Firebase";

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { currentUser, signup, logout } = useAuth();

  useEffect(() => {
    let _email = currentUser?.email;
    if (_email) navigate('/login');
    return;
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(password !== confirmPassword) {
      setErrMsg('Passwords do not match!');
      setLoading(false);
      return false;
    }

    // window.grecaptcha.ready(() => {
    //   window.grecaptcha.execute('6Ld1YIofAAAAAFxMucV4Xh7M2_qA3aMFLB6C8iG4', {action: 'submit'}).then((token) => {
    //     // Send form value as well as token to the server
    //   })
    // })

    function resetForm () {
      setLoading(false);
      // setEmail('');
      // setPassword('');
      // setConfirmPassword('');
    }

    async function postData (data) {
      await logout(auth)
      let url = '/.netlify/functions/UserManager';
      let settings = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      let response = await fetch(url, settings)
      if (response.status !== 200 && response.status !== 201){
        setErrMsg('Oops! Server error.');
        throw new Error(`Server responded with error ${response.status}`);
      }
      return response.json();
    }

    try {
      setErrMsg('');
      signup(email, password)
        .then((userCreds) => {
          console.log(userCreds.user)
          sendEmailVerification(userCreds.user)
            .then(() => setSuccessMsg('Verification mail sent. Please verify your email to login. Redirecting to login page...'))
            .catch((error) => setErrMsg('Mail verification error'+error.message))
        })
        .catch((error) => {
          setErrMsg(error.message);
          setLoading(false);
        });
        
      if (errMsg !== '') return false;

      // send user details to database after signup
      postData({fullName, email, phone, country})
        .then((data) => {
          console.log(data);
          resetForm();
          
          setTimeout(() => {navigate('/login') }, 6000);
          return true;
        })
        .catch((error) => {
          setErrMsg('Registration failed. Please try again.');
          setLoading(false);
          console.log(error.message);
          return false;
        })
      
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      setErrMsg('Failed to create account! Please try again.');
      return false;
    }


  }

  return (
    <div>
      <HelmetConfig title="NavafxTrade Register" description="" keywords={[]} />
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{height: "100vh"}}>
          <div className="col-lg-6 col-md-6 col-sm-10 mx-auto">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center">Register </h4>
              {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
              {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
              <form className="forms-sample" onSubmit={handleSubmit}>
                <Form.Group>
                  <label htmlFor="fullname">FullName</label>
                  <Form.Control type="text" value={fullName} onChange={(e) => {setFullName(e.target.value)}} placeholder="Full name" required/>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="email">Email address</label>
                  <Form.Control type="email" className="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" required/>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="phone">Phone number</label>
                  <Form.Control type="tel" className="form-control" value={phone} onChange={(e) => {setPhone(e.target.value)}} placeholder="Phone number" required/>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="country">Country</label>
                  <CountryDropdown className='form-control' value={country} onChange={(val) => {setCountry(val)}} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="password">Password</label>
                  <Form.Control type="password" className="form-control" value={password} onChange={(e) => {setPassword(e.target.value)}}  placeholder="Password" required/>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <Form.Control type="password" className="form-control" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm password" required/>
                </Form.Group>
                <div class="g-recaptcha" data-sitekey="6Ld1YIofAAAAAFxMucV4Xh7M2_qA3aMFLB6C8iG4"></div>
                <div className="form-check">
                  <label className="form-check-label text-muted">
                    <input type="checkbox" className="form-check-input"/>
                    <i className="input-helper"></i>
                    Remember me
                  </label>
                </div>
                <Form.Group className='text-center p-3'>
                    <button type="submit" data-action="submit" className="btn btn-primary m-auto" disabled={loading}>Submit</button>
                  </Form.Group>
              </form>
            </div>
            <p className="text-center">Already have an account? <a href="/login">Login</a></p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Register


// async function checkIfUserExists(email) {
//   let encodedEmail = encodeURIComponent(email);
//   let response = await fetch(`/.netlify/functions/UserManager?userEmail=${encodedEmail}`)
//   if (response.status !== 200 && response.status !== 201){
//     setErrMsg('Oops! Server error.');
//     return false;
//   }
//   let data = response.json();
//   if (data.body || data.body !== {}) return true;
//   return false;
// }