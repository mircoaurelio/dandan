import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../dandan.ts';
import './styles.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App)
  )
);
