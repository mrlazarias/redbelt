import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AlarmesList = () => {
  const [alarmes, setAlarmes] = useState([]);
  const [tiposAlarme, setTiposAlarme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  const fetchAlarmes = async () => {
    setLoading(true);
    try {
      // Construir query params para a API
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filtroStatus) params.append('status', filtroStatus);
      if (filtroTipo) params.append('tipo_alarme_id', filtroTipo);
      
      const response = await api.get(`/alarmes?${params.toString()}`);
      
      // Verificar se response.data.data existe, se não, usar response.data
      const alarmesData = response.data.data || response.data;
      setAlarmes(Array.isArray(alarmesData) ? alarmesData : []);
      
      // Calcular total de páginas
      const total = response.data.total || alarmesData.length;
      setTotalPages(Math.ceil(total / perPage));
      
    } catch (err) {
      console.error('Erro ao carregar alarmes:', err);
      setError('Não foi possível carregar os alarmes. Tente novamente mais tarde.');
      setAlarmes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiposAlarme = async () => {
    try {
      const response = await api.get('/tipo-alarmes');
      // Verificar se a resposta é um array ou está dentro de data
      const tiposData = response.data.data || response.data;
      setTiposAlarme(Array.isArray(tiposData) ? tiposData : []);
    } catch (err) {
      console.error('Erro ao carregar tipos de alarme:', err);
      setTiposAlarme([]);
    }
  };

  useEffect(() => {
    // Carregar tipos de alarme apenas uma vez
    fetchTiposAlarme();
  }, []);

  useEffect(() => {
    // Recarregar alarmes quando os filtros ou a página mudar
    fetchAlarmes();
  }, [currentPage, filtroStatus, filtroTipo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Voltar para a primeira página ao pesquisar
    fetchAlarmes();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFiltroStatus('');
    setFiltroTipo('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este alarme?')) {
      try {
        await api.delete(`/alarmes/${id}`);
        // Recarregar a lista após excluir
        fetchAlarmes();
      } catch (err) {
        console.error('Erro ao excluir alarme:', err);
        alert('Não foi possível excluir o alarme. Tente novamente.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Alarmes</h1>
        <Link 
          to="/alarmes/novo" 
          className="btn btn-primary"
        >
          Novo Alarme
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="form-label">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Nome do alarme"
            />
          </div>
          
          <div>
            <label htmlFor="tipo" className="form-label">
              Tipo de Alarme
            </label>
            <select
              id="tipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="form-input"
            >
              <option value="">Todos</option>
              {tiposAlarme && tiposAlarme.length > 0 && tiposAlarme.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="form-input"
            >
              <option value="">Todos</option>
              <option value="1">Pendente</option>
              <option value="2">Em andamento</option>
              <option value="3">Resolvido</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
      
      {/* Lista de alarmes */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
        </div>
      ) : alarmes.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-500">Nenhum alarme encontrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Ocorrência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alarmes && alarmes.length > 0 && alarmes.map((alarme) => (
                  <tr key={alarme.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/alarmes/${alarme.id}`} className="text-blue-600 hover:text-blue-900">
                        {alarme.tipo || 'Sem nome'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alarme.tipo_alarme ? alarme.tipo_alarme.nome : 'Não definido'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alarme.data_ocorrencia ? new Date(alarme.data_ocorrencia).toLocaleString('pt-BR') : 'Não definido'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/alarmes/${alarme.id}/editar`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(alarme.id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmesList; 