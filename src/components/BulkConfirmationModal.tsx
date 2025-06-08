import React, { useState } from 'react';
import { CheckCircle, MessageCircle, X, Copy, QrCode, Check } from 'lucide-react';
import { Installment } from '../types';
import { formatCurrency } from '../utils/installments';
import { getParishContact, generateBulkWhatsAppMessage, createWhatsAppUrl } from '../utils/parish';

interface BulkConfirmationModalProps {
  installments: Installment[];
  user: { name: string; parish: string };
  onClose: () => void;
  onConfirmed: () => void;
}

const BulkConfirmationModal: React.FC<BulkConfirmationModalProps> = ({
  installments,
  user,
  onClose,
  onConfirmed
}) => {
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [copied, setCopied] = useState(false);
  
  const parishContact = getParishContact(user.parish);
  const pixKey = "jovembankpscj01@gmail.com";
  const qrCodeUrl = "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop";
  
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const installmentNumbers = installments.map(inst => inst.id).sort((a, b) => a - b);

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar chave PIX:', err);
    }
  };

  const handleConfirmPayment = () => {
    setStep('confirmation');
  };

  const handleSendProof = () => {
    const message = generateBulkWhatsAppMessage(
      user.name,
      parishContact.communityName,
      installmentNumbers
    );
    
    const whatsappUrl = createWhatsAppUrl(parishContact.whatsappNumber, message);
    window.open(whatsappUrl, '_blank');
    onConfirmed();
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                Seu pagamento de {installments.length} parcelas foi confirmado com sucesso.
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-green-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-green-800 mb-2">Detalhes do Pagamento</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p><span className="font-medium">Parcelas:</span> {installmentNumbers.join(', ')}</p>
                <p><span className="font-medium">Quantidade:</span> {installments.length} parcelas</p>
                <p><span className="font-medium">Valor Total:</span> {formatCurrency(totalAmount)}</p>
                <p><span className="font-medium">Paróquia:</span> {parishContact.communityName}</p>
              </div>
            </div>

            {/* WhatsApp Message Preview */}
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-medium text-blue-800 mb-2">Mensagem que será enviada:</h4>
              <p className="text-sm text-blue-700 italic">
                "{generateBulkWhatsAppMessage(user.name, parishContact.communityName, installmentNumbers)}"
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
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Pagamento em Lote via PIX</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Installments Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Detalhes do Pagamento</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Parcelas:</span> {installmentNumbers.join(', ')}</p>
              <p><span className="font-medium">Quantidade:</span> {installments.length} parcelas</p>
              <p><span className="font-medium">Valor Total:</span> {formatCurrency(totalAmount)}</p>
              <p><span className="font-medium">Paróquia:</span> {user.parish}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 mb-4">Escaneie o QR Code</h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
              <img
                src={qrCodeUrl}
                alt="QR Code PIX"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* PIX Key */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Ou copie a chave PIX:</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={pixKey}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={handleCopyPixKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Instruções:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Escolha a opção PIX</li>
              <li>Escaneie o QR Code ou cole a chave PIX</li>
              <li>Confirme o pagamento de {formatCurrency(totalAmount)}</li>
              <li>Clique em "Confirmar Pagamento" abaixo</li>
            </ol>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkConfirmationModal;