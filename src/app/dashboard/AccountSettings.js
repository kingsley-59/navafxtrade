import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import HelmetConfig from '../shared/Helmet';


const confirmationText = "delete-my-account";

const AccountSettings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');

  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false);

  const { currentUser, deleteSignedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Account Setings - Dashboard';
    let email, encodedEmail;

    email = currentUser?.email;
    encodedEmail = encodeURIComponent(email);
    if (!email) {
      setErrMsg("Oops! Looks like user isn't logged in")
      navigate('/login');
      return false;
    }

    fetch(`/.netlify/functions/UserManager?userEmail=${encodedEmail}`)
      .then(response => response.json())
      .then((data) => {
        let _data = data?.body?.rows;
        setEmail(email);
        setName(_data?.fullname ?? '');
        setPhone(_data?.phone ?? '');
        setCountry(_data?.country ?? '');
        console.log(_data);
      })
      .catch((err) => {
        setErrMsg(err.message);
      });
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    setLoading(true);
    let payload = {
      name, email, phone, country, address
    };
    let settings = {
      method: 'PUT',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    try {
      const response = await fetch('/.netlify/functions/UserManager', settings)
      const data = response.json();
      setSuccessMsg('Account profile updated successfully!');
    } catch (error) {
      setErrMsg(error.message);
    }

    setLoading(false);
  }

  const handleDeleteForm = async (e) => {
    e.preventDefault();
    setErrMsg('');

    try {
      await deleteSignedInUser(currentUser, password);
      
    } catch (error) {
      setErrMsg(error.message);
    }
  }

  return (
    <div>
      <HelmetConfig title="Account Profile Settings" description="" keywords={[]} />
      <div className="container">
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center mb-3">Profile Settings</h4>
                {errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}
                {successMsg && <Alert variant={'success'}>{successMsg}</Alert>}
                <form className="forms-sample" onSubmit={handleSubmit}>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputName1">Name</label>
                    <Form.Control type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} id="exampleInputName1" placeholder="Name" required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputEmail3">Email address</label>
                    <Form.Control type="email" className="form-control" value={email} id="exampleInputEmail3" placeholder="Email" disabled required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputTel3">Phone no.</label>
                    <Form.Control type="tel" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} id="exampleInputTel3" placeholder="Phone no." required />
                  </Form.Group>
                  {/* <Form.Group className='mb-3'>
                    <label htmlFor="exampleSelectGender">Gender</label>
                    <select className="form-control" id="exampleSelectGender">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </Form.Group> */}
                  <Form.Group className='mb-3'>
                    <label>File upload</label>
                    <div className="custom-file mt-1">
                      <Form.Control type="file" className="form-control" id="customFileLang" lang="es" hidden />
                      <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                    </div>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleInputCountry1">Country</label>
                    <Form.Control type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} id="exampleInputCountry1" placeholder="Location" required />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <label htmlFor="exampleTextarea1">Address</label>
                    <textarea className="form-control" value={address} onChange={e => setAddress(e.target.value)} id="exampleTextarea1" rows="4" placeholder='555 wolfstreet avenue, Green Bay, Wisconsin' required></textarea>
                  </Form.Group>
                  <Form.Group className='text-center p-3'>
                    <button type="submit" className="btn btn-primary m-auto" disabled={loading}>Submit</button>
                  </Form.Group>
                </form>
              </div>
            </div>
          </div>
          <div className="col-12 stretch-card">
            <div className="card border-1 border-danger rounded-3">
              <div className="card-body">
                <div className="card-title mb-3 h3 text-danger">Delete My Account</div>
                <form className="form-dample" onSubmit={handleDeleteForm}>
                  <Form.Group className='mb-3'>
                    {/* <label htmlFor="confirmText1">Name</label> <br /> */}
                    <div className='mb-3 fs-6'>type your password to confirm</div>
                    <Form.Control type="password" className="form-control text-black fw-bold" value={password} onChange={e => setPassword(e.target.value)} id="confirmText1" required />
                  </Form.Group>
                  <Form.Group className='text-left p-3 ps-0'>
                    <button type="submit" className="btn btn-danger text-white fw-normal p-3 m-auto" disabled={loading}>Delete account</button>
                  </Form.Group>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings