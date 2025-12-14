import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sweetService } from '../../services/sweetService'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { X, Candy } from 'lucide-react'

export const SweetForm = ({ open, onClose, sweet, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: sweet || {
      name: '',
      category: '',
      price: '',
      quantity: '',
    }
  })

  useEffect(() => {
    if (sweet) reset(sweet)
  }, [sweet, reset])

  const onSubmit = async (data) => {
    try {
      if (sweet) {
        await sweetService.updateSweet(sweet.id, data)
      } else {
        await sweetService.createSweet(data)
      }
      onSuccess?.()
      reset()
      onClose()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save sweet')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Candy className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {sweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          <Input
            label="Sweet Name"
            placeholder="Chocolate Bar"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Category"
            placeholder="Chocolate"
            {...register('category', {
              required: 'Category is required',
            })}
            error={errors.category?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="99.99"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Must be greater than 0' },
                valueAsNumber: true,
              })}
              error={errors.price?.message}
            />

            <Input
              label="Quantity"
              type="number"
              min="0"
              placeholder="50"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true,
              })}
              error={errors.quantity?.message}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              {sweet ? 'Update Sweet' : 'Create Sweet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
