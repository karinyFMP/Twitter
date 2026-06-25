const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do arquivo do banco de dados (será criado na raiz do projeto se não existir)
const dbPath = path.resolve(__dirname, 'twitter_clone.db');

// Inicializa a conexão com o banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
    return;
  }
  console.log('Conexão bem-sucedida com o banco de dados SQLite.');

  // O SQLite, por padrão, vem com o suporte a chaves estrangeiras desativado.
  // É fundamental habilitar esta PRAGMA para que as restrições de FOREIGN KEY funcionem.
  db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
    if (pragmaErr) {
      console.error('Erro ao habilitar restrições de chaves estrangeiras:', pragmaErr.message);
    }
  });
});

// Função para criar o esquema do banco de dados de forma serializada (garante a ordem de execução)
const initSchema = () => {
  db.serialize(() => {
    // 1. Criação da tabela de Usuários (users)
    // Armazena as credenciais e o hash da senha de forma segura.
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Erro ao criar tabela users:', err.message);
    });

    // 2. Criação da tabela de Postagens (posts)
    // Representa os "tweets". Possui chave estrangeira (user_id) ligada à tabela users.
    // O 'ON DELETE CASCADE' garante que se um usuário for deletado, seus posts também serão.
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Erro ao criar tabela posts:', err.message);
    });

    // 3. Criação da tabela de Favoritos/Curtidas (favorites)
    // Tabela associativa (muitos-para-muitos) entre usuários e posts.
    // A chave primária composta (user_id, post_id) evita que um usuário favorite o mesmo post mais de uma vez.
    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) console.error('Erro ao criar tabela favorites:', err.message);
    });
  });
};

// Executa a inicialização do esquema assim que o arquivo for carregado
initSchema();

// Exporta a instância do banco conectada para uso nos controllers/models da aplicação
module.exports = db;