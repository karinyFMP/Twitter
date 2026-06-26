import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- ATENÇÃO: coloquei o "s" em contexts, ajuste se a sua pasta for no singular
import PostItem from "../components/PostItem";

export default function Home() {
  const { user, token } = useAuth(); // Pega o usuário logado e o token JWT do contexto
  const [posts, setPosts] = useState([]);
  const [novoPostTexto, setNovoPostTexto] = useState('');
  const [erro, setErro] = useState('');

  // Busca todos os posts ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/posts'); 
      // CORREÇÃO 1: Pegar o array '.posts' de dentro da resposta do Back-end!
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar os posts.');
    }
  };

  // Envia um novo post para o servidor
  const handleCriarPost = async (e) => {
    e.preventDefault();
    if (!novoPostTexto.trim()) return;

    try {
      setErro('');
      // Configura o cabeçalho com o Token JWT do usuário logado
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // CORREÇÃO 2: Enviar exatamente os nomes que o Back-end pediu (user_id e content)
      const response = await axios.post('http://localhost:3000/api/posts', { 
        user_id: user?.id, 
        content: novoPostTexto 
      }, config);

      // Atualiza a lista imediatamente colocando o novo post no topo
      setPosts([response.data.post, ...posts]);
      setNovoPostTexto(''); // Limpa o campo de texto
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || 'Falha ao publicar o post. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Página Inicial</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* REQUISITO: Exibição condicional - Formulário só aparece se o usuário estiver logado */}
      {user ? (
        <form onSubmit={handleCriarPost} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={novoPostTexto}
            onChange={(e) => setNovoPostTexto(e.target.value)}
            placeholder="O que estou pensando?"
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', borderColor: '#ccc', resize: 'none' }}
          />
          <button 
            type="submit" 
            style={{ marginTop: '10px', alignSelf: 'flex-end', padding: '8px 16px', backgroundColor: '#1DA1F2', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Publicar
          </button>
        </form>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Faça login para poder publicar e curtir posts.</p>
      )}

      {/* Listagem de Posts */}
      <div>
        {posts.length === 0 ? (
          <p>Nenhum post encontrado.</p>
        ) : (
          posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}