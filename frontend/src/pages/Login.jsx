


import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

//components
import Input from '../components/Input';
import useAuthentication from '../hooks/useAuthentication';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate()
  const { login, loading } = useAuthentication();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    const credentials = {
      email,
      password
    };

    try {
      const result = await login(credentials);
      if (result && result.token) {
        navigate('/');
      }
    } catch (err) {
      setErrors({ general: err.message || 'Erro ao fazer login' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='form-container w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='form-title flex items-center justify-center gap-3'>
            <LogIn className="w-8 h-8" />
            Entrar
          </h1>
          <p className='form-subtitle'>
            Entre com sua conta para continuar
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-6'>
          {errors.general && (
            <div className="message message-error">
              {errors.general}
            </div>
          )}
          
          <div>
            <Input 
              type="email" 
              name="email"
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              icon={<Mail className="w-5 h-5" />}
              required 
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              icon={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              required 
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">{errors.password}</p>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`btn w-full ${loading || isSubmitting ? 'loading' : ''}`}
            disabled={loading || isSubmitting}
          >
            {(loading || isSubmitting) ? (
              <>
                <div className="spinner"></div>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className='mt-8 text-center'>
          <p className='text-sm text-[#696969]'>
            Não tem uma conta?{' '}
            <Link to="/register" className='nav-link font-semibold'>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
