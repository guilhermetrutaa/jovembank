import { Installment } from '../types';

// Generate all 15 installments with proper dates
export const generateInstallments = (): Installment[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  
  // Calculate starting month - if we're past October, start from January next year
  let startYear = currentYear;
  let startMonth = currentMonth - 2; // Start 2 months ago to have some available payments
  
  if (startMonth < 0) {
    startMonth = 12 + startMonth;
    startYear--;
  }
  
  const installments: Installment[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const month = (startMonth + i - 1) % 12;
    const year = startYear + Math.floor((startMonth + i - 1) / 12);
    
    // Create a date for the 1st of the month
    const date = new Date(year, month, 1);
    
    installments.push({
      id: i,
      amount: 15.0,
      date: date.toISOString(),
      paid: false
    });
  }
  
  return installments;
};