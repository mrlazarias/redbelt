import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunks assíncronos
export const fetchTipoAlarmes = createAsyncThunk(
  'tipoAlarmes/fetchTipoAlarmes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tipo-alarmes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar tipos de alarme');
    }
  }
);

export const createTipoAlarme = createAsyncThunk(
  'tipoAlarmes/createTipoAlarme',
  async (nome, { rejectWithValue }) => {
    try {
      const response = await api.post('/tipo-alarmes', { nome });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao criar tipo de alarme');
    }
  }
);

const initialState = {
  tipoAlarmes: [],
  loading: false,
  error: null
};

const tipoAlarmeSlice = createSlice({
  name: 'tipoAlarmes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tipos de alarme
      .addCase(fetchTipoAlarmes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoAlarmes.fulfilled, (state, action) => {
        state.tipoAlarmes = action.payload.data || action.payload;
        state.loading = false;
      })
      .addCase(fetchTipoAlarmes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create tipo de alarme
      .addCase(createTipoAlarme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTipoAlarme.fulfilled, (state, action) => {
        state.tipoAlarmes.push(action.payload);
        state.loading = false;
      })
      .addCase(createTipoAlarme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = tipoAlarmeSlice.actions;
export default tipoAlarmeSlice.reducer; 