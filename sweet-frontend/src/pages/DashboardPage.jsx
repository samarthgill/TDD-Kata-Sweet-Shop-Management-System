import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DashboardPage = () => {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/sweets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSweets(response.data)
    } catch (error) {
      console.error('Error fetching sweets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 text-center">Loading sweets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold">{user.name}</span>
          </p>
        </div>

        {user.role === 'admin' && (
          <span className="mt-3 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
            Admin Panel
          </span>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sweets"
          value={sweets.length}
          gradient="from-amber-400 to-orange-500"
        />
        <StatCard
          title="In Stock"
          value={sweets.filter(s => s.quantity > 0).length}
          gradient="from-green-400 to-emerald-500"
        />
        <StatCard
          title="Out of Stock"
          value={sweets.filter(s => s.quantity === 0).length}
          gradient="from-red-400 to-rose-500"
        />
      </div>

      {/* SWEETS GRID */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Sweets</h2>

        {sweets.length === 0 ? (
          <p className="text-gray-500">No sweets available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                      {sweet.name}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        sweet.quantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {sweet.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Category: <span className="font-medium">{sweet.category}</span>
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xl font-extrabold text-amber-600">
                      ₹{sweet.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: <span className="font-semibold">{sweet.quantity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* STAT CARD COMPONENT */
const StatCard = ({ title, value, gradient }) => (
  <div
    className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${gradient}`}
  >
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-4xl font-extrabold mt-2">{value}</p>
  </div>
)

export default DashboardPage
