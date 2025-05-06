import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alarmeReducer from './slices/alarmeSlice';
import tipoAlarmeReducer from './slices/tipoAlarmeSlice';
import themeReducer from './slices/themeSlice';

// Configure middleware
const store = configureStore({
  reducer: {
    auth: authReducer,
    alarmes: alarmeReducer,
    tipoAlarmes: tipoAlarmeReducer,
    theme: themeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desabilitado para permitir objetos de Date e outros não serializáveis
    }),
});

export default store; 