import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

//components
import Input from '../components/Input'
import Label from '../components/Label';
import useAuthentication from '../hooks/useAuthentication';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [error, setError] = useState(null);

    const {register, loading, error:authError} = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const user = {
            name,
            email,
            password,
        }
        if(password !== confirmPassword){
            setMensagem('As senhas não coincidem.');
            return;
        } else if(password.length < 8){
            setMensagem('A senha deve ter pelo menos 8 caracteres.');
            return;
        } else if(!/\d/.test(password)){
            setMensagem('A senha deve conter pelo menos um número.');
            return;
        } else if (!/[A-Z]/.test(password)) {
            setMensagem('A senha deve conter pelo menos uma letra maiúscula.');
            return;
        }
        // email verification on useAuthentication hook
        
        const res = await register(user);
  }

  return (
    <div className='flex flex-col items-center h-screen '>
      <h1 className='text-3xl font-bold'>Registro de usuário</h1>
      <p className='text-sm text-[#696969] mb-5'>Crie uma conta para poder interagir</p>
    <form className='flex flex-col justify-center items-center gap-2 md:w-full w-screen' onSubmit={handleSubmit}>
      <Label>
          <span className=' text-[#ccc] font-bold'>Nome: </span>
          <Input 
          type="text" 
          name="displayName"
          placeholder="Nome do usuário" 
          onChange={(e) => setName(e.target.value)}
          value={name}
          required />
      </Label>
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
          <div className='flex gap-2 items-center'>
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
      <Label>
          <span className=' text-[#ccc] font-bold'>Confirme sua senha: </span>
          <div className='flex gap-2 items-center'>
            <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repita senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='cursor-pointer'>
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
      </Label>
        <button className='btn'>Registrar</button>
        {mensagem && <p className='text-[#ccc]'>{mensagem}</p>}
        {authError && <p className='text-[#ccc]'>{authError}</p>}
      <p className='text-sm text-[#696969]'>Já tem uma conta? <Link to="/login" className='text-[#ccc] font-bold'>Faça login</Link></p>
    </form>
    </div>
  )
}

export default Register