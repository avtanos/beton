import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { EquipmentStatus } from '../types'
import { format } from 'date-fns'

const Monitoring = () => {
  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await apiClient.get('/monitoring/equipment')
      return response.data as EquipmentStatus[]
    },
    refetchInterval: 5000, // Обновление каждые 5 секунд
  })

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  const getStatusColor = (status: string, isOperational: boolean) => {
    if (!isOperational) return 'bg-red-100 text-red-800'
    switch (status.toLowerCase()) {
      case 'working':
        return 'bg-green-100 text-green-800'
      case 'idle':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мониторинг оборудования</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipment?.map((eq) => (
          <div
            key={eq.id}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {eq.equipment_name}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  eq.status,
                  eq.is_operational
                )}`}
              >
                {eq.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Тип: {eq.equipment_type}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Обновлено:{' '}
              {format(new Date(eq.last_update), 'dd.MM.yyyy HH:mm:ss')}
            </div>
            {eq.error_message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{eq.error_message}</p>
              </div>
            )}
            <div className="mt-4">
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    eq.is_operational ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {eq.is_operational ? 'Работает' : 'Не работает'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Monitoring

