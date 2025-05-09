import api from '../services/api';
import store from './store';
import { setAuthToken } from './slices/authSlice';

/**
 * Inicializa configurações relacionadas ao Redux quando a aplicação é carregada
 */
export const initRedux = () => {
  // Usar o token fixo que obtivemos para teste
  const fixedToken = '45|NbBKYOSdT6tBfz2eWSy4RaWwez5YAnqziDCI1ZT1b5bc67d5';
  
  // Armazenar no localStorage para persistência
  localStorage.setItem('token', fixedToken);
  
  // Configurar o token no Axios
  api.defaults.headers.common['Authorization'] = `Bearer ${fixedToken}`;
  
  // Atualizar o estado do Redux com o token
  store.dispatch(setAuthToken(fixedToken));
};

export default initRedux; 