import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, ShoppingCart, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '../services/authService'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '#features' },
    { name: 'Products', path: '#products' },
    { name: 'Reviews', path: '#testimonials' },
    { name: 'About', path: '#about' },
  ]

  const handleLogout = () => {
    authService.logout()
    navigate('/')
    window.location.reload()
  }

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId.replace('#', ''))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  TDD Kata Sweet Shop
                </h1>
                <p className="text-sm text-gray-500">Since 2023</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.path)}
                  className="text-gray-600 hover:text-amber-600 transition-colors font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                    className="px-4 py-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register/customer"
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-amber-200 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-amber-600"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-amber-100 shadow-lg z-40"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.path)}
                  className="block w-full text-left px-4 py-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  {item.name}
                </button>
              ))}
              
              <div className="pt-6 border-t border-gray-100">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                      className="block w-full text-left px-4 py-3 bg-amber-50 text-amber-600 rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 border-2 border-amber-500 text-amber-600 rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register/customer"
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation