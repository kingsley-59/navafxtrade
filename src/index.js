import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import NetlifyIdentityContext from 'react-netlify-identity-gotrue'
import { AuthProvider } from './app/context/AuthProvider';
import { IdentityProvider } from './app/context/IdentityProvider';
import SiteRoutes from './app/SiteRoutes';
import "./i18n";
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
  <BrowserRouter>
    <NetlifyIdentityContext url={'https://users-avafx-trade.netlify.app'}>
      <AuthProvider>
        <SiteRoutes />
      </AuthProvider>
    </NetlifyIdentityContext>
  </BrowserRouter>
, document.getElementById('root'));

serviceWorker.unregister();