import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Ajuste o caminho se seu AuthContext estiver em outra pasta

// Importação das Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

function App() {
  const { user } = useAuth(); // Pega o usuário do contexto para saber se está logado

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Acessa a Home (Feed) */}
        <Route path="/" element={<Home />} />

        {/* Rotas de Autenticação */}
        {/* Se o usuário já estiver logado, redireciona automaticamente para a Home */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/cadastro" 
          element={!user ? <Cadastro /> : <Navigate to="/" />} 
        />

        {/* Rota de Fallback: Se digitar qualquer coisa errada, volta para a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;