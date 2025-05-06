import api from '../services/api';
import store from './store';
import { setAuthToken } from './slices/authSlice';

/**
 * Inicializa configurações relacionadas ao Redux quando a aplicação é carregada
 */
export const initRedux = () => {
  // Configurar o token no Axios se estiver no localStorage
  const token = localStorage.getItem('token');
  if (token) {
    // Configurar o token no Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Atualizar o estado do Redux com o token
    store.dispatch(setAuthToken(token));
  }
};

export default initRedux; 