'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BigButton from '../components/buttons/BigButton';
import { authService } from '@/services/authService';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem.');
      return;
    }

    try {
      const res = await authService.resetPassword({
        email,
        token,
        newPassword,
      });

      setMessage(res.message || 'Senha redefinida com sucesso!');
      setError('');
      setTimeout(() => router.push('/login'), 500);
    } catch (err: any) {
      setError('Erro ao redefinir a senha. Tente novamente.');
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado Esquerdo (Formulário) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-h1 font-bold text-dark-purple mb-10">Wo! Money</h1>
          <h2 className="text-2xl font-semibold text-dark-purple mb-6">Redefinir Senha</h2>
          {message && <p className="text-green-600 mb-2">{message}</p>}
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label htmlFor="newPassword" className="block mb-2 font-semibold text-dark-purple">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Digite sua nova senha"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-dark-purple">Confirme a Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Repita sua nova senha"
                required
              />
            </div>
            <BigButton text="Redefinir Senha" className="" variant="default" type="submit" />
          </form>
        </div>
      </div>

      {/* Lado Direito (Banner) */}
      <div className="hidden lg:flex w-[60%] bg-dark-purple text-white items-center justify-center flex-col px-8">
        <img src="/wo-axolot.png" alt="Wo! Money" className="w-64 mb-10" />
        <h2 className="text-4xl font-bold mb-6">Olá, <span className="font-extrabold">Bem-vindo!</span></h2>
        <p className="text-xl text-center leading-relaxed">
          O mais <span className="font-bold">novo</span> e <span className="font-bold">inovador</span><br />
          gerenciador de gastos e investimentos!
        </p>
      </div>
    </div>
  );
}
