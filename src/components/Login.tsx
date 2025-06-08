import React, { useState } from 'react';
import { LogIn, MapPin, User as UserIcon } from 'lucide-react';
import CrismaImg from './Crisma.png';
import { addUser } from '../utils/api'; // 👈 Importa a função da API

interface LoginProps {
  onLogin: (user: { name: string; parish: 'Sagrado' | 'Lourdes' | 'São Vicente' }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [parish, setParish] = useState<'Sagrado' | 'Lourdes' | 'São Vicente'>('Sagrado');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user = { name: name.trim(), parish };

      try {
        await addUser(user); // 👈 Salva o usuário na API
        onLogin(user);        // 👈 Depois continua com o login
      } catch (error) {
        alert('Erro ao salvar usuário. Tente novamente.');
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16">
              <img src={CrismaImg} alt="Logo Crisma" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">JovemBank</h1>
            <p className="text-gray-600 mt-2">Sistema de Contribuições Jovens</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="parish" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Paróquia
              </label>
              <select
                id="parish"
                value={parish}
                onChange={(e) => setParish(e.target.value as 'Sagrado' | 'Lourdes' | 'São Vicente')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
              >
                <option value="Sagrado">Sagrado Coração de Jesus</option>
                <option value="Lourdes">Nossa Senhora de Lourdes</option>
                <option value="São Vicente">São Vicente de Paulo</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Faça sua contribuição mensal de forma fácil e segura</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
