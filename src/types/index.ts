export interface Installment {
  id: number;
  amount: number;
  date: string; // ISO date string
  paid?: boolean;
}