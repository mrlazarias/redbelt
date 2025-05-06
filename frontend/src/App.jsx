import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';

// Componentes de layout
import Layout from './components/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AlarmesList from './pages/AlarmesList';
import AlarmeForm from './pages/AlarmeForm';
import TipoAlarmesList from './pages/TipoAlarmesList';
import TipoAlarmeForm from './pages/TipoAlarmeForm';
import NotFound from './pages/NotFound';

// Componente de rota protegida
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Aplicar classe dark ao HTML para que o Tailwind processe corretamente
  useEffect(() => {
    // Sempre aplicar o modo escuro
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-mode');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rotas protegidas com layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/alarmes" element={<ProtectedRoute element={<AlarmesList />} />} />
            <Route path="/alarmes/novo" element={<ProtectedRoute element={<AlarmeForm />} />} />
            <Route path="/alarmes/:id/editar" element={<ProtectedRoute element={<AlarmeForm />} />} />
            <Route path="/tipos-alarme" element={<ProtectedRoute element={<TipoAlarmesList />} />} />
            <Route path="/tipos-alarme/novo" element={<ProtectedRoute element={<TipoAlarmeForm />} />} />
            <Route path="/tipos-alarme/:id/editar" element={<ProtectedRoute element={<TipoAlarmeForm />} />} />
          </Route>
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
