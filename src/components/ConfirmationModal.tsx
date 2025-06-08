import React from 'react';
import { CheckCircle, MessageCircle, X } from 'lucide-react';
import { Installment } from '../types';
import { formatCurrency } from '../utils/installments';
import { getParishContact, generateWhatsAppMessage, createWhatsAppUrl } from '../utils/parish';

interface ConfirmationModalProps {
  installment: Installment;
  user: { name: string; parish: string };
  onClose: () => void;
  onConfirmed: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  installment,
  user,
  onClose,
  onConfirmed
}) => {
  const parishContact = getParishContact(user.parish);
  
  const handleSendProof = () => {
    const message = generateWhatsAppMessage(
      user.name,
      parishContact.communityName,
      installment.id
    );
    
    const whatsappUrl = createWhatsAppUrl(parishContact.whatsappNumber, message);
    window.open(whatsappUrl, '_blank');
    onConfirmed();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Pagamento Confirmado!</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">Obrigado!</h3>
            <p className="text-gray-600">
              Seu pagamento da parcela {installment.id} foi confirmado com sucesso.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-green-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-green-800 mb-2">Detalhes do Pagamento</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p><span className="font-medium">Parcela:</span> {installment.id} de 15</p>
              <p><span className="font-medium">Valor:</span> {formatCurrency(installment.amount)}</p>
              <p><span className="font-medium">Mês:</span> {installment.month} {installment.year}</p>
              <p><span className="font-medium">Paróquia:</span> {parishContact.communityName}</p>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-blue-800 mb-2">Mensagem que será enviada:</h4>
            <p className="text-sm text-blue-700 italic">
              "{generateWhatsAppMessage(user.name, parishContact.communityName, installment.id)}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSendProof}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Comprovante via WhatsApp</span>
            </button>
            
            <button
              onClick={onConfirmed}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Pular e Finalizar
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Você será redirecionado para o WhatsApp da paróquia {parishContact.communityName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;