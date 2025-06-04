import React, { useState } from 'react';
import { Copy, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { useInstallments } from '../context/InstallmentContext';
import { useUser } from '../context/UserContext';
import { Installment } from '../types';
import { getPixKey } from '../utils/pixUtils';

interface PaymentDetailsProps {
  installment: Installment;
}

const WHATSAPP_NUMBERS = {
  'Santuário': '5561999999999',
  'Lourdes': '5561888888888',
  'São Vicente': '5561777777777'
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ installment }) => {
  const [copied, setCopied] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paidAll, setPaidAll] = useState(false);
  const { markAsPaid, markAllAsPaid, unpaidAmount } = useInstallments();
  const { userData } = useUser();
  
  const pixKey = getPixKey();
  
  const handleCopyClick = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleConfirmPayment = (payAll: boolean = false) => {
    setPaidAll(payAll);
    setShowPaymentSuccess(true);
    setTimeout(() => {
      if (payAll) {
        markAllAsPaid();
      } else {
        markAsPaid(installment.id);
      }
      setShowPaymentSuccess(false);
    }, 10000);
  };

  const handleWhatsAppRedirect = () => {
    if (!userData?.community) return;
    
    const phoneNumber = WHATSAPP_NUMBERS[userData.community];
    const message = encodeURIComponent(
      paidAll 
        ? `Meu nome é *${userData.name}* sou da comunidade *${userData.community}* e paguei *todas as parcelas* do Crisma`
        : `Meu nome é *${userData.name}* sou da comunidade *${userData.community}* e paguei a parcela *${installment.id}*`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  
  return (
    <AnimatePresence mode="wait">
      {showPaymentSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-success-50 rounded-xl p-6 shadow-card border border-success-200 h-full flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-success-600" />
          </div>
          <h3 className="text-xl font-semibold text-success-800 mb-2">Pagamento Confirmado!</h3>
          <p className="text-success-700 max-w-xs mb-6">
            Obrigado por sua contribuição. Sua parcela foi marcada como paga.
          </p>
          <button
            onClick={handleWhatsAppRedirect}
            className="btn-primary flex items-center justify-center gap-2"
          >
            Enviar Comprovante
            <MessageCircle className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-xl p-6 shadow-card border border-slate-200"
        >
          <h3 className="text-xl font-semibold text-primary-800 mb-4">Detalhes do Pagamento</h3>
          
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Parcela:</span>
                <span className="font-medium">Nº {installment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mês:</span>
                <span className="font-medium">{formatMonthYear(installment.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valor:</span>
                <span className="font-semibold text-primary-800">{formatCurrency(installment.amount)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="text-primary-800 font-medium mb-2">Pagar todas as parcelas</h4>
            <p className="text-sm text-primary-600 mb-3">
              Você pode pagar todas as parcelas restantes de uma vez:
            </p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary-800">{formatCurrency(unpaidAmount)}</span>
              <button
                onClick={() => handleConfirmPayment(true)}
                className="btn-primary text-sm"
              >
                Pagar Tudo
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col items-center">
            <p className="text-sm text-slate-600 mb-4 text-center">
              Escaneie o QR Code abaixo para pagar via Pix
            </p>
            <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
              <img 
                src="https://media.discordapp.net/attachments/1230318254271234051/1379870559239798874/qrcode.png?ex=6841d01a&is=68407e9a&hm=ac20ba925590a687a60616eb988b855d3500eb2250d95ff54847e8a78acd3e3c&=&format=webp&quality=lossless&width=741&height=740" 
                alt="QR Code Pix"
                className="w-[180px] h-[180px]"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">
              Ou copie a chave Pix:
            </p>
            <div className="flex items-center">
              <input 
                type="text"
                value={pixKey}
                readOnly
                className="flex-grow px-3 py-2 border border-slate-300 rounded-l-lg text-sm bg-slate-50 focus:outline-none"
              />
              <button 
                onClick={handleCopyClick}
                className="bg-primary-600 text-white px-3 py-2 rounded-r-lg hover:bg-primary-700 transition-colors"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col">
            <p className="text-sm text-slate-600 mb-2 text-center">
              Após realizar o pagamento:
            </p>
            <button
              onClick={() => handleConfirmPayment(false)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Confirmar Pagamento
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentDetails;