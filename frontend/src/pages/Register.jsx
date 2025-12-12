

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';

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
            newErrors.password = 'Senha deve conter pelo menos: 1 letra minúscula, 1 letra maiúscula e 1 número';
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
        <div className='min-h-screen flex items-center justify-center px-4 py-8'>
            <div className='form-container w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='form-title flex items-center justify-center gap-3'>
                        <UserPlus className="w-8 h-8" />
                        Criar Conta
                    </h1>
                    <p className='form-subtitle'>
                        Crie sua conta para começar a usar
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {errors.general && (
                        <div className="message message-error">
                            {errors.general}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="message message-success">
                            {successMessage}
                        </div>
                    )}
                    
                    <div>
                        <Input 
                            type="text" 
                            name="name"
                            placeholder="Seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!errors.name}
                            icon={<User className="w-5 h-5" />}
                            required 
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                        )}
                    </div>
                    
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
                    
                    <div>
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword}
                            icon={
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                            required 
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
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
                                Criando conta...
                            </>
                        ) : (
                            'Criar conta'
                        )}
                    </button>
                </form>
                
                <div className='mt-8 text-center'>
                    <p className='text-sm text-[#696969]'>
                        Já tem uma conta?{' '}
                        <Link to="/login" className='nav-link font-semibold'>
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
