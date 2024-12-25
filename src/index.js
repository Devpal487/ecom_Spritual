import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CartProvider from './utils/Provider/CartContext'; 
import { ProfileThemeProvider } from './utils/Provider/ProfileProvider';

import { initPdfWorker } from './utils/initPdfWorker'; 

// Initialize PDF.js worker before rendering
initPdfWorker();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //  <React.StrictMode>
  <ProfileThemeProvider>
    <CartProvider>
      <App/>
    </CartProvider>
    </ProfileThemeProvider>
  //</React.StrictMode> 
);