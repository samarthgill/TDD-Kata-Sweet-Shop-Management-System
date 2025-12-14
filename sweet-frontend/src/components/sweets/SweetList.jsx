import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sweetService } from '../../services/sweetService'
import { SweetCard } from './SweetCard'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Search, RefreshCw, Package } from 'lucide-react'

export const SweetList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const { data: sweets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['sweets'],
    queryFn: sweetService.getAllSweets,
  })

  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch =
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || sweet.category === categoryFilter
    const matchesMinPrice = !minPrice || sweet.price >= parseFloat(minPrice)
    const matchesMaxPrice = !maxPrice || sweet.price <= parseFloat(maxPrice)
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
  })

  const categories = [...new Set(sweets.map(sweet => sweet.category))]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center">
        <p className="text-sm text-red-800">Error loading sweets: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Min Price */}
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />

            {/* Max Price */}
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Filters info */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredSweets.length} of {sweets.length} sweets
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setMinPrice('')
                setMaxPrice('')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sweets Grid */}
      {filteredSweets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-2">
            <Package className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">No sweets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onUpdate={refetch}
              onDelete={refetch}
            />
          ))}
        </div>
      )}
    </div>
  )
}
