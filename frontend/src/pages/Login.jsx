import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


//components
import Label from '../components/Label';
import Input from '../components/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const handleSubmit = () => {
    e.preventDefault();
  }

  return (
    <div className='flex flex-col items-center h-screen '>
      <h1 className='text-3xl font-bold'>Login</h1>
      <p className='text-sm text-[#696969] mb-5'>Entre com sua conta para poder interagir</p>
    <form className='flex flex-col justify-center items-center gap-5 w-full' onSubmit={handleSubmit}>
      <Label>
          <span className=' text-[#ccc] font-bold'>Email: </span>
          <Input 
          type="email" 
          name="email"
          placeholder="Digite seu email" 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required />
      </Label>
      <Label>
          <span className=' text-[#ccc] font-bold'>Senha: </span>
          <div className='flex items-center gap-2'>
              <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Digite sua senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className='cursor-pointer'>
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
          </div>

      </Label>
        <button className='btn'>Entrar</button>
      <p className='text-sm text-[#696969]'>Não tem uma conta? <Link to="/register" className='text-[#ccc] font-bold'>Criar conta</Link></p>
    </form>
    </div>
  )
}

export default Login