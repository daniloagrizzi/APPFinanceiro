'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BigButton from '../components/buttons/BigButton'
import { authService } from '@/services/authService'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const res = await authService.forgotPassword({
        email: formData.email,
        frontendBaseUrl: window.location.origin
      })
      setMessage(res.message || 'Verifique seu e‑mail para o link de redefinição.')
      setFormData({ email: '' })
    } catch (err: any) {
      setError('Erro ao enviar o e‑mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Lado Esquerdo (Formulário) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-h1 font-bold text-dark-purple mb-10">Wo! Money</h1>
          <h2 className="text-2xl font-semibold text-dark-purple mb-6">Recuperação de Senha</h2>

          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-dark-purple">
                E‑mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800"
                placeholder="seu@exemplo.com"
                required
              />
            </div>

            <BigButton
              type="submit"
              text={loading ? 'Enviando...' : 'Enviar Link'}
              variant="default"
              className="w-full"
            />
          </form>
          <BigButton text='Voltar ao login' className='' variant='secundary' onClick={() => router.push('/login')} />
        </div>
      </div>

      {/* Lado Direito (Banner) */}
      <div className="hidden lg:flex w-[60%] bg-dark-purple text-white items-center justify-center flex-col px-8">
        <img src="/wo-axolot.png" alt="Wo! Money" className="w-64 mb-10" />
        <h2 className="text-4xl font-bold mb-6">Esqueceu a senha?</h2>
        <p className="text-xl text-center leading-relaxed">
          Informe seu e‑mail que enviaremos um link<br/>
          para você redefinir sua senha com segurança.
        </p>
      </div>
    </div>
  )
}
