import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); 

root.render(
  <React.StrictMode>
    <Main /> 
  </React.StrictMode>
);