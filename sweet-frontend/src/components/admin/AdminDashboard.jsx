import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sweetService } from '../../services/sweetService'
import { useAuth } from '../../contexts/AuthContext'
import { SweetList } from '../sweets/SweetList'
import { SweetForm } from './SweetForm'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Plus, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatPrice } from '../../lib/utils'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [selectedSweet, setSelectedSweet] = useState(null)

  const { data: sweets = [], refetch } = useQuery({
    queryKey: ['sweets'],
    queryFn: sweetService.getAllSweets,
  })

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Admin privileges required</p>
      </div>
    )
  }

  const stats = {
    totalSweets: sweets.length,
    totalValue: sweets.reduce((sum, sweet) => sum + sweet.price * sweet.quantity, 0),
    lowStock: sweets.filter(s => s.quantity > 0 && s.quantity < 10).length,
    outOfStock: sweets.filter(s => s.quantity === 0).length,
  }

  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedSweet(null)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-medium">{user.name}</span>
          </p>
        </div>

        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Sweet
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sweets"
          value={stats.totalSweets}
          icon={<Package />}
          gradient="from-amber-400 to-orange-500"
        />

        <StatCard
          title="Inventory Value"
          value={formatPrice(stats.totalValue)}
          icon={<DollarSign />}
          gradient="from-green-400 to-emerald-600"
        />

        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={<TrendingUp />}
          gradient="from-yellow-400 to-orange-400"
        />

        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={<Package />}
          gradient="from-red-400 to-rose-600"
        />
      </div>

      {/* Sweet Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Sweet Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <SweetList onEdit={handleEditSweet} />
        </CardContent>
      </Card>

      {/* Add / Edit Sweet Modal */}
      <SweetForm
        open={showForm}
        onClose={handleCloseForm}
        sweet={selectedSweet}
        onSuccess={() => {
          refetch()
          handleCloseForm()
        }}
      />
    </div>
  )
}

/* 🔹 Reusable Stat Card */
const StatCard = ({ title, value, icon, gradient }) => {
  return (
    <div className={`rounded-xl p-[1px] bg-gradient-to-r ${gradient}`}>
      <Card className="rounded-xl">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-gray-100 text-gray-700">
            {icon}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
