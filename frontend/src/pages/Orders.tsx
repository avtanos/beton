import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { Order, OrderStatus, Recipe } from '../types'
import { format } from 'date-fns'

const Orders = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders')
      return response.data as Order[]
    },
  })

  const { data: recipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await apiClient.get('/recipes?is_active=true')
      return response.data as Recipe[]
    },
  })

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/orders', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setShowCreateModal(false)
    },
  })

  // const updateOrderMutation = useMutation({
  //   mutationFn: async ({ id, data }: { id: number; data: any }) => {
  //     const response = await apiClient.patch(`/orders/${id}`, data)
  //     return response.data
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['orders'] })
  //   },
  // })

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case OrderStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Ожидает',
      [OrderStatus.IN_PROGRESS]: 'В производстве',
      [OrderStatus.COMPLETED]: 'Выполнен',
      [OrderStatus.CANCELLED]: 'Отменен',
    }
    return labels[status]
  }

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Создать заказ
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders?.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {order.order_number}
                    </p>
                    <span
                      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.planned_time &&
                      format(new Date(order.planned_time), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Марка: {order.concrete_grade}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Объем: {order.volume_m3} м³
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {order.customer_name && (
                      <p className="mr-4">Заказчик: {order.customer_name}</p>
                    )}
                    {order.vehicle_number && (
                      <p>Машина: {order.vehicle_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showCreateModal && (
        <CreateOrderModal
          recipes={recipes || []}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createOrderMutation.mutate(data)}
          isLoading={createOrderMutation.isPending}
        />
      )}
    </div>
  )
}

interface CreateOrderModalProps {
  recipes: Recipe[]
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
}

const CreateOrderModal = ({
  recipes,
  onClose,
  onSubmit,
  isLoading,
}: CreateOrderModalProps) => {
  const [formData, setFormData] = useState({
    concrete_grade: '',
    volume_m3: '',
    recipe_id: '',
    planned_time: '',
    customer_name: '',
    delivery_address: '',
    vehicle_number: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      volume_m3: parseFloat(formData.volume_m3),
      recipe_id: parseInt(formData.recipe_id),
      planned_time: formData.planned_time || undefined,
    })
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Создать заказ
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Марка бетона
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.concrete_grade}
                    onChange={(e) =>
                      setFormData({ ...formData, concrete_grade: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Рецептура
                  </label>
                  <select
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.recipe_id}
                    onChange={(e) =>
                      setFormData({ ...formData, recipe_id: e.target.value })
                    }
                  >
                    <option value="">Выберите рецептуру</option>
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} ({recipe.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Объем (м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.volume_m3}
                    onChange={(e) =>
                      setFormData({ ...formData, volume_m3: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Планируемое время
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.planned_time}
                    onChange={(e) =>
                      setFormData({ ...formData, planned_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Заказчик
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Адрес доставки
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.delivery_address}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Номер машины
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.vehicle_number}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Создание...' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Orders

