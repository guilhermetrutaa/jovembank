import React, { useState, useEffect } from 'react';
import { LogOut, Filter, User, Church, CheckCircle, Trash2 } from 'lucide-react';
import { getPaymentReport, deleteUser } from '../utils/firebase-db';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [report, setReport] = useState<any[]>([]);
  const [filteredReport, setFilteredReport] = useState<any[]>([]);
  const [selectedParish, setSelectedParish] = useState<string>('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        const data = await getPaymentReport();
        setReport(data);
        setFilteredReport(data);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  useEffect(() => {
    if (selectedParish === 'Todas') {
      setFilteredReport(report);
    } else {
      setFilteredReport(report.filter(item => item.parish === selectedParish));
    }
  }, [selectedParish, report]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const handleDelete = async (userName: string, parish: string) => {
    const ok = window.confirm(
      `Tem certeza que deseja excluir ${userName} da comunidade ${parish}? Essa ação é permanente.`
    );
    if (!ok) return;

    try {
      setIsLoading(true);
      await deleteUser(userName, parish);
      const refreshed = await getPaymentReport();
      setReport(refreshed);
      setSelectedParish('Todas');
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      alert('Erro ao excluir. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const parishes = ['Todas', 'Sagrado', 'Lourdes', 'São Vicente'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Carregando relatório...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">Relatório de Contribuições</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Filtros</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedParish}
                onChange={(e) => setSelectedParish(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {parishes.map(parish => (
                  <option key={parish} value={parish}>{parish}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    <Church className="w-4 h-4 inline mr-2" />
                    Comunidade
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Parcelas Pagas
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Último Pagamento
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReport.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                      {item.userName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {item.parish}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.totalPaid === 14 
                          ? 'bg-green-100 text-green-800' 
                          : item.totalPaid > 10 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.totalPaid}/15
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {item.lastPayment}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        title="Excluir usuário"
                        onClick={() => handleDelete(item.userName, item.parish)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredReport.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
