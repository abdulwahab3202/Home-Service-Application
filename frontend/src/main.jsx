import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import StoreContextProvider from './context/StoreContext.jsx';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <StoreContextProvider>
          <App />
        </StoreContextProvider>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
);