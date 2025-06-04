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
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: ''
  })

  // Função para validar senha
  const validatePassword = (password: string): string => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return 'A senha deve conter ao menos: uma letra maiúscula, uma minúscula, um número e um caractere especial (!@#$%^&*(),.?":{}|<>)'
    }
    return ''
  }

  // Função para validar nome de usuário
  const validateUsername = (username: string): string => {
    const hasSpecialChars = /[^a-zA-Z0-9_]/.test(username)
    const hasSpaces = /\s/.test(username)
    const hasAccents = /[àáâãäèéêëìíîïòóôõöùúûüçñ]/i.test(username)

    if (hasSpecialChars || hasSpaces || hasAccents) {
      return 'O nome de usuário não pode conter caracteres especiais, espaços ou acentos. Use apenas letras, números e underscore (_)'
    }
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Validação em tempo real
    if (name === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }))
    }

    if (name === 'username') {
      setValidationErrors(prev => ({
        ...prev,
        username: validateUsername(value)
      }))
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    // Validar todos os campos antes de enviar
    const passwordError = validatePassword(formData.password)
    const usernameError = validateUsername(formData.username)

    if (passwordError || usernameError) {
      setValidationErrors({
        password: passwordError,
        username: usernameError
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await authService.register(formData)
      setMessage(res.message || 'Usuário registrado com sucesso!')
      setFormData({ username: '', email: '', password: '' })
      setValidationErrors({ username: '', password: '' })

      setTimeout(() => router.push('/login'), 1000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao registrar.')
    } finally {
      setIsLoading(false)
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
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 ${
                  validationErrors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite seu nome de usuário"
                required
                disabled={isLoading}
              />
              {validationErrors.username && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.username}</p>
              )}
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
                disabled={isLoading}
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
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Crie uma senha"
                required
                disabled={isLoading}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            <BigButton 
              text={isLoading ? 'Cadastrando...' : 'Cadastrar'} 
              className='cursor-pointer'
              type='submit'
              disabled={isLoading}
            />
            <BigButton 
              text='Já possui conta? Entre aqui' 
              className='cursor-pointer' 
              variant='secundary' 
              onClick={() => router.push('/login')}
              disabled={isLoading}
            />

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