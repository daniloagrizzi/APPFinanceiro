'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7202/api/auth/login", {
        userName: username,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: false
      });
      
      const { token, refreshToken, userId } = response.data;
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);
      
      router.push('/dashboard');
    } catch (error) {
      alert('Usuário ou senha inválidos');
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Lado Esquerdo (Login) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-[#221DAF] mb-10">Wo! Money</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 font-semibold text-[#221DAF]">Login</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="e-mail ou telefone"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block mb-2 font-semibold text-[#221DAF]">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Digite sua senha"
                required
              />
              <a href="#" className="block text-sm font-semibold text-[#221DAF] mt-2">Esqueceu a senha?</a>
            </div>
            <button type="submit" className="w-full mt-4 bg-[#221DAF] text-white font-semibold rounded-full py-3 hover:ring-2 transition">
              Entrar
            </button>
            <button
              type="button"
              className="w-full block text-[#221DAF] font-semibold rounded-full mt-4 py-3 border-2 border-[#221DAF] text-center hover:ring-[#221DAF] transition"
            >
              Cadastre-se
            </button>
          </form>
        </div>
      </div>
      
      {/* Lado Direito (Banner) */}
      <div className="hidden lg:flex w-[60%] bg-[#221DAF] text-white items-center justify-center flex-col px-8">
        <img src="/wo-axolot.png" alt="wo! logo" className="w-64 mb-10" />
        <h2 className="text-4xl font-bold mb-6">Olá, <span className="font-extrabold">Bem-vindo!</span></h2>
        <p className="text-xl text-center leading-relaxed">
          O mais <span className="font-bold">novo</span> e <span className="font-bold">inovador</span><br />
          gerenciador de gastos e investimentos!
        </p>
      </div>
    </div>
  );
}