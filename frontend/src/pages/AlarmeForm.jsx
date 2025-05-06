import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createAlarme, updateAlarme, fetchAlarme } from '../redux/slices/alarmeSlice';
import { fetchTipoAlarmes } from '../redux/slices/tipoAlarmeSlice';
import { 
  STATUS_ALARME, 
  CRITICIDADE_ALARME, 
  ATIVO_STATUS 
} from '../constants';

const AlarmeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;
  
  const { tipoAlarmes } = useSelector(state => state.tipoAlarmes);
  const { alarme, loading, error, success } = useSelector(state => state.alarmes);
  
  const [loadingAlarme, setLoadingAlarme] = useState(isEditMode);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [novoTipoAlarme, setNovoTipoAlarme] = useState('');
  const [showNovoTipo, setShowNovoTipo] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const tipoAlarmeId = watch('tipo_alarme_id');

  // Carregar tipos de alarme
  useEffect(() => {
    dispatch(fetchTipoAlarmes());
  }, [dispatch]);

  // Carregar dados do alarme para edição
  useEffect(() => {
    if (isEditMode) {
      setLoadingAlarme(true);
      
      dispatch(fetchAlarme(id))
        .unwrap()
        .then(alarme => {
          // Preencher formulário com dados existentes
          setValue('tipo', alarme.tipo);
          setValue('tipo_alarme_id', alarme.tipo_alarme_id ? alarme.tipo_alarme_id.toString() : '');
          setValue('criticidade', alarme.criticidade !== undefined ? alarme.criticidade.toString() : '1');
          setValue('status', alarme.status !== undefined ? alarme.status.toString() : '1');
          setValue('ativo', parseInt(alarme.ativo) === 1);
          
          // Formatar data para o input datetime-local
          if (alarme.data_ocorrencia) {
            const dataOcorrencia = new Date(alarme.data_ocorrencia);
            setValue('data_ocorrencia', formatDateTimeForInput(dataOcorrencia));
          }
          
          setLoadingAlarme(false);
        })
        .catch(err => {
          console.error('Erro ao carregar alarme:', err);
          setLocalError('Não foi possível carregar os dados do alarme.');
          setLoadingAlarme(false);
        });
    }
  }, [id, isEditMode, setValue, dispatch]);

  // Função para formatar data/hora para o input datetime-local
  const formatDateTimeForInput = (date) => {
    const isoString = date.toISOString();
    return isoString.substring(0, 16); // Formato: YYYY-MM-DDTHH:MM
  };

  const onSubmit = async (data) => {
    setLocalError(null);
    setLocalSuccess(false);
    
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
        criticidade: parseInt(data.criticidade, 10),
        status: parseInt(data.status, 10)
      };
      
      // Adicionar data_ocorrencia apenas em modo de criação
      if (!isEditMode) {
        formData.data_ocorrencia = dataOcorrencia;
      } else {
        // No modo de edição, remover o campo data_ocorrencia para evitar erros de validação
        delete formData.data_ocorrencia;
      }
      
      // Adicionar novo tipo de alarme se necessário
      if (showNovoTipo && novoTipoAlarme) {
        formData.novo_tipo_alarme = novoTipoAlarme;
        delete formData.tipo_alarme_id;
      }
      
      if (isEditMode) {
        await dispatch(updateAlarme({ id, data: formData })).unwrap();
        setLocalSuccess('Alarme atualizado com sucesso!');
      } else {
        await dispatch(createAlarme(formData)).unwrap();
        setLocalSuccess('Alarme criado com sucesso!');
        reset(); // Limpar formulário após criação
      }
      
      // Redirecionar após sucesso (com timeout para exibir mensagem)
      setTimeout(() => {
        navigate('/alarmes');
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao salvar alarme:', err);
      setLocalError(typeof err === 'string' ? err : 'Ocorreu um erro ao salvar o alarme. Tente novamente.');
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
      
      {(localError || error) && (
        <div className="alert alert-error" role="alert">
          <p>{localError || error}</p>
        </div>
      )}
      
      {(localSuccess || success) && (
        <div className="alert alert-success" role="alert">
          <p>{localSuccess || success}</p>
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
            
            {!showNovoTipo ? (
              <>
                <select
                  id="tipo_alarme_id"
                  {...register('tipo_alarme_id', { required: !showNovoTipo && 'Tipo de alarme é obrigatório' })}
                  className="form-input"
                  onChange={(e) => {
                    if (e.target.value === "novo") {
                      setShowNovoTipo(true);
                    }
                  }}
                >
                  <option value="">Selecione um tipo</option>
                  {tipoAlarmes && tipoAlarmes.length > 0 && tipoAlarmes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                  <option value="novo">+ Criar novo tipo</option>
                </select>
                {errors.tipo_alarme_id && (
                  <span className="form-error">{errors.tipo_alarme_id.message}</span>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  className="form-input"
                  value={novoTipoAlarme}
                  onChange={(e) => setNovoTipoAlarme(e.target.value)}
                  placeholder="Digite o nome do novo tipo de alarme"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => {
                      setShowNovoTipo(false);
                      setValue('tipo_alarme_id', tipoAlarmeId || '');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
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
              {Object.entries(CRITICIDADE_ALARME).map(([value, label]) => (
                <option key={value} value={value}>
                  {label} ({value})
                </option>
              ))}
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
              {Object.entries(STATUS_ALARME).map(([value, label]) => (
                <option key={value} value={value}>
                  {label} ({value})
                </option>
              ))}
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
              Ativo ({ATIVO_STATUS['1']})
            </label>
            <p className="ml-4 text-sm text-gray-500">
              (Se desmarcado, será {ATIVO_STATUS['0']})
            </p>
          </div>
          
          <div>
            <label htmlFor="data_ocorrencia" className="form-label">
              Data e Hora de Ocorrência*
            </label>
            <input
              id="data_ocorrencia"
              type="datetime-local"
              {...register('data_ocorrencia', { required: !isEditMode && 'Data e hora de ocorrência são obrigatórias' })}
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