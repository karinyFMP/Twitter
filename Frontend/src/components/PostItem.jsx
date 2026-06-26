import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho conforme seu projeto

export default function PostItem({ post }) {
  // Formata a data se ela existir
  const dataFormatada = post.created_at 
    ? new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
    : '';

  return (
    <div style={{ padding: '15px 20px', borderBottom: '1px solid #eff3f4', display: 'flex', gap: '15px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f9f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
      
      {/* Avatar do Autor */}
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1DA1F2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
        {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'U'}
      </div>

      {/* Conteúdo do Post */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#0f1419', fontSize: '15px' }}>
            {post.author_name || 'Usuário Desconhecido'}
          </span>
          <span style={{ color: '#536471', fontSize: '15px' }}>
            @{post.author_name ? post.author_name.toLowerCase().replace(/\s/g, '') : 'user'}
          </span>
          <span style={{ color: '#536471' }}>·</span>
          <span style={{ color: '#536471', fontSize: '15px' }}>{dataFormatada}</span>
        </div>
        
        <p style={{ margin: 0, color: '#0f1419', fontSize: '15px', lineHeight: '20px', wordWrap: 'break-word' }}>
          {post.content}
        </p>

        {/* Ícones de ação fake (apenas visual) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#536471', maxWidth: '425px' }}>
          <span style={{ cursor: 'pointer' }}>💬 0</span>
          <span style={{ cursor: 'pointer' }}>🔁 0</span>
          <span style={{ cursor: 'pointer' }}>❤️ 0</span>
          <span style={{ cursor: 'pointer' }}>📊 0</span>
        </div>
      </div>
    </div>
  );
}