import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateInstallments } from '../utils/installmentUtils';
import { Installment } from '../types';

interface InstallmentContextType {
  installments: Installment[];
  selectedInstallment: Installment | null;
  setSelectedInstallment: (installment: Installment | null) => void;
  isAvailable: (installment: Installment) => boolean;
  isPaid: (installment: Installment) => boolean;
  markAsPaid: (installmentId: number) => void;
  markAllAsPaid: () => void;
  totalAmount: number;
  unpaidAmount: number;
}

const InstallmentContext = createContext<InstallmentContextType | undefined>(undefined);

export const useInstallments = () => {
  const context = useContext(InstallmentContext);
  if (!context) {
    throw new Error('useInstallments must be used within an InstallmentProvider');
  }
  return context;
};

interface InstallmentProviderProps {
  children: React.ReactNode;
}

export const InstallmentProvider: React.FC<InstallmentProviderProps> = ({ children }) => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  
  // Load installments on mount
  useEffect(() => {
    const allInstallments = generateInstallments();
    
    // Try to load paid status from localStorage
    const savedPaidStatus = localStorage.getItem('paidInstallments');
    if (savedPaidStatus) {
      const paidIds = JSON.parse(savedPaidStatus) as number[];
      const updatedInstallments = allInstallments.map(installment => ({
        ...installment,
        paid: paidIds.includes(installment.id)
      }));
      setInstallments(updatedInstallments);
    } else {
      setInstallments(allInstallments);
    }
  }, []);
  
  // Check if an installment is available based on the current month
  const isAvailable = (installment: Installment): boolean => {
    const today = new Date();
    const installmentDate = new Date(installment.date);
    
    // Available if it's the current month and year or in the past
    return (
      (today.getFullYear() > installmentDate.getFullYear()) ||
      (today.getFullYear() === installmentDate.getFullYear() && 
       today.getMonth() >= installmentDate.getMonth())
    ) && !installment.paid;
  };
  
  // Check if an installment is paid
  const isPaid = (installment: Installment): boolean => {
    return !!installment.paid;
  };
  
  // Mark an installment as paid
  const markAsPaid = (installmentId: number) => {
    const updatedInstallments = installments.map(installment => 
      installment.id === installmentId 
        ? { ...installment, paid: true } 
        : installment
    );
    
    setInstallments(updatedInstallments);
    
    // Save paid status to localStorage
    const paidIds = updatedInstallments
      .filter(installment => installment.paid)
      .map(installment => installment.id);
    
    localStorage.setItem('paidInstallments', JSON.stringify(paidIds));
    
    // Deselect if the paid installment was selected
    if (selectedInstallment?.id === installmentId) {
      setSelectedInstallment(null);
    }
  };

  // Mark all installments as paid
  const markAllAsPaid = () => {
    const updatedInstallments = installments.map(installment => ({
      ...installment,
      paid: true
    }));
    
    setInstallments(updatedInstallments);
    
    // Save paid status to localStorage
    const paidIds = updatedInstallments.map(installment => installment.id);
    localStorage.setItem('paidInstallments', JSON.stringify(paidIds));
    
    // Deselect any selected installment
    setSelectedInstallment(null);
  };

  // Calculate total amount
  const totalAmount = installments.reduce((sum, installment) => sum + installment.amount, 0);

  // Calculate unpaid amount
  const unpaidAmount = installments
    .filter(installment => !installment.paid)
    .reduce((sum, installment) => sum + installment.amount, 0);

  return (
    <InstallmentContext.Provider
      value={{
        installments,
        selectedInstallment,
        setSelectedInstallment,
        isAvailable,
        isPaid,
        markAsPaid,
        markAllAsPaid,
        totalAmount,
        unpaidAmount
      }}
    >
      {children}
    </InstallmentContext.Provider>
  );
};