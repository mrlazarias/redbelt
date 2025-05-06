import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [alarmes, setAlarmes] = useState([]);
  const [tiposAlarme, setTiposAlarme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAlarmes: 0,
    alarmesAtivos: 0,
    alarmesResolvidos: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar alarmes recentes
        const alarmesRes = await api.get('/alarmes?per_page=5');
        const alarmesData = alarmesRes.data.data || alarmesRes.data;
        setAlarmes(Array.isArray(alarmesData) ? alarmesData : []);
        
        // Carregar tipos de alarme
        const tiposRes = await api.get('/tipo-alarmes');
        const tiposData = tiposRes.data.data || tiposRes.data;
        setTiposAlarme(Array.isArray(tiposData) ? tiposData : []);
        
        // Carregar estatísticas
        const statsRes = await api.get('/alarmes/stats');
        setStats(statsRes.data || {
          totalAlarmes: 0,
          alarmesAtivos: 0,
          alarmesResolvidos: 0
        });
        
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo(a), {user?.name}!</h2>
        <p className="text-gray-600">Confira os últimos alarmes e estatísticas do sistema.</p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Alarmes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalAlarmes || 0}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Alarmes Ativos</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.alarmesAtivos || 0}</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Alarmes Resolvidos</h3>
          <p className="text-3xl font-bold text-green-500">{stats.alarmesResolvidos || 0}</p>
        </div>
      </div>
      
      {/* Alarmes recentes */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Alarmes Recentes</h2>
          <Link to="/alarmes" className="text-blue-600 hover:text-blue-800">Ver todos</Link>
        </div>
        
        {alarmes.length === 0 ? (
          <p className="text-gray-500">Nenhum alarme registrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criticidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Ocorrência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alarmes.map((alarme) => (
                  <tr key={alarme.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/alarmes/${alarme.id}`} className="text-blue-600 hover:text-blue-900">
                        {alarme.tipo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alarme.criticidade === 'alta' ? 'bg-red-100 text-red-800' : 
                        alarme.criticidade === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alarme.criticidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alarme.data_ocorrencia ? new Date(alarme.data_ocorrencia).toLocaleString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alarme.status === 3 ? 'bg-green-100 text-green-800' : 
                        alarme.status === 2 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alarme.status === 3 ? 'Resolvido' : 
                         alarme.status === 2 ? 'Em andamento' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Tipos de alarme */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tipos de Alarme</h2>
          <Link to="/tipo-alarmes" className="text-blue-600 hover:text-blue-800">Ver todos</Link>
        </div>
        
        {tiposAlarme.length === 0 ? (
          <p className="text-gray-500">Nenhum tipo de alarme registrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposAlarme.map((tipo) => (
              <div key={tipo.id} className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium text-gray-700">{tipo.nome}</h3>
                <p className="text-sm text-gray-500 mt-1">{tipo.descricao || 'Sem descrição'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 