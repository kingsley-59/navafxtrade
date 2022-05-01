import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import NetlifyIdentityContext from 'react-netlify-identity-gotrue'
import { AuthProvider } from './app/context/AuthProvider';
import { IdentityProvider } from './app/context/IdentityProvider';
import SiteRoutes from './app/SiteRoutes';
import "./i18n";
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <SiteRoutes />
    </AuthProvider>
  </BrowserRouter>
);

serviceWorker.unregister();