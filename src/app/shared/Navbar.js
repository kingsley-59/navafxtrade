import React, { useState, useEffect } from 'react';
import { Dropdown, Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import auth from '../Firebase';
import { useAuth } from '../context/AuthProvider';

const Navbar = () => {
  const [errMsg, setErrMsg] = useState('');
  const [fullName, setFullName] = useState('')

  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();

  function toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  function toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  // useEffect(() => {
  //   let encodedEmail = encodeURIComponent(currentUser?.email);
  //   fetch(`/.netlify/functions/UserManager?userEmail=${encodedEmail}`)
  //     .then(response => response.json())
  //     .then((data) => {
  //       let _data = data.body?.rows;
  //       if (!_data) return false;
  //       setFullName(_data.fullname);
  //     })
  // }, [])

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
      <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo-mini" to="/"> <h2>NavaFx.trade</h2> </Link>
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
            <a className="nav-link" href="!#" onClick={event => event.preventDefault()}>
              <i className="mdi mdi-view-grid"></i>
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
    </nav>
  );
}

export default Navbar;
