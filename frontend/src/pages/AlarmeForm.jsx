import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const AlarmeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [tiposAlarme, setTiposAlarme] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAlarme, setLoadingAlarme] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Carregar tipos de alarme
  useEffect(() => {
    const fetchTiposAlarme = async () => {
      try {
        const response = await api.get('/tipo-alarmes');
        const tiposData = response.data.data || response.data;
        setTiposAlarme(Array.isArray(tiposData) ? tiposData : []);
      } catch (err) {
        console.error('Erro ao carregar tipos de alarme:', err);
        setError('Não foi possível carregar os tipos de alarme.');
      }
    };

    fetchTiposAlarme();
  }, []);

  // Carregar dados do alarme para edição
  useEffect(() => {
    if (isEditMode) {
      const fetchAlarme = async () => {
        setLoadingAlarme(true);
        try {
          const response = await api.get(`/alarmes/${id}`);
          const alarme = response.data;
          
          // Preencher formulário com dados existentes
          setValue('tipo', alarme.tipo);
          setValue('tipo_alarme_id', alarme.tipo_alarme_id ? alarme.tipo_alarme_id.toString() : '');
          setValue('criticidade', alarme.criticidade || 'media');
          setValue('status', alarme.status ? alarme.status.toString() : '1');
          setValue('ativo', alarme.ativo === 1);
          
          // Formatar data para o input datetime-local
          if (alarme.data_ocorrencia) {
            const dataOcorrencia = new Date(alarme.data_ocorrencia);
            setValue('data_ocorrencia', formatDateTimeForInput(dataOcorrencia));
          }
          
        } catch (err) {
          console.error('Erro ao carregar alarme:', err);
          setError('Não foi possível carregar os dados do alarme.');
        } finally {
          setLoadingAlarme(false);
        }
      };

      fetchAlarme();
    }
  }, [id, isEditMode, setValue]);

  // Função para formatar data/hora para o input datetime-local
  const formatDateTimeForInput = (date) => {
    const isoString = date.toISOString();
    return isoString.substring(0, 16); // Formato: YYYY-MM-DDTHH:MM
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Formatar a data para o formato MySQL (YYYY-MM-DD HH:MM:SS)
      let dataOcorrencia = null;
      if (data.data_ocorrencia) {
        const date = new Date(data.data_ocorrencia);
        dataOcorrencia = date.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      // Preparar os dados para envio
      let formData = {
        ...data,
        ativo: data.ativo ? 1 : 0,
        status: parseInt(data.status, 10) || 1
      };
      
      // Adicionar data_ocorrencia apenas em modo de criação
      if (!isEditMode) {
        formData.data_ocorrencia = dataOcorrencia;
      } else {
        // No modo de edição, remover o campo data_ocorrencia para evitar erros de validação
        delete formData.data_ocorrencia;
      }
      
      if (isEditMode) {
        await api.put(`/alarmes/${id}`, formData);
        setSuccess('Alarme atualizado com sucesso!');
      } else {
        await api.post('/alarmes', formData);
        setSuccess('Alarme criado com sucesso!');
        reset(); // Limpar formulário após criação
      }
      
      // Redirecionar após sucesso (com timeout para exibir mensagem)
      setTimeout(() => {
        navigate('/alarmes');
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao salvar alarme:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o alarme. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Se estiver carregando os dados do alarme (somente para edição)
  if (loadingAlarme) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/alarmes" className="text-blue-600 hover:text-blue-800 mr-4">
          &larr; Voltar para Alarmes
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Alarme' : 'Novo Alarme'}
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
            <label htmlFor="tipo" className="form-label">
              Nome do Alarme*
            </label>
            <input
              id="tipo"
              type="text"
              {...register('tipo', { required: 'Nome é obrigatório' })}
              className="form-input"
            />
            {errors.tipo && (
              <span className="form-error">{errors.tipo.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="tipo_alarme_id" className="form-label">
              Tipo de Alarme*
            </label>
            <select
              id="tipo_alarme_id"
              {...register('tipo_alarme_id', { required: 'Tipo de alarme é obrigatório' })}
              className="form-input"
            >
              <option value="">Selecione um tipo</option>
              {tiposAlarme && tiposAlarme.length > 0 && tiposAlarme.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
            {errors.tipo_alarme_id && (
              <span className="form-error">{errors.tipo_alarme_id.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="criticidade" className="form-label">
              Criticidade*
            </label>
            <select
              id="criticidade"
              {...register('criticidade', { required: 'Criticidade é obrigatória' })}
              className="form-input"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            {errors.criticidade && (
              <span className="form-error">{errors.criticidade.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="form-label">
              Status*
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status é obrigatório' })}
              className="form-input"
            >
              <option value="1">Pendente</option>
              <option value="2">Em andamento</option>
              <option value="3">Resolvido</option>
            </select>
            {errors.status && (
              <span className="form-error">{errors.status.message}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="ativo"
              type="checkbox"
              {...register('ativo')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="ativo" className="ml-2 block text-gray-700">
              Ativo
            </label>
          </div>
          
          <div>
            <label htmlFor="data_ocorrencia" className="form-label">
              Data e Hora de Ocorrência*
            </label>
            <input
              id="data_ocorrencia"
              type="datetime-local"
              {...register('data_ocorrencia', { required: 'Data e hora de ocorrência são obrigatórias' })}
              className="form-input"
              disabled={isEditMode}
              readOnly={isEditMode}
            />
            {isEditMode && (
              <p className="text-sm text-gray-500 mt-1">
                A data de ocorrência não pode ser alterada.
              </p>
            )}
            {errors.data_ocorrencia && (
              <span className="form-error">{errors.data_ocorrencia.message}</span>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              to="/alarmes"
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
              ) : isEditMode ? 'Atualizar Alarme' : 'Criar Alarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlarmeForm; 