'use client'

import { useState, useEffect } from 'react'
import { login, signup } from './actions'
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [redirectTo, setRedirectTo] = useState("/")
  const [successMessage, setSuccessMessage] = useState("")

  // Get search params for redirect URL
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get redirect URL from query params
    const redirect = searchParams.get('redirectTo')
    if (redirect) {
      setRedirectTo(redirect)
    }
  }, [searchParams])

  // Funkcja walidacji email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    setEmailError(isValid ? "" : "Wprowadź poprawny adres email")
    return isValid
  }

  // Funkcja walidacji hasła
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6
    setPasswordError(isValid ? "" : "Hasło musi mieć co najmniej 6 znaków")
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: 'login' | 'signup') => {
    e.preventDefault()

    // Reset errors and success message
    setError("")
    setEmailError("")
    setPasswordError("")
    setSuccessMessage("")

    // Validate fields
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      // Add redirect URL to form data for login action
      if (action === 'login' && redirectTo) {
        formData.append('redirectTo', redirectTo)
      }

      // Call the appropriate server action
      const result = action === 'login'
        ? await login(formData)
        : await signup(formData)

      // Handle errors
      if (result?.error) {
        setError(result.error)
      }
      // Handle success message for signup
      else if (action === 'signup' && result?.success) {
        setSuccessMessage(result.message || 'Account created successfully. Check your email for confirmation.')
        // Clear form on successful signup
        setEmail('')
        setPassword('')
      }
      // Login is handled by the server action redirect
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas " + (action === 'login' ? "logowania" : "rejestracji"))
      console.error(action === 'login' ? "Login error:" : "Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GodLike HVAC CRM ERP</h1>
          <p className="text-gray-600 mt-2">Zaloguj się, aby kontynuować</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'login')} className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Logowanie</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adres email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              onBlur={() => validateEmail(email)}
              autoComplete="username"
              placeholder="nazwa@firma.pl"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) validatePassword(e.target.value)
                }}
                onBlur={() => validatePassword(password)}
                autoComplete="current-password"
                placeholder="Minimum 6 znaków"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Hidden input for redirect URL */}
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, 'signup')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
              disabled={loading}
            >
              Załóż konto
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition">
              Zapomniałeś hasła?
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GodLike HVAC CRM ERP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </div>
  )
}
