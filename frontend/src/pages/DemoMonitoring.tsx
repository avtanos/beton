import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const DemoMonitoring = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  const equipment = [
    {
      id: 1,
      equipment_name: 'Весы цемента',
      equipment_type: 'scale',
      is_operational: true,
      status: 'working',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
    {
      id: 2,
      equipment_name: 'Весы песка',
      equipment_type: 'scale',
      is_operational: true,
      status: 'working',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
    {
      id: 3,
      equipment_name: 'Весы щебня',
      equipment_type: 'scale',
      is_operational: true,
      status: 'working',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
    {
      id: 4,
      equipment_name: 'Смеситель №1',
      equipment_type: 'mixer',
      is_operational: true,
      status: 'idle',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
    {
      id: 5,
      equipment_name: 'Конвейер №1',
      equipment_type: 'conveyor',
      is_operational: true,
      status: 'working',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
    {
      id: 6,
      equipment_name: 'Силос цемента №1',
      equipment_type: 'silo',
      is_operational: true,
      status: 'working',
      last_update: '2024-11-18T16:40:00',
      error_message: null,
    },
  ]

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мониторинг оборудования</h1>
        <Link
          to="/demo"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Назад к разделам
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipment.map((eq) => (
          <div key={eq.id} className="bg-white shadow rounded-lg p-6">
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
            <div className="text-sm text-gray-500 mb-2">Тип: {eq.equipment_type}</div>
            <div className="text-sm text-gray-500 mb-4">
              Обновлено:{' '}
              {lastUpdate.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
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

export default DemoMonitoring

