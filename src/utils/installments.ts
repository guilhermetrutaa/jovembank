import { Installment } from '../types';

/**
 * Gera as parcelas:
 *   • 13 parcelas de R$ 15,00 (Abr/2025 → Abr/2026)
 *   • 1 parcela de R$ 30,00  (Mai/2026)
 * Total: R$ 225,00
 */
export const generateInstallments = (): Installment[] => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const startMonth = 3; // 0‑index: 3 = Abril
  const startYear  = 2025;
  const totalInstallments = 14;

  const installments: Installment[] = [];

  for (let i = 0; i < totalInstallments; i++) {
    const monthIndex = (startMonth + i) % 12;
    const year       = startYear + Math.floor((startMonth + i) / 12);

    const isMay2026  = year === 2026 && monthIndex === 4; // Maio = 4
    const amount     = isMay2026 ? 30 : 15;

    installments.push({
      id: i + 1,
      month: months[monthIndex],
      year,
      amount,
      paid: false
    });
  }

  return installments;
};

/** Soma o que ainda falta pagar (parcelas com paid === false) */
export const getRemainingAmount = (installments: Installment[]): number =>
  installments
    .filter(inst => !inst.paid)
    .reduce((sum, inst) => sum + inst.amount, 0);

/** Formatação monetária (pt‑BR / BRL) */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
