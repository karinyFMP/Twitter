import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho conforme seu projeto

export default function PostItem({ post }) {
  const { user, token } = useAuth();
  
  // Estados locais para controlar a curtida em tempo real na interface
  const [curtido, setCurtido] = useState(post.isLikedByMe || false); 
  const [totalLikes, setTotalLikes] = useState(post.likesCount || 0);
  const [erroLike, setErroLike] = useState('');

  const handleLikeUnlike = async () => {
    // REQUISITO: Só permite clicar se estiver logado
    if (!user) return; 

    try {
      setErroLike('');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Dispara a requisição para o backend
      // O endpoint pode variar (ex: /posts/:id/like). Ajuste conforme o backend de sua dupla
      await axios.post(`http://localhost:3000/api/posts/${post.id}/like`, {}, config);

      // Inverte o estado visual e atualiza o contador dinamicamente
      if (curtido) {
        setCurtido(false);
        setTotalLikes(prev => prev - 1);
      } else {
        setCurtido(true);
        setTotalLikes(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setErroLike('Erro ao processar curtida.');
    }
  };

  return (
    <div style={{ border: '1px solid #e1e8ed', padding: '15px', borderRadius: '5px', marginBottom: '10px', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{post.User?.nome || post.autorNome || 'Usuário'}</strong>
        <span style={{ color: '#888', fontSize: '12px' }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <p style={{ margin: '10px 0', color: '#1c2022' }}>{post.conteudo}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* REQUISITO: O botão de curtir é desabilitado visualmente se o usuário não estiver logado */}
        <button
          onClick={handleLikeUnlike}
          disabled={!user}
          style={{
            background: 'none',
            border: 'none',
            cursor: user ? 'pointer' : 'not-allowed',
            color: curtido ? '#E0245E' : '#657786',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {curtido ? '❤️ Descurtir' : '🤍 Curtir'}
        </button>
        <span style={{ color: '#657786', fontSize: '14px' }}>{totalLikes} curtidas</span>
      </div>

      {erroLike && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{erroLike}</p>}
    </div>
  );
}