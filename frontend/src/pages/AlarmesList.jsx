import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlarmes, deleteAlarme, setCurrentPage } from '../redux/slices/alarmeSlice';
import { fetchTipoAlarmes } from '../redux/slices/tipoAlarmeSlice';
import { 
  STATUS_ALARME, 
  STATUS_ALARME_COLORS, 
  CRITICIDADE_ALARME, 
  CRITICIDADE_ALARME_COLORS,
  ATIVO_STATUS,
  ATIVO_STATUS_COLORS
} from '../constants';

const AlarmesList = () => {
  const dispatch = useDispatch();
  const { alarmes, pagination, loading, error } = useSelector(state => state.alarmes);
  const { tipoAlarmes } = useSelector(state => state.tipoAlarmes);
  
  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [perPage] = useState(10);

  const loadAlarmes = () => {
    // Construir parâmetros para a API
    const params = {
      page: pagination.current_page,
      per_page: perPage
    };
    
    if (searchTerm) params.search = searchTerm;
    if (filtroStatus) params.status = filtroStatus;
    if (filtroTipo) params.tipo_alarme_id = filtroTipo;
    
    dispatch(fetchAlarmes(params));
  };

  useEffect(() => {
    // Carregar tipos de alarme apenas uma vez
    dispatch(fetchTipoAlarmes());
  }, [dispatch]);

  useEffect(() => {
    // Recarregar alarmes quando os filtros ou a página mudar
    loadAlarmes();
  }, [pagination.current_page, filtroStatus, filtroTipo, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1)); // Voltar para a primeira página ao pesquisar
    loadAlarmes();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFiltroStatus('');
    setFiltroTipo('');
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(pagination.total / perPage)) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este alarme?')) {
      try {
        await dispatch(deleteAlarme(id)).unwrap();
        // O estado já é atualizado pelo Redux após a exclusão ser concluída
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
              {tipoAlarmes && tipoAlarmes.length > 0 && tipoAlarmes.map((tipo) => (
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
              {Object.entries(STATUS_ALARME).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
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
                    Criticidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Ocorrência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ativo
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        CRITICIDADE_ALARME_COLORS[alarme.criticidade] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {CRITICIDADE_ALARME[alarme.criticidade] || 'Desconhecido'} ({alarme.criticidade})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {alarme.data_ocorrencia ? new Date(alarme.data_ocorrencia).toLocaleString('pt-BR') : 'Não definido'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        STATUS_ALARME_COLORS[alarme.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {STATUS_ALARME[alarme.status] || 'Desconhecido'} ({alarme.status})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ATIVO_STATUS_COLORS[alarme.ativo] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {ATIVO_STATUS[alarme.ativo] || 'Desconhecido'} ({alarme.ativo})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/alarmes/${alarme.id}/editar`} 
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
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
        </div>
      )}
      
      {/* Paginação */}
      {!loading && alarmes.length > 0 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              <span className="sr-only">Anterior</span>
              &laquo;
            </button>
            
            {/* Mostrar páginas */}
            {Array.from(
              { length: Math.ceil(pagination.total / perPage) },
              (_, i) => i + 1
            ).slice(
              Math.max(0, pagination.current_page - 3),
              Math.min(Math.ceil(pagination.total / perPage), pagination.current_page + 2)
            ).map((page) => (
              <button
                key={page}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  page === pagination.current_page
                    ? 'bg-blue-50 text-blue-600 z-10'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= Math.ceil(pagination.total / perPage)}
            >
              <span className="sr-only">Próxima</span>
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AlarmesList; 