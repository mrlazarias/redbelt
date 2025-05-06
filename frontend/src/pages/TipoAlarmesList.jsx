import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TipoAlarmesList = () => {
  const [tiposAlarme, setTiposAlarme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTiposAlarme = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage
      });
      
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/tipo-alarmes?${params.toString()}`);
      setTiposAlarme(response.data.data);
      setTotalPages(Math.ceil(response.data.total / perPage));
      
    } catch (err) {
      console.error('Erro ao carregar tipos de alarme:', err);
      setError('Não foi possível carregar os tipos de alarme. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposAlarme();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTiposAlarme();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de alarme? Esta ação não pode ser desfeita e pode afetar alarmes existentes.')) {
      try {
        await api.delete(`/tipo-alarmes/${id}`);
        fetchTiposAlarme();
      } catch (err) {
        console.error('Erro ao excluir tipo de alarme:', err);
        
        if (err.response?.status === 409) {
          alert('Este tipo de alarme não pode ser excluído porque está sendo usado por alarmes existentes.');
        } else {
          alert('Não foi possível excluir o tipo de alarme. Tente novamente.');
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tipos de Alarme</h1>
        <Link 
          to="/tipo-alarmes/novo" 
          className="btn btn-primary"
        >
          Novo Tipo de Alarme
        </Link>
      </div>
      
      {/* Busca */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Buscar por nome..."
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="btn btn-secondary"
          >
            Limpar
          </button>
        </form>
      </div>
      
      {/* Lista de tipos de alarme */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
        </div>
      ) : tiposAlarme.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-500">Nenhum tipo de alarme encontrado.</p>
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
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tiposAlarme.map((tipo) => (
                  <tr key={tipo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tipo.nome}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{tipo.descricao || 'Sem descrição'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/tipo-alarmes/${tipo.id}/editar`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(tipo.id)} 
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
          {totalPages > 1 && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default TipoAlarmesList; 