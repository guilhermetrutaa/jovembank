import React, { useState } from 'react';
import { X, Package, CreditCard, Check } from 'lucide-react';
import { Installment } from '../types';
import { formatCurrency } from '../utils/installments';
import BulkConfirmationModal from './BulkConfirmationModal';

interface BulkPaymentModalProps {
  installments: Installment[];
  user: { name: string; parish: string };
  onClose: () => void;
  onPaymentComplete: (installmentIds: number[]) => void;
}

const BulkPaymentModal: React.FC<BulkPaymentModalProps> = ({
  installments,
  user,
  onClose,
  onPaymentComplete
}) => {
  const unpaidInstallments = installments.filter(inst => !inst.paid);
  const [selectedInstallments, setSelectedInstallments] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectAll = () => {
    if (selectedInstallments.length === unpaidInstallments.length) {
      setSelectedInstallments([]);
    } else {
      setSelectedInstallments(unpaidInstallments.map(inst => inst.id));
    }
  };

  const handleToggleInstallment = (installmentId: number) => {
    setSelectedInstallments(prev => {
      if (prev.includes(installmentId)) {
        return prev.filter(id => id !== installmentId);
      } else {
        return [...prev, installmentId];
      }
    });
  };

  const handleProceedToPayment = () => {
    if (selectedInstallments.length > 0) {
      setShowConfirmation(true);
    }
  };

  const handlePaymentConfirmed = () => {
    onPaymentComplete(selectedInstallments);
    setShowConfirmation(false);
    onClose();
  };

  const totalAmount = selectedInstallments.length * 15;
  const allSelected = selectedInstallments.length === unpaidInstallments.length;

  if (showConfirmation) {
    const selectedInstallmentData = installments.filter(inst => 
      selectedInstallments.includes(inst.id)
    );
    
    return (
      <BulkConfirmationModal
        installments={selectedInstallmentData}
        user={user}
        onClose={() => setShowConfirmation(false)}
        onConfirmed={handlePaymentConfirmed}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Pagamento em Lote</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          {/* Selection Controls */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Selecione as parcelas para pagamento:</h3>
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                <span>{allSelected ? 'Desmarcar Todas' : 'Selecionar Todas'}</span>
              </button>
            </div>
            
            {selectedInstallments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{selectedInstallments.length} parcelas selecionadas</span>
                  {' • '}
                  <span className="font-bold">Total: {formatCurrency(totalAmount)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Installments List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpaidInstallments.map((installment) => {
                const isSelected = selectedInstallments.includes(installment.id);
                
                return (
                  <div
                    key={installment.id}
                    onClick={() => handleToggleInstallment(installment.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-50 border-blue-300 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Parcela {installment.id}
                      </span>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">{installment.month}</p>
                      <p className="text-sm text-gray-500">{installment.year}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        {formatCurrency(installment.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleProceedToPayment}
                disabled={selectedInstallments.length === 0}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                  ${selectedInstallments.length > 0
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  Pagar {selectedInstallments.length > 0 && `${selectedInstallments.length} parcelas`}
                  {selectedInstallments.length > 0 && ` - ${formatCurrency(totalAmount)}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPaymentModal;