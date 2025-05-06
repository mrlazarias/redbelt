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
  const [filtroCriticidade, setFiltroCriticidade] = useState('');
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
    if (filtroCriticidade) params.criticidade = filtroCriticidade;
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
  }, [pagination.current_page, filtroStatus, filtroCriticidade, filtroTipo, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setCurrentPage(1)); // Voltar para a primeira página ao pesquisar
    loadAlarmes();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFiltroStatus('');
    setFiltroCriticidade('');
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
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Alarmes</h1>
          <p className="text-gray-600 dark:text-gray-400">Lista de todos os alarmes cadastrados no sistema</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/alarmes/novo" className="btn btn-primary">
            Novo Alarme
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:text-white"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              {Object.entries(STATUS_ALARME).map(([valor, label]) => (
                <option value={valor} key={valor}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="criticidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Criticidade
            </label>
            <select
              id="criticidade"
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:text-white"
              value={filtroCriticidade}
              onChange={(e) => setFiltroCriticidade(e.target.value)}
            >
              <option value="">Todas</option>
              {Object.entries(CRITICIDADE_ALARME).map(([valor, label]) => (
                <option value={valor} key={valor}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tipoAlarme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Alarme
            </label>
            <select
              id="tipoAlarme"
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:text-white"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos</option>
              {tipoAlarmes && tipoAlarmes.length > 0 && tipoAlarmes.map((tipo) => (
                <option value={tipo.id} key={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pesquisa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pesquisar
            </label>
            <div className="relative">
              <input
                type="text"
                id="pesquisa"
                className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm dark:text-white"
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Alarmes */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Criticidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ativo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {alarmes && alarmes.length > 0 && alarmes.map((alarme) => (
                <tr key={alarme.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {alarme.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {alarme.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {alarme.tipo_alarme ? alarme.tipo_alarme.nome : 'Não definido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        STATUS_ALARME_COLORS[alarme.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {STATUS_ALARME[alarme.status] || 'Desconhecido'}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      CRITICIDADE_ALARME_COLORS[alarme.criticidade] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {CRITICIDADE_ALARME[alarme.criticidade] || 'Desconhecido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ATIVO_STATUS_COLORS[alarme.ativo] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {ATIVO_STATUS[alarme.ativo] || 'Desconhecido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {alarme.data_ocorrencia ? new Date(alarme.data_ocorrencia).toLocaleString('pt-BR') : 'Não definido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/alarmes/${alarme.id}/editar`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(alarme.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {alarmes.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum alarme encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span className="font-medium">{pagination.current_page * perPage - perPage + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(pagination.current_page * perPage, pagination.total)}
                </span>{" "}
                de <span className="font-medium">{pagination.total}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    pagination.current_page === 1
                      ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Números de página */}
                {Array.from({ length: Math.ceil(pagination.total / perPage) }, (_, index) => index + 1).map((numero) => (
                  <button
                    key={numero}
                    onClick={() => handlePageChange(numero)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      pagination.current_page === numero
                        ? "z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-600 text-indigo-600 dark:text-indigo-200"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {numero}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= Math.ceil(pagination.total / perPage)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    pagination.current_page === Math.ceil(pagination.total / perPage)
                      ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="sr-only">Próximo</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmesList; 