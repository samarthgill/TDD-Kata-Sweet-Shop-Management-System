import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}