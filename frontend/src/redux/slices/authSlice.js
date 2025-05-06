import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Ação assíncrona para login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      const { user, token } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar o token no Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Falha ao fazer login');
    }
  }
);

// Ação assíncrona para registro
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', userData);
      const { user, token } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar o token no Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Falha ao registrar');
    }
  }
);

// Ação para verificar autenticação atual
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      // Configurar o token no Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verificar token com o backend
      const response = await api.get('/me');
      return { user: response.data, token };
    } catch (error) {
      // Remover token inválido
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return rejectWithValue('Sessão expirada ou inválida');
    }
  }
);

// Ação para logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Chamar API de logout se necessário
      await api.post('/logout');
      
      // Remover token do localStorage
      localStorage.removeItem('token');
      
      // Remover token do Axios
      delete api.defaults.headers.common['Authorization'];
      
      return null;
    } catch (error) {
      // Mesmo com erro, limpar o token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return rejectWithValue('Erro ao fazer logout');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = !!token;
      
      if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError, setAuthToken } = authSlice.actions;

export default authSlice.reducer; 