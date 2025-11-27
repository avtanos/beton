import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { MonitoringDashboard } from '../types'
import { format } from 'date-fns'

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/monitoring/dashboard')
      return response.data as MonitoringDashboard
    },
    refetchInterval: 5000, // Обновление каждые 5 секунд
  })

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Дашборд</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  {data?.active_batches || 0}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Активных партий
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  {data?.pending_orders || 0}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ожидающих заказов
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  {data?.equipment_status?.filter((e) => e.is_operational).length || 0}/
                  {data?.equipment_status?.length || 0}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Оборудование работает
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-red-600">
                  {data?.low_stock_materials?.length || 0}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Низкий остаток
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Статус оборудования
            </h3>
            <div className="space-y-3">
              {data?.equipment_status?.map((equipment) => (
                <div
                  key={equipment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {equipment.equipment_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {equipment.equipment_type}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        equipment.is_operational
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {equipment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Последние партии
            </h3>
            <div className="space-y-3">
              {data?.recent_batches?.slice(0, 10).map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {batch.batch_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(batch.created_at), 'dd.MM.yyyy HH:mm')}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      batch.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : batch.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

