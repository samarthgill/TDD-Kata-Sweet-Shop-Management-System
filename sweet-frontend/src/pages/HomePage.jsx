import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            TDD Kata
          </h1>

          <div className="space-x-6">
            <Link to="/login" className="text-gray-600 hover:text-amber-600">
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage Your  
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Sweet Business
            </span>
            Effortlessly
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Inventory, customers, sales, and growth — all managed from one powerful dashboard.
          </p>

          <div className="flex gap-4">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-xl hover:shadow-amber-300 transition"
            >
              Start Free
            </Link>

            <Link
              to="/login"
              className="px-8 py-3 rounded-xl border-2 border-amber-500 text-amber-600 font-semibold hover:bg-amber-50 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-300 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-50"></div>

          <div className="relative bg-white/70 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Today’s Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Stat title="Total Sweets" value="50+" />
              <Stat title="Customers" value="1,000+" />
              <Stat title="Orders" value="5,000+" />
              <Stat title="Rating" value="4.8★" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Why TDD Kata?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="Smart Inventory"
            desc="Track stock in real-time and never run out of sweets."
          />
          <Feature
            title="Customer Insights"
            desc="Understand buying patterns and grow loyalty."
          />
          <Feature
            title="Sales Analytics"
            desc="Visualize profits and daily performance instantly."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Grow Your Sweet Shop?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join hundreds of shop owners using TDD Kata every day.
          </p>

          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-amber-600 rounded-xl font-bold shadow-lg hover:scale-105 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        © 2023 Sweetify · All rights reserved
      </footer>
    </div>
  )
}

/* Reusable Components */
const Stat = ({ title, value }) => (
  <div className="p-4 rounded-xl bg-white shadow text-center">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-gray-500 text-sm">{title}</div>
  </div>
)

const Feature = ({ title, desc }) => (
  <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition">
    <h3 className="text-xl font-semibold mb-3 text-gray-900">
      {title}
    </h3>
    <p className="text-gray-600">
      {desc}
    </p>
  </div>
)

export default HomePage
