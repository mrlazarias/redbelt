import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Se não estiver autenticado, apenas renderizar children
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Verifica se a rota atual está ativa
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } fixed inset-y-0 left-0 z-30 bg-gray-800 text-white transition-all duration-300 transform md:translate-x-0 md:w-64 md:relative md:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 p-2 rounded-full">
                <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Sistema de Alarmes</span>
            </div>
            <button 
              className="md:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-200">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <div className="space-y-2">
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 ${isActive('/') 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-700'} rounded-md transition-colors`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              
              <Link 
                to="/alarmes" 
                className={`flex items-center px-4 py-2 ${isActive('/alarmes') 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-700'} rounded-md transition-colors`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Alarmes
              </Link>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-gray-700">
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar Toggle */}
      <div className="fixed inset-x-0 top-0 p-4 bg-gray-800 md:hidden z-20 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold">Sistema de Alarmes</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="text-gray-300 hover:text-white relative">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Badge for notifications */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-0 md:pt-0 overflow-hidden bg-gray-900">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-end px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-gray-300 hover:text-gray-100 relative">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Badge for notifications */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User Info */}
            <div className="relative ml-3">
              <button className="flex items-center text-sm focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="font-semibold text-gray-200">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-gray-200">{user?.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content container */}
        <main className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;