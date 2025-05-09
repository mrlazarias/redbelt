import axios from 'axios';

// Criando uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erro de autenticação
    if (error.response && error.response.status === 401) {
      console.error('Erro de autenticação na API:', error.response.data);
      
      // Não redirecionar para login neste caso, já que estamos usando token fixo
      // para fins de teste
    }
    
    return Promise.reject(error);
  }
);

export default api; 