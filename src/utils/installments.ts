import { Installment } from '../types';

export const generateInstallments = (): Installment[] => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const startMonth = 3; // Abril (0-indexed)
  const startYear = 2025;

  const totalInstallments = 14;
  const installments: Installment[] = [];

  for (let i = 0; i < totalInstallments; i++) {
    const monthIndex = (startMonth + i) % 12;
    const year = startYear + Math.floor((startMonth + i) / 12);

    installments.push({
      id: i + 1,
      month: months[monthIndex],
      year,
      amount: i === totalInstallments - 1 ? 30 : 15, // Última parcela é R$ 30
      paid: false
    });
  }

  return installments;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};
