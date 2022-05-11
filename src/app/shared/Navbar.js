import React, { useState, useEffect } from 'react';
import { Dropdown, Alert, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import auth, {storage} from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '../context/AuthProvider';

const KycModal = ({open, setOpen, valid_id, passport_photo}) => {
  const [validId, setValidId] = useState();
  const [passport, setPassport] = useState();

  // const [validIdUrl, setValidIdUrl] = useState(valid_id);
  // const [passportUrl, setPassportUrl] = useState(passport_photo);

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { currentUser } = useAuth();
  const email = currentUser?.email;

  useEffect(() => {
    console.log("Valid id: ", valid_id)
    console.log("Passport: ", passport_photo)
    if (valid_id && passport_photo) {
      setSuccessMsg('Kyc previously uploaded! Please do not update the photo unless you need to.')
    } else if (valid_id && !passport_photo) {
      setErrMsg('Valid ID previously uploaded. Please upload your passport.')
    } else if (!valid_id && passport_photo) {
      setErrMsg('Passport photo previously uploaded. Please upload your valid ID.')
    } else {
      setErrMsg('Please upload a valid ID and passport to complete account verification.')
    }
  }, [valid_id, passport_photo])

  const handleClose = () => setOpen(false);

  const saveImageUrl = (idUrl, passportUrl) => {
    
    const payload = {
      email: email,
      validId: idUrl,
      passport: passportUrl
    }
    const settings = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }

    fetch('/.netlify/functions/setKycDetails', settings)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setSuccessMsg('Kyc info updated successfully');
      } else {
        setErrMsg(data.error)
      }
    })
    .catch(error => {
      console.log(error.message)
      setErrMsg(error.message)
    })

  }

  const uploadImage = (image, type) => {
    try {
      const storageRef = ref(storage, `kyc/${email}_${type}_${image.name}`);
      uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log('Upload success', snapshot);
        getDownloadURL(storageRef).then(url => {
          console.log(url)
          if(type === 'validId'){
            saveImageUrl(url, passport_photo);
          } else {
            saveImageUrl(valid_id, url);
          }
          return;
        })

      })
      .catch((error) => {
        setErrMsg(error.message)
        return;
      })
      
    } catch (error) {
      console.log(error.message)
      //setErrMsg(error.message);
    }

    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg('');
    setSuccessMsg('');

    let formName = e.target.getAttribute('data-form-name')

    switch (formName) {
      case 'valid-id-form':
        uploadImage(validId, 'validId')
        break;
      case 'passport-form':
        uploadImage(passport, 'passport')
        break;
    
      default:
        break;
    }
  }

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        KYC Verification
      </Modal.Header>
      <Modal.Body className='card'>
        { successMsg && <Alert variant='success' >{successMsg}</Alert> }
        { errMsg && <Alert variant='warning' >{errMsg}</Alert> }
        <div className=" card-body grid-margin">
          <form data-form-name='valid-id-form' onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="d-flex justify-content-between align-items-center">
                <div className="">
                  <label > Upload a valid ID card</label>
                </div>
                <div className="">
                  <input type="submit" value="Submit" className="btn btn-success" />
                </div>
              </div>
              <div className="custom-file mt-3">
                <input type="file" onChange={(e) => {setValidId(e.target.files[0])}} className="form-control" id="validIdFile" lang="es" hidden />
                <label htmlFor="validIdFile" className="container w-100 border border-sm rounded">
                  <div className="d-flex flex-column justify-content-center align-items-center" style={{minHeight: 100}}>
                      <h4 className="text-secondary"> { validId?.name ?? 'Upload a valid ID' } </h4>
                      <label className="custom-file-label" htmlFor="validIdFile">Upload</label>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
        <hr />
        <div className=" card-body grid-margin">
          <form data-form-name='passport-form' onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="d-flex justify-content-between align-items-center">
                <div className="">
                  <label > Upload a passport</label>
                </div>
                <div className="">
                  <input type="submit" value="Submit" className="btn btn-success" />
                </div>
              </div>
              <div className="custom-file mt-3">
                <input type="file" onChange={(e) => {setPassport(e.target.files[0])}} className="form-control" id="PassportFile" lang="es" hidden />
                <label htmlFor="PassportFile" className="container w-100 border border-sm rounded">
                  <div className="d-flex flex-column justify-content-center align-items-center" style={{minHeight: 100}}>
                      <h4 className="text-secondary"> { passport?.name ?? 'Upload passport' } </h4>
                      <label className="custom-file-label" htmlFor="PassportFile">Upload</label>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

const Navbar = () => {
  const [errMsg, setErrMsg] = useState('');
  const [fullName, setFullName] = useState('')

  const [kycModalOpen, setKycModalOpen] = useState(false)
  const [kycId, setKycId] = useState('')
  const [kycPassport, setKycPassport] = useState('')

  const handleOpen = (e) => {
    e.preventDefault();
    setKycModalOpen(true);
  }

  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();

  function toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  function toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  useEffect(() => {
    console.log(currentUser);
    let encodedEmail = encodeURIComponent(currentUser?.email);
    fetch(`/.netlify/functions/UserManager?userEmail=${encodedEmail}`)
      .then(response => response.json())
      .then((data) => {
        let _data = data.body?.rows;
        if (!_data) return false;
        setFullName(_data.fullname);
        setKycId(_data.valid_id)
        setKycPassport(_data.passport)
      })
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      await logout(auth);
      navigate('/login');
    } catch (error) {
      console.log(error.code);
      setErrMsg(error.code);
    }
  }
  
  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="sidebar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo-mini" to="/"> 
          <img src={require('../../assets/images/Avafx logo-Recovered.png')} height='90' width='100%' alt='navafx logo' />
        </Link>
      </div>
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <button className="navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
          <span className="mdi mdi-menu"></span>
        </button>
        <ul className="navbar-nav w-100">
          <li className="nav-item w-100">
            <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
              <input type="text" className="form-control" placeholder="Search products" />
            </form>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <Dropdown alignRight as="li" className="nav-item d-none d-lg-block">
            <Link to={'/deposit'}>
              <Button className="nav-link btn btn-success text-white text-decoration-none create-new-button no-caret">
              + <Trans>Deposit Funds</Trans>
              </Button>
            </Link>
          </Dropdown>
          <li className="nav-item d-none d-lg-block">
            <a className="nav-link" href="!#" onClick={e => handleOpen(e)}>
              <Trans>Upload KYC </Trans><i className="mdi mdi-view-grid"></i>
            </a>
          </li>
          
          <Dropdown alignRight as="li" className="nav-item">
            <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
              <div className="navbar-profile">
                <img className="img-xs rounded-circle" src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                <p className="mb-0 d-none d-sm-block navbar-profile-name"><Trans>{ fullName }</Trans></p>
                <i className="mdi mdi-menu-down d-none d-sm-block"></i>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
              <h6 className="p-3 mb-0"><Trans>Profile</Trans></h6>
              <Dropdown.Divider />
              <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-settings text-success"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1"><Trans>Settings</Trans></p>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="!#" onClick={handleLogout}  className="preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-logout text-danger"></i>
                  </div>
                </div>
                <div className="preview-item-content" >
                  <p className="preview-subject mb-1"><Trans>Log Out</Trans></p>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <p className="p-3 mb-0 text-center">{errMsg && <Alert variant={'danger'}>{errMsg}</Alert>}</p>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
          <span className="mdi mdi-format-line-spacing"></span>
        </button>
      </div>
      <KycModal open={kycModalOpen} setOpen={setKycModalOpen} valid_id={kycId} passport_photo={kycPassport} />
    </nav>
  );
}

export default Navbar;
