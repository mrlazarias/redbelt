import { createSlice } from '@reduxjs/toolkit';

// Estado inicial: sempre modo escuro
const initialState = {
  darkMode: true
};

// Função para aplicar o tema escuro em toda a aplicação
const applyDarkMode = () => {
  // Aplicar classe dark ao HTML e body para Tailwind CSS
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark-mode');
  // Definir atributo de tema para elementos meta
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#111827');
  // Aplicar variáveis CSS diretamente
  document.documentElement.style.setProperty('--bg-color', '#111827');
  document.documentElement.style.setProperty('--text-color', '#f9fafb');
  document.documentElement.style.setProperty('--card-bg', '#1f2937');
  document.documentElement.style.setProperty('--border-color', '#374151');
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {}  // Não precisamos mais de reducers para alternar o tema
});

// Função para inicializar o tema ao carregar a aplicação
export const initializeTheme = () => {
  // Sempre aplicar o tema escuro
  applyDarkMode();
  return true;
};

export default themeSlice.reducer; 