import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Configuração do banco de dados SQLite
export const initializeDatabase = async () => {
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Criar tabela de usuários se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      community TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criar tabela de parcelas se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS installments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      installment_number INTEGER NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      paid BOOLEAN DEFAULT FALSE,
      paid_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  return db;
};

export type Database = Awaited<ReturnType<typeof initializeDatabase>>; 