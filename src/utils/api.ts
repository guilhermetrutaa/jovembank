const BIN_ID = '6845a56b8561e97a5021108c';
const API_KEY = '$2a$10$gJuGd/Oa9ylOaw82pXR8B.7.feWfKQkAtdtrTG9gmaQIhCbJSQR1C';

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
  'X-Bin-Versioning': 'false'
};

// Função para obter todos os dados do bin
async function getBinData() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers,
    });
    
    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status}`);
    }
    
    const data = await res.json();
    return data.record || {}; // Retorna o registro completo
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {};
  }
}

// Funções para usuários
export async function getUsers(): Promise<any[]> {
  const data = await getBinData();
  return data.users || [];
}

export async function addUser(user: { name: string; parish: string }) {
  const data = await getBinData();
  const users = data.users || [];

  const exists = users.find(
    (u: any) =>
      u.name.toLowerCase().trim() === user.name.toLowerCase().trim() &&
      u.parish === user.parish
  );
  
  if (exists) return;

  const updatedUsers = [...users, user];
  const updatedData = { ...data, users: updatedUsers };
  
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedData),
  });
}

// Funções para pagamentos
export async function getPayments(): Promise<any[]> {
  const data = await getBinData();
  return data.payments || [];
}

export async function savePayment(payment: {
  userId: string;
  userName: string;
  parish: string;
  installmentId: number;
  month: string;
  year: number;
  amount: number;
  paid: boolean;
  paymentDate?: string;
}) {
  const data = await getBinData();
  const payments = data.payments || [];
  const updatedPayments = [...payments, payment];
  const updatedData = { ...data, payments: updatedPayments };
  
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedData),
  });
}

export async function updatePayments(updatedPayments: any[]) {
  const data = await getBinData();
  const updatedData = { ...data, payments: updatedPayments };
  
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedData),
  });
}

export async function getAdminCredentials(): Promise<{id: string, password: string}> {
  const data = await getBinData();
  return data.admin || { id: 'crismaAdmin123', password: 'pscjcrisma2026' };
}

export async function verifyAdmin(id: string, password: string): Promise<boolean> {
  const admin = await getAdminCredentials();
  return admin.id === id && admin.password === password;
}

export async function updateAdminCredentials(newId: string, newPassword: string) {
  const data = await getBinData();
  const updatedData = { ...data, admin: { id: newId, password: newPassword } };
  
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedData),
  });
}

// Função para obter relatório de pagamentos
export async function getPaymentReport() {
  const payments = await getPayments();
  const users = await getUsers();
  
  const report = users.map(user => {
    const userPayments = payments.filter(
      (p: any) => p.userName === user.name && p.parish === user.parish
    );
    
    return {
      userName: user.name,
      parish: user.parish,
      totalPaid: userPayments.length,
      totalInstallments: 15, // Total fixo de parcelas
      lastPayment: userPayments.length > 0 
        ? new Date(userPayments[userPayments.length - 1].paymentDate).toLocaleDateString() 
        : 'Nenhum'
    };
  });
  
  return report;
}