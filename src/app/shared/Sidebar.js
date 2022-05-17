import React, { Component } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';


function withRouter(Child) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Child {...props} router={{location, navigate, params}} />
  }
}


class Sidebar extends Component {

  state = {
    fullName: ''
  };

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true}); 
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path:'/apps', state: 'appsMenuOpen'},
      {path:'/basic-ui', state: 'basicUiMenuOpen'},
      {path:'/form-elements', state: 'formElementsMenuOpen'},
      {path:'/tables', state: 'tablesMenuOpen'},
      {path:'/icons', state: 'iconsMenuOpen'},
      {path:'/charts', state: 'chartsMenuOpen'},
      {path:'/user-pages', state: 'userPagesMenuOpen'},
      {path:'/error-pages', state: 'errorPagesMenuOpen'},
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  }

  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top" style={{opacity: 1}}>
          {/* <a className="sidebar-brand brand-logo" href="index.html"><img src={require('../../assets/images/logo.svg')} alt="logo" /></a> */}
          {/* <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></a> */}
          <Link className="navbar-brand brand-logo-mini text-white" to="/">
            <img src={require('../../assets/images/Avafx logo-Recovered.png')} height='120' width='100%' alt='navafx logo' />
          </Link>
        </div>
        <ul className="nav">
          {/* Profile section */}
          {/* <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img className="img-xs rounded-circle " src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                  <span className="count bg-success"></span>
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal"><Trans> { this.state.fullName } </Trans></h5>
                  <span><Trans>Gold Member</Trans></span>
                </div>
              </div>
              <Dropdown alignRight>
                <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                  <i className="mdi mdi-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sidebar-dropdown preview-list">
                  <a href="/accountsettings" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings-box text-primary"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Account settings</Trans></p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="/changepassword" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-onepassword  text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Change Password</Trans></p>
                    </div>
                  </a>
                  
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li> */}

          {/* navigation section */}
          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>Navigation</Trans></span>
          </li>
          <li className={ this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-speedometer text-primary"></i></span>
              <span className="menu-title"><Trans>Users</Trans></span>
            </Link>
          </li>
          {/* <li className={ this.isPathActive('/accountsettings') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-account-box-outline text-warning"></i>
              </span>
              <span className="menu-title"><Trans>Account Settings</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.basicUiMenuOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={ this.isPathActive('/accountsettings') ? 'nav-link active' : 'nav-link' } to="/accountsettings"><Trans>Profile</Trans></Link></li>
                  <li className="nav-item"> <Link className={ this.isPathActive('/withdrawalinfo') ? 'nav-link active' : 'nav-link' } to="/withdrawalinfo"><Trans>Withdrawal info</Trans></Link></li>
                  <li className="nav-item"> <Link className={ this.isPathActive('/changepassword') ? 'nav-link active' : 'nav-link' } to="/changepassword"><Trans>Change password</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li> */}
          <li className={ this.isPathActive('/transactions') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/transactions">
              <span className="menu-icon"><i className="mdi mdi-cash-multiple text-success"></i></span>
              <span className="menu-title"><Trans>All transactions</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/manageaccounts') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/manageaccounts">
              <span className="menu-icon"><i className="mdi mdi-upload text-success"></i></span>
              <span className="menu-title"><Trans>Manage Account Info</Trans></span>
            </Link>
          </li>
          {/* <li className={ this.isPathActive('/withdrawals') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/withdrawals">
              <span className="menu-icon"><i className="mdi mdi-cash-multiple text-info"></i></span>
              <span className="menu-title"><Trans>Withdrawals </Trans></span>
            </Link>
          </li> */}
          <li className={ this.isPathActive('/contactmessages') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/contactmessages">
              <span className="menu-icon"><i className="mdi mdi-message-outline text-warning"></i></span>
              <span className="menu-title"><Trans>Contact Messages</Trans></span>
            </Link>
          </li>
          <li className={ this.isPathActive('/packages') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/packages">
              <span className="menu-icon"><i className="mdi mdi-package text-primary"></i></span>
              <span className="menu-title"><Trans>Packages</Trans></span>
            </Link>
          </li>
          {/* <li className={ this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-share-variant text-success"></i></span>
              <span className="menu-title"><Trans>Referals</Trans></span>
            </Link>
          </li> */}

          
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    // return this.props.location.pathname.startsWith(path);
    return '';
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);