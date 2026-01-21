import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Shield } from 'lucide-react';

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

  const { login, loading, token } = useAuthentication();

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

    await login({email, password})
    navigate('/');
  }

  const adminLogin = () =>{
    setEmail('admin@admin.com');
    setPassword('senhamuitoforte');
  }

  return (
    <div className="auth-page">
      {/* Floating Shapes Background */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className='min-h-screen flex items-center justify-center px-4 py-8'>
        <div className='form-container w-full max-w-md'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='form-title flex items-center justify-center gap-3'>
              <div className="icon-wrapper">
                <LogIn className="w-6 h-6" />
              </div>
              <span>Bem-vindo</span>
            </div>
            <p className='form-subtitle'>
              Entre com sua conta para continuar
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className='space-y-5'>
            {errors.general && (
              <div className="message message-error">
                <span className="message-icon">⚠</span>
                {errors.general}
              </div>
            )}
            
            <div>
              <Input 
                type="email" 
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                icon={<Mail className="w-5 h-5" />}
                required 
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 ml-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                icon={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                required 
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 ml-1">{errors.password}</p>
              )}
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" style={{ 
                color: 'var(--text-secondary)', 
                textDecoration: 'none', 
                fontSize: '0.85rem', 
                transition: 'color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                Esqueceu a senha?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className={`btn w-full btn-ripple ${loading || isSubmitting ? 'loading' : ''}`}
              disabled={loading || isSubmitting}
            >
              {(loading || isSubmitting) ? (
                <>
                  <div className="spinner"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className='divider'>
            <span>ou</span>
          </div>
          
          {/* Admin Login Section */}
          <div className='admin-section'>
            <p className='admin-section-title'>
              <Shield className="w-4 h-4" />
              Acesso Rápido - Demo
            </p>
            <div className='admin-credentials' onClick={adminLogin} style={{ cursor: 'pointer' }}>
              <strong>Email:</strong> admin@admin.com<br />
              <strong>Senha:</strong> senhamuitoforte
            </div>
          </div>
          
          {/* Register Link */}
          <div className='mt-8 text-center'>
            <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>
              Não tem uma conta?{' '}
              <Link to="/register" className='nav-link font-semibold'>
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

