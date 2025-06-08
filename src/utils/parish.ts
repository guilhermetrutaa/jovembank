import { ParishContact } from '../types';

export const getParishContact = (parish: string): ParishContact => {
  const contacts: Record<string, ParishContact> = {
    'Sagrado': {
      whatsappNumber: '558386273348',
      communityName: 'Sagrado Coração'
    },
    'Lourdes': {
      whatsappNumber: '558388046410',
      communityName: 'Nossa Senhora de Lourdes'
    },
    'São Vicente': {
      whatsappNumber: '558386864612',
      communityName: 'São Vicente de Paulo'
    }
  };
  
  return contacts[parish] || contacts['Sagrado'];
};

export const generateWhatsAppMessage = (
  userName: string,
  communityName: string,
  installmentNumber: number
): string => {
  return `Meu nome é ${userName} e sou da comunidade ${communityName} e estou pagando a parcela ${installmentNumber}.`;
};

export const generateBulkWhatsAppMessage = (
  userName: string,
  communityName: string,
  installmentNumbers: number[]
): string => {
  const installmentList = installmentNumbers.length > 1 
    ? `as parcelas ${installmentNumbers.join(', ')}`
    : `a parcela ${installmentNumbers[0]}`;
    
  return `Meu nome é ${userName} e sou da comunidade ${communityName} e estou pagando ${installmentList}.`;
};

export const createWhatsAppUrl = (phoneNumber: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};