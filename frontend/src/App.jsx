import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AlarmesList from './pages/AlarmesList';
import AlarmeForm from './pages/AlarmeForm';
import TipoAlarmesList from './pages/TipoAlarmesList';
import TipoAlarmeForm from './pages/TipoAlarmeForm';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Verificar autenticação ao iniciar a aplicação
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/alarmes" element={<ProtectedRoute><AlarmesList /></ProtectedRoute>} />
            <Route path="/alarmes/novo" element={<ProtectedRoute><AlarmeForm /></ProtectedRoute>} />
            <Route path="/alarmes/:id/editar" element={<ProtectedRoute><AlarmeForm /></ProtectedRoute>} />
            <Route path="/tipo-alarmes" element={<ProtectedRoute><TipoAlarmesList /></ProtectedRoute>} />
            <Route path="/tipo-alarmes/novo" element={<ProtectedRoute><TipoAlarmeForm /></ProtectedRoute>} />
            <Route path="/tipo-alarmes/:id/editar" element={<ProtectedRoute><TipoAlarmeForm /></ProtectedRoute>} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
