const express = require('express');
const app = express();

// Middleware para processar JSON no body das requisições
app.use(express.json()); 

// Importação das rotas
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');

// Uso das rotas no Express
app.use(authRoutes);
app.use(postRoutes);
// Registro das rotas na aplicação
app.use(authRoutes);
app.use(postRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});