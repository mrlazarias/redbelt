import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import api from './services/api.js'
import store from './redux/store.js'
import { initRedux } from './redux/initRedux.js'
import { initializeTheme } from './redux/slices/themeSlice.js'

// Define o Axios global para uso em componentes que não utilizam o serviço diretamente
window.axios = api;

// Inicializar Redux
initRedux();

// Inicializar tema
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
