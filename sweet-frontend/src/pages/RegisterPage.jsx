import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const RegisterPage = () => {
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await authService.register(name, email, password, role)

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      role === 'admin'
        ? navigate('/admin/dashboard')
        : navigate('/customer/dashboard')

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">

      {/* Glow Effects */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-40"></div>

      <div className="relative max-w-md w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Choose how you want to register
        </p>

        {/* ROLE SELECTION */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`p-4 rounded-2xl border text-center transition
              ${role === 'customer'
                ? 'border-amber-500 bg-amber-50 shadow'
                : 'border-gray-300 hover:border-amber-400'}
            `}
          >
            <p className="text-lg font-semibold">Customer</p>
            <p className="text-xs text-gray-500 mt-1">
              Buy sweets & place orders
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`p-4 rounded-2xl border text-center transition
              ${role === 'admin'
                ? 'border-orange-500 bg-orange-50 shadow'
                : 'border-gray-300 hover:border-orange-400'}
            `}
          >
            <p className="text-lg font-semibold">Admin</p>
            <p className="text-xs text-gray-500 mt-1">
              Manage shop & inventory
            </p>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition"
          >
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-amber-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage
