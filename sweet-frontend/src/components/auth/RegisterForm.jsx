import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/Card'
import { validateEmail } from '../../lib/utils'
import { User, Shield } from 'lucide-react'

export const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'customer'
    }
  })

  const password = watch('password')
  const role = watch('role')

  const onSubmit = async (data) => {
    await registerUser(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            {role === 'admin' ? <Shield /> : <User />}
          </div>
          <CardTitle className="text-2xl font-bold">
            Create Your Account 🍭
          </CardTitle>
          <CardDescription>
            Register as a customer or admin
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer transition
                  ${role === 'customer'
                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                    : 'border-gray-300 bg-white'}
                `}>
                  <input
                    type="radio"
                    value="customer"
                    {...register('role')}
                    className="hidden"
                  />
                  <User className="h-4 w-4" />
                  Customer
                </label>

                <label className={`flex items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer transition
                  ${role === 'admin'
                    ? 'border-amber-600 bg-amber-50 text-amber-700'
                    : 'border-gray-300 bg-white'}
                `}>
                  <input
                    type="radio"
                    value="admin"
                    {...register('role')}
                    className="hidden"
                  />
                  <Shield className="h-4 w-4" />
                  Admin
                </label>
              </div>
            </div>

            <Input
              label="Full Name"
              placeholder="John Doe"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' }
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                validate: (v) => validateEmail(v) || 'Invalid email'
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Confirm password',
                validate: (v) => v === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-amber-600 hover:text-amber-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
