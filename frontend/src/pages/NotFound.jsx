import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Página não encontrada</h2>
          <p className="text-gray-600">A página que você está procurando não existe ou foi removida.</p>
        </div>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 