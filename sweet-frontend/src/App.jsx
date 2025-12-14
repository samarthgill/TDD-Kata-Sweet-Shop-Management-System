import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/customer/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Navigate to="/register/customer" replace />} />
          <Route path="/register/:role" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App