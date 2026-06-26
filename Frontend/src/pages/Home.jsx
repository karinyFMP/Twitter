import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Mantive o caminho da sua pasta
import PostItem from "../components/PostItem";

export default function Home() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [novoPostTexto, setNovoPostTexto] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/posts'); 
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar os posts.');
    }
  };

  const handleCriarPost = async (e) => {
    e.preventDefault();
    if (!novoPostTexto.trim()) return;

    try {
      setErro('');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:3000/api/posts', { 
        user_id: user?.id, 
        content: novoPostTexto 
      }, config);

      setPosts([response.data.post, ...posts]);
      setNovoPostTexto(''); 
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.error || 'Falha ao publicar o post.');
    }
  };

  return (
    // Container principal imitando o Feed do Twitter
    <div style={{ maxWidth: '600px', margin: '0 auto', borderLeft: '1px solid #eff3f4', borderRight: '1px solid #eff3f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Cabeçalho fixo */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #eff3f4', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Página Inicial</h2>
      </div>

      {erro && <p style={{ color: 'red', padding: '0 20px' }}>{erro}</p>}

      {/* Área de Criar Post */}
      {user ? (
        <div style={{ padding: '20px', borderBottom: '1px solid #eff3f4', display: 'flex', gap: '15px' }}>
          {/* Avatar Fake */}
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ccc', flexShrink: 0 }}></div>
          
          <form onSubmit={handleCriarPost} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={novoPostTexto}
              onChange={(e) => setNovoPostTexto(e.target.value)}
              placeholder="O que está acontecendo?"
              rows="2"
              style={{ width: '100%', padding: '10px 0', border: 'none', outline: 'none', resize: 'none', fontSize: '20px', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eff3f4', paddingTop: '10px', marginTop: '10px' }}>
              <button 
                type="submit" 
                disabled={!novoPostTexto.trim()}
                style={{ padding: '10px 20px', backgroundColor: novoPostTexto.trim() ? '#1DA1F2' : '#8ED0F9', color: '#fff', border: 'none', borderRadius: '9999px', cursor: novoPostTexto.trim() ? 'pointer' : 'default', fontWeight: 'bold', fontSize: '15px' }}
              >
                Postar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ padding: '20px', borderBottom: '1px solid #eff3f4', textAlign: 'center', backgroundColor: '#f7f9f9' }}>
          <p style={{ color: '#536471', margin: 0 }}>Faça login para publicar e interagir.</p>
        </div>
      )}

      {/* Lista de Posts */}
      <div style={{ backgroundColor: '#fff' }}>
        {posts.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#536471' }}>Nenhum post encontrado.</p>
        ) : (
          posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}