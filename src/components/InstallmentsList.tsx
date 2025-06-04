import React from 'react';
import { motion } from 'framer-motion';
import InstallmentCard from './InstallmentCard';
import PaymentDetails from './PaymentDetails';
import { useInstallments } from '../context/InstallmentContext';

const InstallmentsList: React.FC = () => {
  const { installments, selectedInstallment } = useInstallments();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-3">
          Parcelas do Crisma
        </h2>
        <p className="text-slate-600 mb-2">
          São 15 parcelas de R$ 15,00 que podem ser pagas mensalmente para facilitar o pagamento da taxa do Crisma.
        </p>
        <p className="text-sm text-slate-500">
          As parcelas são liberadas de acordo com o mês correspondente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {installments.map((installment) => (
              <InstallmentCard 
                key={installment.id} 
                installment={installment} 
              />
            ))}
          </motion.div>
        </div>
        
        <div className="order-1 md:order-2">
          {selectedInstallment ? (
            <PaymentDetails installment={selectedInstallment} />
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200 h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4 w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <BankNoteIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Selecione uma parcela</h3>
              <p className="text-slate-600 max-w-xs">
                Clique em uma parcela disponível para visualizar as opções de pagamento via Pix.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Bank note icon component
const BankNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export default InstallmentsList;