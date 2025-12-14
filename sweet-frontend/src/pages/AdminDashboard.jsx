import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { sweetService } from '../services/sweetService'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      const res = await sweetService.getAllSweets()
      setSweets(res.sweets || [])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowAddForm(false)
    setEditingSweet(null)
    setName('')
    setCategory('')
    setPrice('')
    setQuantity('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0
    }

    try {
      editingSweet
        ? await sweetService.updateSweet(editingSweet.id, payload)
        : await sweetService.createSweet(payload)

      resetForm()
      fetchSweets()
    } catch (err) {
      setError(err.response?.data?.error || 'Action failed')
    }
  }

  const handleEdit = (s) => {
    setEditingSweet(s)
    setShowAddForm(true)
    setName(s.name)
    setCategory(s.category)
    setPrice(s.price)
    setQuantity(s.quantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">

      {/* HEADER */}
      <header className="sticky top-0 bg-white/70 backdrop-blur shadow z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🛠 Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">{user?.name}</span>
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Sweets" value={sweets.length} />
          <StatCard label="In Stock" value={sweets.filter(s => s.quantity > 0).length} />
          <StatCard label="Out of Stock" value={sweets.filter(s => s.quantity === 0).length} />
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            + Add Sweet
          </button>
        </div>

        {/* FORM */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h3>

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <input className="input" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
              <input className="input" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
              <input className="input" type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />

              <div className="flex gap-2 col-span-full">
                <button className="btn-primary">
                  {editingSweet ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SWEETS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((s) => (
            <div key={s.id} className="bg-white/80 backdrop-blur rounded-2xl shadow hover:shadow-xl transition">
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.category}</p>

                <div className="flex justify-between text-sm">
                  <span>₹{s.price}</span>
                  <span className={s.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    Stock: {s.quantity}
                  </span>
                </div>
              </div>

              <div className="border-t p-4 flex justify-between text-sm">
                <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => sweetService.restockSweet(s.id, 10).then(fetchSweets)} className="text-green-600 hover:underline">Restock</button>
                <button onClick={() => sweetService.deleteSweet(s.id).then(fetchSweets)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

const StatCard = ({ label, value }) => (
  <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-amber-600">{value}</p>
  </div>
)

export default AdminDashboard
