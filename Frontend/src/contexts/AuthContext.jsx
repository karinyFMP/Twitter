import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

// Configuração da API apontando diretamente para o seu Back-end em Node.js
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (recoveredUser && recoveredUser !== 'undefined' && token) {
      try {
        setUser(JSON.parse(recoveredUser));
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  // ==========================================
  // FUNÇÃO DE LOGIN (INTEGRAÇÃO COM BANCO REAL)
  // ==========================================
  const login = async (emailOrUsername, password) => {
    try {
      // O seu Back-end exige 'username' e 'password'. 
      // Passamos o valor digitado no primeiro campo do formulário como o username.
      const response = await api.post('/auth/login', { 
        username: emailOrUsername, 
        password: password 
      });

      const loggedUser = response.data.user;

      // O seu Back-end salva os dados com sucesso, mas não gera JWT nativamente.
      // Criamos uma string de controle para manter a consistência das rotas protegidas do Front.
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', 'autenticado_via_banco_real');
      
      setUser(loggedUser);
      navigate('/');
      return { success: true };
    } catch (error) {
      console.error('Erro ao realizar login no banco:', error);
      const mensagemErro = error.response?.data?.error || 'Credenciais inválidas. Tente novamente.';
      alert(mensagemErro);
      return { success: false, error: mensagemErro };
    }
  };

  // ==========================================
  // FUNÇÃO DE CADASTRO (INTEGRAÇÃO COM BANCO REAL)
  // ==========================================
  const register = async (nome, email, password) => {
    try {
      // O seu Back-end insere apenas 'username' e 'password_hash' na tabela 'users'.
      // Enviamos o campo 'nome' do formulário diretamente para a coluna 'username'.
      await api.post('/auth/register', { 
        username: nome, 
        password: password 
      });

      // 🪄 PULO DO GATO: Após cadastrar com sucesso no banco SQLite, 
      // fazemos o login automático do usuário para que ele vá direto para o feed!
      return await login(nome, password);
    } catch (error) {
      console.error('Erro ao realizar cadastro no banco:', error);
      const mensagemErro = error.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      alert(mensagemErro);
      return { success: false, error: mensagemErro };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);