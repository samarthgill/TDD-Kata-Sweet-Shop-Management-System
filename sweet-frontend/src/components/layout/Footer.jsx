import React from 'react'

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Sweet Shop Management System. All rights reserved.</p>
        <p className="mt-2">Built with ❤️ for sweet lovers everywhere</p>
      </div>
    </footer>
  )
}