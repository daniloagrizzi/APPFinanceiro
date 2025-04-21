'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, email, password);
    } catch (error) {
      alert('Erro ao registrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado Esquerdo (Registro) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-[#221DAF] mb-10">Wo! Money</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 font-semibold text-[#221DAF]">Nome de usuário</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Digite seu nome de usuário"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-semibold text-[#221DAF]">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-semibold text-[#221DAF]">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Crie uma senha"
                required
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-[#221DAF] text-white font-semibold rounded-full py-3 hover:ring-2 transition">
              Cadastrar
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito (Banner) */}
      <div className="hidden lg:flex w-[60%] bg-[#221DAF] text-white items-center justify-center flex-col px-8">
        <img src="/wo-axolot.png" alt="wo! logo" className="w-64 mb-10" />
        <h2 className="text-4xl font-bold mb-6">Junte-se a <span className="font-extrabold">nós!</span></h2>
        <p className="text-xl text-center leading-relaxed">
          Comece a <span className="font-bold">controlar</span> e <span className="font-bold">investir</span><br />
          seu dinheiro de forma inteligente!
        </p>
      </div>
    </div>
  );
}
