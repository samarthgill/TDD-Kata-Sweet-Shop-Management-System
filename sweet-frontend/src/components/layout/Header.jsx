import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { ShoppingBag, User, LogOut } from 'lucide-react'

export const Header = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary-600" />
          <Link to="/" className="text-xl font-bold text-gray-900">
            Sweet Shop
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            Dashboard
          </Link>
          {isAdmin() && (
            <>
              <Link
                to="/admin/sweets"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Manage Sweets
              </Link>
              <Link
                to="/admin/inventory"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Inventory
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                  {isAdmin() && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                      Admin
                    </span>
                  )}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}