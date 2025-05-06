import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import api from './services/api.js'

// Define o Axios global para uso em componentes que não utilizam o serviço diretamente
window.axios = api;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
