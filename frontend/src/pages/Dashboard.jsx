import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlarmeStats, fetchAlarmes } from '../redux/slices/alarmeSlice';
import { fetchTipoAlarmes } from '../redux/slices/tipoAlarmeSlice';
import { STATUS_ALARME, CRITICIDADE_ALARME } from '../constants';

// Importando biblioteca de gráficos 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Registrando os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, alarmes, loading: alarmesLoading } = useSelector(state => state.alarmes);
  const { tipoAlarmes, loading: tiposLoading } = useSelector(state => state.tipoAlarmes);
  const { darkMode } = useSelector(state => state.theme);
  const [tipoAlarmesStats, setTipoAlarmesStats] = useState([]);
  const [criticidadeStats, setCriticidadeStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const loading = alarmesLoading || tiposLoading;

  // Carregar todos os alarmes e tipos de alarmes quando o componente montar
  useEffect(() => {
    dispatch(fetchAlarmeStats());
    dispatch(fetchTipoAlarmes());
    dispatch(fetchAlarmes({ per_page: 100 })); // Buscar um número maior para estatísticas
  }, [dispatch]);

  // Calcular estatísticas quando os dados estiverem disponíveis
  useEffect(() => {
    if (alarmes?.length > 0 && tipoAlarmes?.length > 0) {
      // Calcular estatísticas por tipo de alarme usando os tipos cadastrados
      calculateTipoAlarmeStats();
      
      // Calcular estatísticas por criticidade
      calculateCriticidadeStats();
      
      // Calcular estatísticas por status
      calculateStatusStats();
    }
  }, [alarmes, tipoAlarmes]);

  // Função para calcular estatísticas por tipo de alarme
  const calculateTipoAlarmeStats = () => {
    const tiposStats = tipoAlarmes.map(tipo => {
      // Contar quantos alarmes existem para este tipo
      const count = alarmes.filter(alarme => alarme.tipo_alarme_id === tipo.id).length;
      return {
        id: tipo.id,
        nome: tipo.nome,
        total: count
      };
    });
    
    // Ordenar por quantidade (maior para menor)
    tiposStats.sort((a, b) => b.total - a.total);
    
    setTipoAlarmesStats(tiposStats);
  };

  // Função para calcular estatísticas por criticidade
  const calculateCriticidadeStats = () => {
    // Inicializar contagem para cada nível de criticidade (0 a 4)
    const criticidadeCounts = [0, 0, 0, 0, 0];
    
    // Contar alarmes por nível de criticidade
    alarmes.forEach(alarme => {
      const criticidade = Number(alarme.criticidade);
      if (criticidade >= 0 && criticidade <= 4) {
        criticidadeCounts[criticidade]++;
      }
    });
    
    // Formatar para o estado
    const stats = criticidadeCounts.map((total, criticidade) => ({ criticidade, total }));
    setCriticidadeStats(stats);
  };

  // Função para calcular estatísticas por status
  const calculateStatusStats = () => {
    // Inicializar contagem para cada status (0 a 2)
    const statusCounts = [0, 0, 0];
    
    // Contar alarmes por status
    alarmes.forEach(alarme => {
      const status = Number(alarme.status);
      if (status >= 0 && status <= 2) {
        statusCounts[status]++;
      }
    });
    
    // Formatar para o estado
    const stats = statusCounts.map((total, status) => ({ status, total }));
    setStatusStats(stats);
  };

  // Dados para o gráfico de rosca de tipos de alarme
  const tipoAlarmeChartData = {
    labels: tipoAlarmesStats.map(item => item.nome),
    datasets: [
      {
        data: tipoAlarmesStats.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#B370CE', '#52BE80', '#EC7063', '#5D6D7E'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de barras de criticidade
  const criticidadeChartData = {
    labels: criticidadeStats.map(item => `${CRITICIDADE_ALARME[item.criticidade]} (${item.criticidade})`),
    datasets: [
      {
        label: 'Alarmes por Criticidade',
        data: criticidadeStats.map(item => item.total),
        backgroundColor: [
          'rgba(200, 200, 200, 0.6)', // Informação
          'rgba(54, 162, 235, 0.6)',  // Baixo
          'rgba(255, 206, 86, 0.6)',  // Médio
          'rgba(255, 159, 64, 0.6)',  // Alto
          'rgba(255, 99, 132, 0.6)',  // Crítico
        ],
        borderColor: [
          'rgba(200, 200, 200, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de barras de status
  const statusChartData = {
    labels: statusStats.map(item => `${STATUS_ALARME[item.status]} (${item.status})`),
    datasets: [
      {
        label: 'Alarmes por Status',
        data: statusStats.map(item => item.total),
        backgroundColor: [
          'rgba(200, 200, 200, 0.6)', // Fechado
          'rgba(255, 206, 86, 0.6)',  // Aberto
          'rgba(54, 162, 235, 0.6)',  // Em andamento
        ],
        borderColor: [
          'rgba(200, 200, 200, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configurações para os gráficos de barra
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Obter data atual formatada
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Transformar primeira letra em maiúscula
  const hojeFormatado = hoje.charAt(0).toUpperCase() + hoje.slice(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">{hojeFormatado}</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/alarmes/novo" className="btn btn-primary">
            Novo Alarme
          </Link>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Alarmes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total de Alarmes</p>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{alarmes?.length || 0}</h2>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-green-500 dark:text-green-400">+12%</span> em relação ao mês passado
          </div>
        </div>

        {/* Alarmes Ativos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Alarmes Ativos</p>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {alarmes?.filter(a => a.ativo === 1).length || 0}
              </h2>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-red-500 dark:text-red-400">+5%</span> em relação ao mês passado
          </div>
        </div>

        {/* Alarmes Críticos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Alarmes Críticos</p>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {alarmes?.filter(a => parseInt(a.criticidade) === 4).length || 0}
              </h2>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-red-500 dark:text-red-400">+2%</span> em relação ao mês passado
          </div>
        </div>

        {/* Alarmes Fechados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Alarmes Fechados</p>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {alarmes?.filter(a => parseInt(a.status) === 0).length || 0}
              </h2>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-green-500 dark:text-green-400">+8%</span> em relação ao mês passado
          </div>
        </div>
      </div>

      {/* Seção de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de rosca - Tipos de Alarmes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Distribuição por Tipo</h3>
          <div className="h-64">
            {tipoAlarmesStats.length > 0 ? (
              <Doughnut 
                data={tipoAlarmeChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)'
                      }
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Nenhum tipo de alarme cadastrado
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de barras - Criticidade */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Alarmes por Criticidade</h3>
          <div className="h-64">
            {criticidadeStats.some(item => item.total > 0) ? (
              <Bar data={criticidadeChartData} options={{
                ...barChartOptions,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                    },
                    grid: {
                      color: darkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                    },
                    grid: {
                      color: darkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                    }
                  }
                }
              }} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Nenhum alarme cadastrado
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de barras - Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Alarmes por Status</h3>
          <div className="h-64">
            {statusStats.some(item => item.total > 0) ? (
              <Bar data={statusChartData} options={{
                ...barChartOptions,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                    },
                    grid: {
                      color: darkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                    },
                    grid: {
                      color: darkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                    }
                  }
                }
              }} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Nenhum alarme cadastrado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/alarmes" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Lista de Alarmes</h3>
              <p className="text-gray-600 dark:text-gray-400">Visualize e gerencie todos os alarmes</p>
            </div>
          </div>
        </Link>

        <Link to="/alarmes/novo" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:bg-green-50 dark:hover:bg-gray-700 transition duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Novo Alarme</h3>
              <p className="text-gray-600 dark:text-gray-400">Registre um novo alarme no sistema</p>
            </div>
          </div>
        </Link>

        <Link to="/tipos-alarme" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:bg-purple-50 dark:hover:bg-gray-700 transition duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tipos de Alarme</h3>
              <p className="text-gray-600 dark:text-gray-400">Gerencie as categorias de alarmes</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 