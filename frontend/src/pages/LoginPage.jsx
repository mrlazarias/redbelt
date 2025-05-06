import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error('Erro de login:', err);
      setLoginError(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        {loginError && (
          <div className="alert alert-error" role="alert">
            <p>{loginError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              className="form-input"
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Senha é obrigatória' })}
              className="form-input"
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full flex justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Entrar
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 