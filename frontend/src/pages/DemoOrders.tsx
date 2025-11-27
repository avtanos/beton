import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderStatus } from '../types'

const DemoOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      order_number: 'ORD-20241118-ABC12345',
      concrete_grade: 'Б25',
      volume_m3: 10.5,
      planned_time: '2024-11-18T14:00:00',
      status: OrderStatus.PENDING,
      customer_name: 'ООО "СтройКомплекс"',
      delivery_address: 'ул. Строителей, д. 15',
      vehicle_number: 'А123БВ777',
    },
    {
      id: 2,
      order_number: 'ORD-20241118-DEF67890',
      concrete_grade: 'М300',
      volume_m3: 25.0,
      planned_time: '2024-11-18T16:30:00',
      status: OrderStatus.IN_PROGRESS,
      customer_name: 'ЗАО "БетонСтрой"',
      delivery_address: 'пр. Индустриальный, д. 42',
      vehicle_number: 'В456ГД888',
    },
    {
      id: 3,
      order_number: 'ORD-20241117-GHI11223',
      concrete_grade: 'Б25',
      volume_m3: 15.0,
      planned_time: '2024-11-17T10:00:00',
      status: OrderStatus.COMPLETED,
      customer_name: 'ИП Иванов И.И.',
      delivery_address: 'ул. Заводская, д. 8',
      vehicle_number: 'С789ЕЖ999',
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    concrete_grade: '',
    volume_m3: '',
    planned_time: '',
    customer_name: '',
    delivery_address: '',
    vehicle_number: '',
  })

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

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrder = {
      id: orders.length + 1,
      order_number: `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      concrete_grade: formData.concrete_grade,
      volume_m3: parseFloat(formData.volume_m3),
      planned_time: formData.planned_time || new Date().toISOString(),
      status: OrderStatus.PENDING,
      customer_name: formData.customer_name,
      delivery_address: formData.delivery_address,
      vehicle_number: formData.vehicle_number,
    }
    setOrders([newOrder, ...orders])
    setShowCreateModal(false)
    setFormData({
      concrete_grade: '',
      volume_m3: '',
      planned_time: '',
      customer_name: '',
      delivery_address: '',
      vehicle_number: '',
    })
  }

  const handleStatusChange = (id: number, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ))
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      setOrders(orders.filter(order => order.id !== id))
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
        <div className="flex gap-2">
          <Link
            to="/demo"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Назад к разделам
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm"
          >
            + Создать заказ
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Марка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Объем (м³)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказчик
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.concrete_grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.volume_m3}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {order.status === OrderStatus.PENDING && (
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.IN_PROGRESS)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Запустить
                      </button>
                    )}
                    {order.status === OrderStatus.IN_PROGRESS && (
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Завершить
                      </button>
                    )}
                    {order.status !== OrderStatus.COMPLETED && (
                      <button
                        onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Отменить
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateOrder}>
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
                        onChange={(e) => setFormData({ ...formData, concrete_grade: e.target.value })}
                      />
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
                        onChange={(e) => setFormData({ ...formData, volume_m3: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, planned_time: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Создать
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoOrders
