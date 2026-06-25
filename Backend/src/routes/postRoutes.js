const express = require('express');
// Importa a instância do banco de dados configurada anteriormente
const db = require('../config/database'); 

const router = express.Router();

// Funções utilitárias para transformar os callbacks do SQLite em Promises.
// Permite o uso limpo de try/catch com async/await.
const dbRun = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this); // 'this' contém o lastID do post inserido
    });
  });
};

const dbAll = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// ==========================================
// ROTA POST: /posts
// Cria um novo post (Tweet) associado a um usuário
// ==========================================
router.post('/posts', async (req, res) => {
  const { user_id, content } = req.body;

  // Validação básica dos dados de entrada
  if (!user_id || !content) {
    return res.status(400).json({ error: 'O id do usuário (user_id) e o conteúdo (content) são obrigatórios.' });
  }

  // Validação do tamanho do post (Simulando o limite clássico do Twitter)
  if (content.trim().length > 280) {
    return res.status(400).json({ error: 'O conteúdo do post não pode exceder 280 caracteres.' });
  }

  try {
    // Insere o post. O 'created_at' será preenchido automaticamente com o CURRENT_TIMESTAMP do SQLite
    const query = `INSERT INTO posts (user_id, content) VALUES (?, ?)`;
    const result = await dbRun(query, [user_id, content]);

    return res.status(201).json({
      message: 'Post criado com sucesso!',
      post: {
        id: result.lastID,
        user_id,
        content
      }
    });
  } catch (error) {
    // Se falhar a restrição de chave estrangeira (ex: user_id não existe na tabela users)
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Operação inválida. O usuário informado não existe.' });
    }
    
    console.error('Erro ao criar post:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao tentar criar o post.' });
  }
});

// ==========================================
// ROTA GET: /posts
// Lista todos os posts com o nome do autor (JOIN) ordenados por data decrescente
// ==========================================
router.get('/posts', async (req, res) => {
  try {
    // Consulta SQL com INNER JOIN para acoplar o username do autor ao post correspondente.
    // Ordenado de forma decrescente (DESC) para exibir os posts mais recentes primeiro no feed.
    const query = `
      SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        users.id AS author_id,
        users.username AS author_name
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `;

    const feed = await dbAll(query, []);

    // Retorna a lista de postagens estruturada para o feed principal
    return res.status(200).json({
      results: feed.length,
      posts: feed
    });
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao carregar o feed de posts.' });
  }
});

module.exports = router;

// ==========================================
// ROTA POST: /posts/:id/favorite
// Toggle de curtida: Se já curtiu, remove. Se não, adiciona.
// ==========================================
router.post('/posts/:id/favorite', async (req, res) => {
  const post_id = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'O id do usuário (user_id) é obrigatório.' });
  }

  try {
    // 1. Verifica se o like já existe na tabela favorites
    const checkQuery = `SELECT * FROM favorites WHERE user_id = ? AND post_id = ?`;
    const existingFavorite = await dbGet(checkQuery, [user_id, post_id]);

    if (existingFavorite) {
      // 2. Se o registro existe, o usuário está "descurtindo" o post (DELETE)
      const deleteQuery = `DELETE FROM favorites WHERE user_id = ? AND post_id = ?`;
      await dbRun(deleteQuery, [user_id, post_id]);
      
      return res.status(200).json({ message: 'Post descurtido com sucesso.', liked: false });
    } else {
      // 3. Se o registro NÃO existe, o usuário está "curtindo" o post (INSERT)
      const insertQuery = `INSERT INTO favorites (user_id, post_id) VALUES (?, ?)`;
      await dbRun(insertQuery, [user_id, post_id]);
      
      return res.status(201).json({ message: 'Post curtido com sucesso.', liked: true });
    }

  } catch (error) {
    // Trata erro caso o post_id não exista (violação de chave estrangeira)
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(404).json({ error: 'Post ou usuário não encontrado.' });
    }
    console.error('Erro ao processar favorito:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a ação.' });
  }
});