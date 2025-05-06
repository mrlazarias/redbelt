// Constantes para valores de status e criticidade do sistema

// Status de alarmes
export const STATUS_ALARME = {
  0: 'Fechado',
  1: 'Aberto',
  2: 'Em andamento'
};

export const STATUS_ALARME_COLORS = {
  0: 'bg-gray-100 text-gray-800',
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800'
};

// Criticidade de alarmes
export const CRITICIDADE_ALARME = {
  0: 'Informação',
  1: 'Baixo',
  2: 'Médio',
  3: 'Alto',
  4: 'Crítico'
};

export const CRITICIDADE_ALARME_COLORS = {
  0: 'bg-gray-100 text-gray-800',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-orange-100 text-orange-800',
  4: 'bg-red-100 text-red-800'
};

// Estado ativo/inativo
export const ATIVO_STATUS = {
  0: 'Inativo',
  1: 'Ativo'
};

export const ATIVO_STATUS_COLORS = {
  0: 'bg-red-100 text-red-800',
  1: 'bg-green-100 text-green-800'
}; 