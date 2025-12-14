import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { sweetService } from '../services/sweetService'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      const response = await sweetService.getAllSweets()
      setSweets(response.sweets || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchTerm) params.name = searchTerm
      if (categoryFilter) params.category = categoryFilter
      if (minPrice) params.min_price = minPrice
      if (maxPrice) params.max_price = maxPrice

      const response = await sweetService.searchSweets(params)
      setSweets(response.sweets || [])
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (id, name) => {
    const qty = prompt(`How many ${name} would you like to buy?`)
    if (!qty || isNaN(qty) || qty <= 0) return alert('Invalid quantity')

    try {
      await sweetService.purchaseSweet(id, parseInt(qty))
      fetchSweets()
      alert(`🎉 Purchased ${qty} ${name}(s)!`)
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed')
    }
  }

  const categories = [...new Set(sweets.map(s => s.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">

      {/* HEADER */}
      <header className="sticky top-0 bg-white/70 backdrop-blur-md shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🍭 TDD Kata Sweet Shop
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
            <button
              onClick={() => {
                const confirmLogout = window.confirm("Are you sure you want to logout?")
                if (confirmLogout) {
                  logout()                  // Clear session / token
                  window.location.href = '/' // Redirect to login page
                }
              }}
              className="px-4 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SEARCH PANEL */}
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Find Your Sweet 🍬</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input"
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {sweets.length} sweets available
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="btn-primary"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('')
                  setMinPrice('')
                  setMaxPrice('')
                  fetchSweets()
                }}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* SWEETS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <div
              key={sweet.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{sweet.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                    ₹{sweet.price}
                  </span>
                </div>

                <p className="text-sm text-gray-500">{sweet.category}</p>

                <p className={`text-sm font-medium ${
                  sweet.quantity > 10 ? 'text-green-600'
                  : sweet.quantity > 0 ? 'text-yellow-600'
                  : 'text-red-600'
                }`}>
                  Stock: {sweet.quantity}
                </p>
              </div>

              <div className="p-4 border-t">
                <button
                  disabled={sweet.quantity === 0}
                  onClick={() => handlePurchase(sweet.id, sweet.name)}
                  className={`w-full py-2 rounded-xl font-semibold ${
                    sweet.quantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02]'
                  }`}
                >
                  {sweet.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default CustomerDashboard
