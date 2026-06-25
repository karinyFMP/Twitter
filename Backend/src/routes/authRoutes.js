const express = require('express');
const bcrypt = require('bcrypt');
// Importa a instância do banco de dados configurada anteriormente
const db = require('../config/database'); 

const router = express.Router();

// Funções utilitárias para transformar os callbacks do SQLite em Promises.
// Isso permite o uso correto do try/catch com async/await.
const dbRun = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this); // 'this' contém lastID e changes
    });
  });
};

const dbGet = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// ==========================================
// ROTA POST: /register
// ==========================================
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validação básica de entrada
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios.' });
  }

  try {
    // Regra de Negócio de Segurança: Gerar o salt e o hash da senha
    // O valor 10 representa o "cost factor" (rounds), padrão atual seguro e de boa performance
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insere o usuário no banco de dados com a senha "hasheada"
    const query = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
    await dbRun(query, [username, passwordHash]);

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    // Tratamento de erro específico para violação de constraint UNIQUE (usuário já existe)
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Este username já está em uso.' });
    }
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao registrar usuário.' });
  }
});

// ==========================================
// ROTA POST: /login
// ==========================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios.' });
  }

  try {
    // 1. Buscar o usuário pelo username no banco de dados
    const query = `SELECT * FROM users WHERE username = ?`;
    const user = await dbGet(query, [username]);

    // Prevenção contra enumeração de usuários: Retornar mensagem genérica
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Comparar a senha fornecida em texto puro com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Sucesso! Em um cenário real, aqui seria gerado e retornado um JWT (JSON Web Token)
    // Para omitir complexidade desnecessária neste momento, retornamos apenas os dados básicos
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao processar o login.' });
  }
});

module.exports = router;