import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

// Configuração base do Axios (ajuste a URL para o seu backend Express)
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera o usuário salvo e o token ao carregar a aplicação
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao realizar login. Tente novamente.';
      return { success: false, message };
    }
  };

  const register = async (nome, email, password) => {
    try {
      // Enviamos a senha em texto plano pela rede (idealmente via HTTPS) 
      // O backend Express se encarregará de fazer o HASH usando bcrypt
      const response = await api.post('/auth/register', { nome, email, password });
      
      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      navigate('/');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = null;
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