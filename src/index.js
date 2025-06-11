// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Make sure this is pointing to your App.jsx
import './index.css';     // Optional, for styling

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
