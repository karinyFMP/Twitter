import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    
    const result = await login(data.email, data.senha);
    
    if (!result.success) {
      setServerError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <h2>Entrar no CloneTwitter</h2>
      
      {serverError && <div className="error-message">{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            {...register('email', {
              required: 'O e-mail é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de e-mail inválido',
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            {...register('senha', {
              required: 'A senha é obrigatória',
            })}
          />
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Não tem uma conta? <Link to="/cadastro">Inscreva-se</Link>
      </p>
    </div>
  );
};

export default Login;