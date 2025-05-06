import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunks assíncronos
export const fetchAlarmes = createAsyncThunk(
  'alarmes/fetchAlarmes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/alarmes', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar alarmes');
    }
  }
);

export const fetchAlarme = createAsyncThunk(
  'alarmes/fetchAlarme',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/alarmes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar alarme');
    }
  }
);

export const createAlarme = createAsyncThunk(
  'alarmes/createAlarme',
  async (alarmeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/alarmes', alarmeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao criar alarme');
    }
  }
);

export const updateAlarme = createAsyncThunk(
  'alarmes/updateAlarme',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/alarmes/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar alarme');
    }
  }
);

export const deleteAlarme = createAsyncThunk(
  'alarmes/deleteAlarme',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/alarmes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao excluir alarme');
    }
  }
);

export const fetchAlarmeStats = createAsyncThunk(
  'alarmes/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/alarmes/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar estatísticas');
    }
  }
);

const initialState = {
  alarmes: [],
  alarme: null,
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0
  },
  stats: {
    totalAlarmes: 0,
    alarmesAtivos: 0,
    alarmesResolvidos: 0
  },
  loading: false,
  error: null,
  success: null
};

const alarmeSlice = createSlice({
  name: 'alarmes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.current_page = action.payload;
    },
    setPerPage: (state, action) => {
      state.pagination.per_page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch alarmes
      .addCase(fetchAlarmes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarmes.fulfilled, (state, action) => {
        state.alarmes = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total
        };
        state.loading = false;
      })
      .addCase(fetchAlarmes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single alarme
      .addCase(fetchAlarme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarme.fulfilled, (state, action) => {
        state.alarme = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlarme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create alarme
      .addCase(createAlarme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createAlarme.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Alarme criado com sucesso';
        // Não atualizamos a lista aqui para evitar inconsistências com a paginação
      })
      .addCase(createAlarme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update alarme
      .addCase(updateAlarme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateAlarme.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Alarme atualizado com sucesso';
        state.alarme = action.payload;
        
        // Atualizar o alarme na lista se ele estiver presente
        const index = state.alarmes.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.alarmes[index] = action.payload;
        }
      })
      .addCase(updateAlarme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete alarme
      .addCase(deleteAlarme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteAlarme.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Alarme excluído com sucesso';
        state.alarme = null;
        
        // Remover o alarme da lista
        state.alarmes = state.alarmes.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAlarme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch stats
      .addCase(fetchAlarmeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarmeStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlarmeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, setCurrentPage, setPerPage } = alarmeSlice.actions;
export default alarmeSlice.reducer; 