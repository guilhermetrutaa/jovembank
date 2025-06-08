import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, DollarSign, CreditCard, Package, Wallet, Church } from 'lucide-react';
import { Installment } from '../types';
import { generateInstallments, formatCurrency } from '../utils/installments';
import PaymentModal from './PaymentModal';
import BulkPaymentModal from './BulkPaymentModal';
import CrismaImg from './Crisma.png';
import { getPayments, savePayment, updatePayments } from '../utils/api';

interface DashboardProps {
  user: { name: string; parish: string };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [showBulkPayment, setShowBulkPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInstallments = async () => {
      setIsLoading(true);
      try {
        // Gera as parcelas iniciais
        const generatedInstallments = generateInstallments();
        
        // Busca pagamentos existentes na API
        const existingPayments = await getPayments();
        const userPayments = existingPayments.filter(
          (p: any) => p.userName === user.name && p.parish === user.parish
        );
        
        // Atualiza as parcelas com os dados da API
        const updatedInstallments = generatedInstallments.map(inst => {
          const payment = userPayments.find((p: any) => p.installmentId === inst.id);
          return payment ? { 
            ...inst, 
            paid: payment.paid, 
            paymentDate: payment.paymentDate 
          } : inst;
        });
        
        setInstallments(updatedInstallments);
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        // Se houver erro, usa as parcelas geradas localmente
        setInstallments(generateInstallments());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInstallments();
  }, [user.name, user.parish]);

  const handlePaymentComplete = async (installmentId: number) => {
    const updatedInstallments = installments.map(inst => 
      inst.id === installmentId ? { 
        ...inst, 
        paid: true, 
        paymentDate: new Date().toISOString() 
      } : inst
    );
    
    try {
      // Salva o pagamento na API
      await savePayment({
        userId: `${user.name}-${user.parish}`,
        userName: user.name,
        parish: user.parish,
        installmentId,
        month: updatedInstallments.find(i => i.id === installmentId)!.month,
        year: updatedInstallments.find(i => i.id === installmentId)!.year,
        amount: 15,
        paid: true,
        paymentDate: new Date().toISOString()
      });
      
      setInstallments(updatedInstallments);
      setSelectedInstallment(null);
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      alert('Erro ao registrar pagamento. Tente novamente.');
    }
  };

  const handleBulkPaymentComplete = async (installmentIds: number[]) => {
    const updatedInstallments = installments.map(inst => 
      installmentIds.includes(inst.id) ? { 
        ...inst, 
        paid: true, 
        paymentDate: new Date().toISOString() 
      } : inst
    );
    
    try {
      // Prepara os pagamentos para salvar
      const paymentsToSave = updatedInstallments
        .filter(inst => installmentIds.includes(inst.id))
        .map(inst => ({
          userId: `${user.name}-${user.parish}`,
          userName: user.name,
          parish: user.parish,
          installmentId: inst.id,
          month: inst.month,
          year: inst.year,
          amount: 15,
          paid: true,
          paymentDate: new Date().toISOString()
        }));
      
      // Obtém os pagamentos existentes
      const existingPayments = await getPayments();
      
      // Remove possíveis duplicatas para este usuário
      const filteredPayments = existingPayments.filter(
        (p: any) => !(p.userName === user.name && p.parish === user.parish && installmentIds.includes(p.installmentId))
      );
      
      // Combina os pagamentos
      const allPayments = [...filteredPayments, ...paymentsToSave];
      
      // Atualiza no banco de dados
      await updatePayments(allPayments);
      
      setInstallments(updatedInstallments);
      setShowBulkPayment(false);
    } catch (error) {
      console.error('Erro ao salvar pagamentos em lote:', error);
      alert('Erro ao registrar pagamentos. Tente novamente.');
    }
  };

  const paidCount = installments.filter(inst => inst.paid).length;
  const unpaidCount = installments.filter(inst => !inst.paid).length;
  const totalPaid = paidCount * 15;
  const totalRemaining = unpaidCount * 15;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <p>Carregando seus pagamentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-16 h-16">
                <img src={CrismaImg} alt="Logo Crisma" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">JovemBank</h1>
                <p className="text-sm text-gray-600">Olá, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Parcelas Pagas</p>
                <p className="text-3xl font-bold text-green-600">{paidCount}/15</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pago</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restante</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(totalRemaining)}</p>
              </div>
              <Wallet className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paróquia</p>
                <p className="text-xl font-bold text-gray-800">{user.parish}</p>
              </div>
              <Church className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Bulk Payment Actions */}
        {unpaidCount > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pagamentos em Lote</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowBulkPayment(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Package className="w-5 h-5" />
                <span>Escolher Parcelas</span>
              </button>
              
              <button
                onClick={() => {
                  const unpaidInstallments = installments.filter(inst => !inst.paid);
                  if (unpaidInstallments.length > 0) {
                    setShowBulkPayment(true);
                  }
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pagar Todas ({unpaidCount} parcelas - {formatCurrency(totalRemaining)})</span>
              </button>
            </div>
          </div>
        )}

        {/* Installments Grid */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Minhas Contribuições</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {installments.map((installment) => (
              <div
                key={installment.id}
                onClick={() => !installment.paid && setSelectedInstallment(installment)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${installment.paid 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105'
                  }
                `}
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Parcela {installment.id}</p>
                  <p className="text-lg font-bold">{installment.month}</p>
                  <p className="text-sm text-gray-500">{installment.year}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    {formatCurrency(installment.amount)}
                  </p>
                  {installment.paid && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Pago
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInstallment && (
        <PaymentModal
          installment={selectedInstallment}
          user={user}
          onClose={() => setSelectedInstallment(null)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Bulk Payment Modal */}
      {showBulkPayment && (
        <BulkPaymentModal
          installments={installments}
          user={user}
          onClose={() => setShowBulkPayment(false)}
          onPaymentComplete={handleBulkPaymentComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;