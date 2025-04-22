'use client';
import BigButton from '../components/buttons/BigButton';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);

      const { token, refreshToken, userId } = res;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);

      setError('');
      setFormData({ userName: '', password: '' });

      setTimeout(() => router.push('/dashboard'));
    } catch (err: any) {
      setError('Usuário ou senha inválidos');
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado Esquerdo (Login) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-h1 font-bold text-dark-purple mb-10">Wo! Money</h1>
          <form onSubmit={handleLogin}>
            {message && <p className="text-green-600 mb-2">{message}</p>}
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <div className="mb-6">
              <label htmlFor="userName" className="block mb-2 font-semibold text-dark-purple">Login</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="e-mail ou telefone"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="block mb-2 font-semibold text-dark-purple">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Digite sua senha"
                required
              />
              <a href ='#' onClick={() => router.push('/forgotPassword')} className="block text-small font-semibold text-dark-purple mt-2">Esqueceu a senha?</a>
            </div>

            <BigButton text='Entrar' className='' variant='default' type='submit' />
            <BigButton text='Cadastre-se' className='' variant='secundary' onClick={() => router.push('/register')} />
          </form>
        </div>
      </div>

      {/* Lado Direito (Banner) */}
      <div className="hidden lg:flex w-[60%] bg-dark-purple text-white items-center justify-center flex-col px-8">
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
