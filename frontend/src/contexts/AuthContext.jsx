import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Criar contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar axios com token quando o token muda
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/login', { email, password });
      
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    }
  };

  // Registro
  const register = async (name, email, password, password_confirmation) => {
    try {
      setError(null);
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: password // Para compatibilidade com a API
      });
      
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 