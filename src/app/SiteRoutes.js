import React, {lazy, Suspense, Component} from 'react';
import { Outlet, Route, Routes, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import App from './App';
import Login from './user-pages/Login';
import Register from './user-pages/Register';
import RequireAuth from './user-pages/RequireAuth';

import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const AccountSettings = lazy(() => import('./dashboard/AccountSettings'));
const Transactions = lazy(() => import('./dashboard/Transactions'));
const ContactSupport = lazy(() => import('./dashboard/ContactSupport'));
const Error404 = lazy(() => import('./error-pages/Error404'));

const Mdi = lazy(() => import('./icons/Mdi'));
const BasicElements = lazy(() => import('./form-elements/BasicElements'));



class SiteRoutes extends Component {
    render () {
      return (
        <Suspense fallback={<Spinner/>}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            <Route element={<RequireAuth />} >
              <Route exact path="/" element={ <App /> } >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="accountsettings" element={<AccountSettings />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="contactsupport" element={<ContactSupport />} />

                <Route path="icons/mdi" element={ <Mdi /> } />
                <Route path="form-Elements/basic-elements" component={ BasicElements } />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Route>
  
            <Route index element={<Navigate to="/dashboard" />} />
            
          </Routes>
        </Suspense>
      );
    }
}

export default SiteRoutes;