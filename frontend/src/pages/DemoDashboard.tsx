import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const DemoDashboard = () => {
  const [stats, setStats] = useState({
    active_batches: 3,
    pending_orders: 5,
    equipment_working: 6,
    equipment_total: 6,
    low_stock: 0,
  })

  // Имитация обновления данных каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        active_batches: Math.floor(Math.random() * 5) + 1,
        pending_orders: Math.floor(Math.random() * 10) + 1,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <Link
          to="/demo"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Назад к разделам
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">{stats.active_batches}</div>
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
                <div className="text-2xl font-bold text-gray-900">{stats.pending_orders}</div>
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
                <div className="text-2xl font-bold text-gray-900">{stats.equipment_working}/{stats.equipment_total}</div>
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
                <div className="text-2xl font-bold text-red-600">{stats.low_stock}</div>
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
              {[
                { name: 'Весы цемента', status: 'working' },
                { name: 'Смеситель №1', status: 'idle' },
                { name: 'Конвейер №1', status: 'working' },
              ].map((eq) => (
                <div
                  key={eq.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="font-medium text-gray-900">{eq.name}</div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      eq.status === 'working'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {eq.status}
                  </span>
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
              {[
                { number: 'BATCH-20241118-ABC12345', time: '18.11.2024 14:30', status: 'completed' },
                { number: 'BATCH-20241118-DEF67890', time: '18.11.2024 13:15', status: 'mixing' },
                { number: 'BATCH-20241118-GHI11223', time: '18.11.2024 12:00', status: 'completed' },
              ].map((batch) => (
                <div
                  key={batch.number}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium text-gray-900">{batch.number}</div>
                    <div className="text-sm text-gray-500">{batch.time}</div>
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

export default DemoDashboard

