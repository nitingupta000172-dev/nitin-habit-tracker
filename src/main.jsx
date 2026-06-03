window.onerror = (msg, src, line, col, err) => {
  document.body.innerHTML = '<div style="color:red;padding:20px;font-family:monospace;word-break:break-all">' + msg + '<br/>' + (err?.stack || '') + '</div>';
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
