import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { sweetService } from '../../services/sweetService'
import { formatPrice } from '../../lib/utils'
import { Package, AlertCircle, Pencil, Trash2, ShoppingBag } from 'lucide-react'

export const SweetCard = ({ sweet, onUpdate, onDelete }) => {
  const { user, isAdmin } = useAuth()
  const [isPurchasing, setIsPurchasing] = React.useState(false)

  const handlePurchase = async () => {
    if (!user) {
      alert('Please login to purchase')
      return
    }

    if (sweet.quantity === 0) {
      alert('This item is out of stock')
      return
    }

    setIsPurchasing(true)
    try {
      await sweetService.purchaseSweet(sweet.id, { quantity: 1 })
      alert('Purchase successful!')
      onUpdate?.()
    } catch (error) {
      alert(error.response?.data?.error || 'Purchase failed')
    } finally {
      setIsPurchasing(false)
    }
  }

  const stockPercent = Math.min((sweet.quantity / 20) * 100, 100)

  return (
    <Card className="group overflow-hidden border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition">
              {sweet.name}
            </h3>
            <span className="inline-block mt-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700">
              {sweet.category}
            </span>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-white font-semibold text-sm shadow">
            {formatPrice(sweet.price)}
          </div>
        </div>

        {/* Stock Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Stock: {sweet.quantity}</span>
            </div>
            {sweet.quantity === 0 && (
              <span className="text-red-600 font-medium">Unavailable</span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full transition-all ${
                sweet.quantity === 0
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}
              style={{ width: `${stockPercent}%` }}
            />
          </div>

          {sweet.quantity === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              Out of stock
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="flex w-full gap-2">
          <Button
            onClick={handlePurchase}
            disabled={!user || sweet.quantity === 0 || isPurchasing}
            isLoading={isPurchasing}
            className="flex-1 flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {sweet.quantity === 0 ? 'Sold Out' : 'Buy Now'}
          </Button>

          {isAdmin() && (
            <>
              <Button
                variant="outline"
                onClick={() => onUpdate?.(sweet)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="danger"
                onClick={() => onDelete?.(sweet.id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
