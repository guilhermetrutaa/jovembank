export interface User {
  name: string;
  parish: 'Sagrado' | 'Lourdes' | 'São Vicente';
}

export interface Installment {
  id: number;
  month: string;
  year: number;
  amount: number;
  paid: boolean;
}

export interface PaymentModalData {
  installment: Installment;
  pixKey: string;
  qrCodeUrl: string;
}

export interface ParishContact {
  whatsappNumber: string;
  communityName: string;
}