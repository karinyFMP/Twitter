import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Cadastro = () => {
  const { register: authRegister } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Observamos a senha para garantir que a confirmação seja idêntica
  const senha = watch('senha');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    
    const result = await authRegister(data.nome, data.email, data.senha);
    
    if (!result.success) {
      setServerError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <h2>Criar uma conta no CloneTwitter</h2>
      
      {serverError && <div className="error-message">{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            {...register('nome', { required: 'O nome é obrigatório' })}
          />
          {errors.nome && <span className="error">{errors.nome.message}</span>}
        </div>

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
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres',
              },
            })}
          />
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Senha</label>
          <input
            type="password"
            {...register('confirmarSenha', {
              required: 'A confirmação de senha é obrigatória',
              validate: (value) => value === senha || 'As senhas não coincidem',
            })}
          />
          {errors.confirmarSenha && (
            <span className="error">{errors.confirmarSenha.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
        </button>
      </form>
      
      <p>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
};

export default Cadastro;