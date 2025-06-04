import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const RegistrationScreen: React.FC = () => {
  const { setUserData } = useUser();
  const [name, setName] = useState('');
  const [community, setCommunity] = useState<'Santuário' | 'Lourdes' | 'São Vicente' | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }
    
    if (!community) {
      setError('Por favor, selecione sua comunidade');
      return;
    }
    
    setUserData({ name: name.trim(), community });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-card p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-primary-800 mb-6 text-center">
            Bem-vindo ao JovemBank
          </h2>
          
          <p className="text-slate-600 mb-8 text-center">
            Por favor, preencha seus dados para continuar
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Digite seu nome completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sua Comunidade
              </label>
              <div className="space-y-2">
                {['Santuário', 'Lourdes', 'São Vicente'].map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="community"
                      value={option}
                      checked={community === option}
                      onChange={(e) => setCommunity(e.target.value as typeof community)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-slate-900">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Continuar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen; 