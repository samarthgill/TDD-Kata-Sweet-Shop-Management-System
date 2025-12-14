import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">TDD Kata Sweet Shop</h3>
        <p className="text-gray-500">Loading sweetness...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner