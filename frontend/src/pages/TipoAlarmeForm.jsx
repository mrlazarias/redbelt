import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const TipoAlarmeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Carregar dados do tipo de alarme para edição
  useEffect(() => {
    if (isEditMode) {
      const fetchTipoAlarme = async () => {
        setLoadingData(true);
        try {
          const response = await api.get(`/tipo-alarmes/${id}`);
          const tipoAlarme = response.data;
          
          // Preencher formulário com dados existentes
          setValue('nome', tipoAlarme.nome);
          setValue('descricao', tipoAlarme.descricao);
          
        } catch (err) {
          console.error('Erro ao carregar tipo de alarme:', err);
          setError('Não foi possível carregar os dados do tipo de alarme.');
        } finally {
          setLoadingData(false);
        }
      };

      fetchTipoAlarme();
    }
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (isEditMode) {
        await api.put(`/tipo-alarmes/${id}`, data);
        setSuccess('Tipo de alarme atualizado com sucesso!');
      } else {
        await api.post('/tipo-alarmes', data);
        setSuccess('Tipo de alarme criado com sucesso!');
        reset(); // Limpar formulário após criação
      }
      
      // Redirecionar após sucesso (com timeout para exibir mensagem)
      setTimeout(() => {
        navigate('/tipo-alarmes');
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao salvar tipo de alarme:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o tipo de alarme. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver carregando os dados do tipo de alarme (somente para edição)
  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/tipo-alarmes" className="text-blue-600 hover:text-blue-800 mr-4">
          &larr; Voltar para Tipos de Alarme
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Tipo de Alarme' : 'Novo Tipo de Alarme'}
        </h1>
      </div>
      
      {error && (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          <p>{success}</p>
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="nome" className="form-label">
              Nome do Tipo de Alarme*
            </label>
            <input
              id="nome"
              type="text"
              {...register('nome', { 
                required: 'Nome é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Nome deve ter pelo menos 3 caracteres'
                },
                maxLength: {
                  value: 100,
                  message: 'Nome deve ter no máximo 100 caracteres'
                }
              })}
              className="form-input"
            />
            {errors.nome && (
              <span className="form-error">{errors.nome.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows="4"
              {...register('descricao', {
                maxLength: {
                  value: 500,
                  message: 'Descrição deve ter no máximo 500 caracteres'
                }
              })}
              className="form-input"
              placeholder="Descreva o tipo de alarme..."
            ></textarea>
            {errors.descricao && (
              <span className="form-error">{errors.descricao.message}</span>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              to="/tipo-alarmes"
              className="btn btn-secondary"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : isEditMode ? 'Atualizar Tipo de Alarme' : 'Criar Tipo de Alarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipoAlarmeForm; 