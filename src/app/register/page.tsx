'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import BigButton from '../components/buttons/BigButton';

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const res = await authService.register(formData)
      setMessage(res.message || 'Usuário registrado com sucesso!')
      setFormData({ username: '', email: '', password: '' })

      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao registrar.')
    }
  }

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
                name="username"
                value={formData.username}
                onChange={handleChange}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="Crie uma senha"
                required
              />
            </div>

            <BigButton text='Cadastrar' />
            <BigButton text='Já possui conta? Entre aqui' className='' variant='secundary' onClick={() => router.push('/login')} />

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
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
  )
}