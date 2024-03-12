import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './store/AuthProvider';
import './css/styles.css'
import AppProvider from './store/AppProvider';
import { SnackbarProvider, useSnackbar } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <SnackbarProvider
       >
        <App />
        </SnackbarProvider>
      </AppProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
