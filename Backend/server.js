const express = require('express');
const cors = require('cors'); // 1. Importe o cors
const postRoutes = require('./src/routes/postRoutes'); // Ajuste o caminho se precisar
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// 2. Libere o CORS *ANTES* das rotas
app.use(cors()); 
app.use(express.json());

// 3. Conecte as rotas (isso resolve o 404)
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes); // Aproveitando para já ligar a rota de login/cadastro

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});