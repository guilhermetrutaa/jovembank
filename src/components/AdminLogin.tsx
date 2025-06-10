import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { verifyAdmin } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValid = await verifyAdmin(id, password);
      if (isValid) {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao verificar credenciais');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Área Administrativa</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">JovemBank - Controle de Contribuições</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                ID do Administrador
              </label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Digite seu ID"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 text-sm"
            >
              Acessar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
