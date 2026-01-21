import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Shield, CheckCircle } from 'lucide-react';

//components
import Input from '../components/Input';
import useAuthentication from '../hooks/useAuthentication';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { register, loading } = useAuthentication();
    const navigate = useNavigate();

    // Password validation states
    const [passwordChecks, setPasswordChecks] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasMinLength: false
    });

    useEffect(() => {
        setPasswordChecks({
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasMinLength: password.length >= 6
        });
    }, [password]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }
        
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Senha deve conter: 1 minúscula, 1 maiúscula e 1 número';
        }
        
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        const user = {
            name: name.trim(),
            email: email.trim(),
            password,
        };
        
        try {
            const res = await register(user);
            if (res && res.token) {
                setSuccessMessage('Conta criada com sucesso! Redirecionando...');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        } catch (err) {
            setErrors({ general: err.message || 'Erro ao criar conta' });
        } finally {
            setIsSubmitting(false);
        }
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
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <span>Criar Conta</span>
                        </div>
                        <p className='form-subtitle'>
                            Crie sua conta para começar a usar
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {errors.general && (
                            <div className="message message-error">
                                <span className="message-icon">⚠</span>
                                {errors.general}
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="message message-success">
                                <span className="message-icon">✓</span>
                                {successMessage}
                            </div>
                        )}
                        
                        <div>
                            <Input 
                                type="text" 
                                name="name"
                                label="Nome Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!errors.name}
                                icon={<User className="w-5 h-5" />}
                                required 
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-2 ml-1">{errors.name}</p>
                            )}
                        </div>
                        
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
                            
                            {/* Password Strength Hint */}
                            {password && (
                                <div className="password-hint">
                                    <p className="password-hint-title">A senha deve conter:</p>
                                    <ul>
                                        <li className={passwordChecks.hasMinLength ? 'valid' : ''}>
                                            Mínimo 6 caracteres
                                        </li>
                                        <li className={passwordChecks.hasLowercase ? 'valid' : ''}>
                                            Uma letra minúscula
                                        </li>
                                        <li className={passwordChecks.hasUppercase ? 'valid' : ''}>
                                            Uma letra maiúscula
                                        </li>
                                        <li className={passwordChecks.hasNumber ? 'valid' : ''}>
                                            Um número
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                label="Confirmar Senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                icon={
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="password-toggle"
                                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                                required 
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-2 ml-1">{errors.confirmPassword}</p>
                            )}
                            {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                                <p className="text-green-400 text-sm mt-2 ml-1" style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle className="w-4 h-4" />
                                    Senhas coincidem
                                </p>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`btn w-full btn-ripple ${loading || isSubmitting ? 'loading' : ''}`}
                            disabled={loading || isSubmitting}
                        >
                            {(loading || isSubmitting) ? (
                                <>
                                    <div className="spinner"></div>
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Criar conta
                                </>
                            )}
                        </button>
                    </form>
                    
                    {/* Divider */}
                    <div className='divider'>
                        <span>ou</span>
                    </div>
                    
                    {/* Login Link */}
                    <div className='mt-8 text-center'>
                        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>
                            Já tem uma conta?{' '}
                            <Link to="/login" className='nav-link font-semibold'>
                                Fazer login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register

