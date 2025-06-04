import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, CalendarIcon, BanknoteIcon } from 'lucide-react';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { useInstallments } from '../context/InstallmentContext';
import { Installment } from '../types';

interface InstallmentCardProps {
  installment: Installment;
}

const InstallmentCard: React.FC<InstallmentCardProps> = ({ installment }) => {
  const { 
    setSelectedInstallment, 
    isAvailable, 
    isPaid,
    selectedInstallment 
  } = useInstallments();
  
  const available = isAvailable(installment);
  const paid = isPaid(installment);
  const isSelected = selectedInstallment?.id === installment.id;
  
  const handleClick = () => {
    if (available && !paid) {
      setSelectedInstallment(installment);
    }
  };
  
  // Determine card class based on status
  let cardClass = 'installment-card';
  if (paid) {
    cardClass += ' installment-card-paid';
  } else if (available) {
    cardClass += ' installment-card-active';
  } else {
    cardClass += ' installment-card-inactive';
  }
  
  if (isSelected) {
    cardClass += ' border-2 border-primary-500 shadow-card-hover';
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className={cardClass}
      onClick={handleClick}
      variants={item}
      whileHover={available && !paid ? { scale: 1.02 } : {}}
      whileTap={available && !paid ? { scale: 0.98 } : {}}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          Parcela {installment.id}
        </span>
        
        {paid ? (
          <span className="flex items-center text-xs font-medium text-success-700 bg-success-100 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </span>
        ) : available ? (
          <span className="flex items-center text-xs font-medium text-primary-700 bg-primary-100 px-2 py-1 rounded-full animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Disponível
          </span>
        ) : (
          <span className="flex items-center text-xs font-medium text-slate-600 bg-slate-200 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            Aguardando
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-2 rounded-full">
          <BanknoteIcon className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800">
            {formatCurrency(installment.amount)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-slate-600">
        <CalendarIcon className="h-4 w-4 mr-1" />
        <span>{formatMonthYear(installment.date)}</span>
      </div>
    </motion.div>
  );
};

export default InstallmentCard;