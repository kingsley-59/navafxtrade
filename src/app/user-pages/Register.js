import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';

export const Register = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  useEffect(() => {
    let _email = currentUser?.email;
    if (_email) navigate('/login');
    return;
  }, [])
  

  return (
    <div>
      <HelmetConfig title="NavafxTrade Register" description="" keywords={[]} />
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{height: "100vh"}}>
          <div className="col-lg-6 col-md-6 col-sm-10 mx-auto">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Register </h3>
              
              <Alert variant={'warning'} className='p-3 mt-4 mb-4 mx-3'>
                <h4>Sorry, registration is disabled for this site. Visit <a href='http://app.navafxtrade.com'>app.navafxtrade.com</a> to sign in. </h4>
              </Alert>
            </div>
            <p className="text-center">Are you an admin? <a href="/login">Login</a></p>
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