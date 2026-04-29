import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/common/ErrorBoundary'
import App from './App.jsx'
import './index.css'

const GOOGLE_CLIENT_ID = '586392208753-mtgpbot1njbva32o6m7gojc0j0ms6gs2.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
