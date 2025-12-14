import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await login(email, password)

    if (result.success) {
      result.data.user.role === 'admin'
        ? navigate('/admin/dashboard')
        : navigate('/customer/dashboard')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">
      
      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-40"></div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          <p className="text-center text-gray-600 mt-2 mb-8">
            Login to manage your sweet world 🍬
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg hover:shadow-amber-300 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t"></div>
            <span className="mx-3 text-sm text-gray-500">New here?</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/register/admin"
              className="py-2 rounded-xl border border-gray-300 text-center font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Admin
            </Link>
            <Link
              to="/register/customer"
              className="py-2 rounded-xl bg-amber-600 text-white text-center font-medium hover:bg-amber-700 transition"
            >
              Customer
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-amber-600 hover:underline">
              Choose Role
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
