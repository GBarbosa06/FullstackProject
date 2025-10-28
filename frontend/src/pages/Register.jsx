import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

//components
import Input from '../components/Input'
import Label from '../components/Label';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setMensagem(`Usuário ${data.nome} cadastrado com sucesso!`);
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setMensagem("Erro ao cadastrar usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
    setMensagem("Falha na comunicação com o servidor.");
  }
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
      <p className='text-sm text-[#696969]'>Já tem uma conta? <Link to="/login" className='text-[#ccc] font-bold'>Faça login</Link></p>
    </form>
    </div>
  )
}

export default Register