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
import { Candy } from 'lucide-react'

export const LoginForm = () => {
  const { login, loading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    await login(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Candy className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome Back 🍬
          </CardTitle>
          <CardDescription>
            Login to manage or purchase sweets
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                validate: (value) =>
                  validateEmail(value) || 'Invalid email address'
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters'
                }
              })}
              error={errors.password?.message}
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
              Login
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-amber-600 hover:text-amber-700"
              >
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
