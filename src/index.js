import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new API
import './index.css';
import BallBouncingCircle from './components/BallBouncingCircle';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <BallBouncingCircle />
  </React.StrictMode>
);
