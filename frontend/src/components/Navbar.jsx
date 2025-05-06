import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">Sistema de Alarmes</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/alarmes" className="hover:text-blue-200">Alarmes</Link>
                <Link to="/tipo-alarmes" className="hover:text-blue-200">Tipos de Alarme</Link>
                <div className="relative ml-3">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-sm font-medium hover:text-blue-200 focus:outline-none"
                  >
                    <span>{user?.name}</span>
                    <svg className="ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-20">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Cadastro</Link>
              </>
            )}
          </div>
          
          {/* Menu para dispositivos móveis */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-16 right-0 left-0 bg-blue-600 shadow-md z-20">
                {isAuthenticated ? (
                  <div className="flex flex-col p-2">
                    <Link to="/" className="px-4 py-2 hover:bg-blue-700">Dashboard</Link>
                    <Link to="/alarmes" className="px-4 py-2 hover:bg-blue-700">Alarmes</Link>
                    <Link to="/tipo-alarmes" className="px-4 py-2 hover:bg-blue-700">Tipos de Alarme</Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-4 py-2 hover:bg-blue-700"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col p-2">
                    <Link to="/login" className="px-4 py-2 hover:bg-blue-700">Login</Link>
                    <Link to="/register" className="px-4 py-2 hover:bg-blue-700">Cadastro</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 