import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializar banco de dados
let db: Awaited<ReturnType<typeof initializeDatabase>>;

(async () => {
  db = await initializeDatabase();
})();

// Tipos
interface CreateUserRequest {
  name: string;
  community: string;
}

interface PayInstallmentsRequest {
  userId: number;
  installmentIds: number[];
}

// Rotas para usuários
app.post('/api/users', async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  const { name, community } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO users (name, community) VALUES (?, ?)',
      [name, community]
    );
    const userId = result.lastID;
    
    // Criar parcelas para o usuário
    for (let i = 1; i <= 15; i++) {
      await db.run(
        'INSERT INTO installments (user_id, installment_number, amount) VALUES (?, ?, ?)',
        [userId, i, 15.00]
      );
    }
    
    res.json({ id: userId, name, community });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.get('/api/users/:name/:community', async (req: Request<{ name: string; community: string }>, res: Response) => {
  const { name, community } = req.params;
  try {
    const user = await db.get(
      'SELECT * FROM users WHERE name = ? AND community = ?',
      [name, community]
    );
    if (user) {
      const installments = await db.all(
        'SELECT * FROM installments WHERE user_id = ?',
        [user.id]
      );
      res.json({ user, installments });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Rotas para parcelas
app.post('/api/installments/pay', async (req: Request<{}, {}, PayInstallmentsRequest>, res: Response) => {
  const { userId, installmentIds } = req.body;
  try {
    for (const installmentId of installmentIds) {
      await db.run(
        'UPDATE installments SET paid = TRUE, paid_at = CURRENT_TIMESTAMP WHERE user_id = ? AND installment_number = ?',
        [userId, installmentId]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar parcelas como pagas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 