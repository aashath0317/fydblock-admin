import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the provider
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './ErrorBoundary';

// ⚠️ REPLACE THIS STRING with your actual Google Client ID
// Fallback to a placeholder if not defined to prevent crashes
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER";

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("Missing VITE_GOOGLE_CLIENT_ID in environment variables. Google Login will not work.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)