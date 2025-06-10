import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push } from "firebase/database";

// 🔥 Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyCHXXtNL_bpAS9JU5bQfCji3GDqDJkng3s",
  authDomain: "crismaapp.firebaseapp.com",
  databaseURL: "https://crismaapp-default-rtdb.firebaseio.com",
  projectId: "crismaapp",
  storageBucket: "crismaapp.firebasestorage.app",
  messagingSenderId: "319556551205",
  appId: "1:319556551205:web:5bffaf6d6d2fa6f9cfb5cc"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para pegar todos os dados do banco
async function getDatabaseData() {
  const snapshot = await get(ref(db));
  return snapshot.val() || {};
}

// 🔄 Funções adaptadas (mesma estrutura, mas usando Firebase)

export async function getUsers(): Promise<any[]> {
  const data = await getDatabaseData();
  return data.users || [];
}

export async function addUser(user: { name: string; parish: string }) {
  const data = await getDatabaseData();
  const users = data.users || [];

  const exists = users.find(
    (u: any) =>
      u.name.toLowerCase().trim() === user.name.toLowerCase().trim() &&
      u.parish === user.parish
  );

  if (exists) return;

  const updatedUsers = [...users, user];
  const updatedData = { ...data, users: updatedUsers };

  await set(ref(db), updatedData); // Substitui o fetch do JSONBin
}

export async function getPayments(): Promise<any[]> {
  const data = await getDatabaseData();
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
  const data = await getDatabaseData();
  const payments = data.payments || [];
  const updatedPayments = [...payments, payment];
  const updatedData = { ...data, payments: updatedPayments };

  await set(ref(db), updatedData);
}

export async function updatePayments(updatedPayments: any[]) {
  const data = await getDatabaseData();
  const updatedData = { ...data, payments: updatedPayments };
  await set(ref(db), updatedData);
}

export async function getAdminCredentials(): Promise<{ id: string, password: string }> {
  const data = await getDatabaseData();
  return data.admin || { id: 'crismaAdmin123', password: 'pscjcrisma2026' };
}

export async function verifyAdmin(id: string, password: string): Promise<boolean> {
  const admin = await getAdminCredentials();
  return admin.id === id && admin.password === password;
}

export async function updateAdminCredentials(newId: string, newPassword: string) {
  const data = await getDatabaseData();
  const updatedData = { ...data, admin: { id: newId, password: newPassword } };
  await set(ref(db), updatedData);
}

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
      totalInstallments: 15,
      lastPayment: userPayments.length > 0
        ? new Date(userPayments[userPayments.length - 1].paymentDate).toLocaleDateString()
        : 'Nenhum'
    };
  });

  return report;
}

export async function deleteUser(userName: string, parish: string) {
  const data = await getDatabaseData();
  const users = data.users || [];
  const payments = data.payments || [];

  const updatedUsers = users.filter(
    (u: any) => !(u.name === userName && u.parish === parish)
  );

  const updatedPayments = payments.filter(
    (p: any) => !(p.userName === userName && p.parish === parish)
  );

  const updatedData = { ...data, users: updatedUsers, payments: updatedPayments };
  await set(ref(db), updatedData);
}