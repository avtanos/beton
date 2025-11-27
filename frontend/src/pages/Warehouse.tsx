import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { WarehouseMaterial } from '../types'

const Warehouse = () => {
  const { data: materials, isLoading } = useQuery({
    queryKey: ['warehouse'],
    queryFn: async () => {
      const response = await apiClient.get('/warehouse')
      return response.data as WarehouseMaterial[]
    },
  })

  const getStockStatus = (material: WarehouseMaterial) => {
    if (material.current_stock_kg <= material.min_stock_kg) {
      return { color: 'text-red-600', label: 'Критический остаток' }
    }
    if (material.max_stock_kg) {
      const percentage = (material.current_stock_kg / material.max_stock_kg) * 100
      if (percentage < 30) {
        return { color: 'text-yellow-600', label: 'Низкий остаток' }
      }
    }
    return { color: 'text-green-600', label: 'Норма' }
  }

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Склад сырья</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials?.map((material) => {
          const stockStatus = getStockStatus(material)
          const percentage = material.max_stock_kg
            ? (material.current_stock_kg / material.max_stock_kg) * 100
            : 0

          return (
            <div key={material.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {material.material_name}
                </h3>
                <span className={`text-sm font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Тип: {material.material_type}
              </div>
              {material.storage_location && (
                <div className="text-sm text-gray-500 mb-4">
                  Место: {material.storage_location}
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Текущий остаток:</span>
                  <span className="font-medium">
                    {material.current_stock_kg.toFixed(1)} кг
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Минимальный:</span>
                  <span className="font-medium">
                    {material.min_stock_kg.toFixed(1)} кг
                  </span>
                </div>
                {material.max_stock_kg && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Максимальный:</span>
                    <span className="font-medium">
                      {material.max_stock_kg.toFixed(1)} кг
                    </span>
                  </div>
                )}
                {material.moisture_pct > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Влажность:</span>
                    <span className="font-medium">
                      {material.moisture_pct.toFixed(2)}%
                    </span>
                  </div>
                )}
                {material.max_stock_kg && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage < 30
                            ? 'bg-red-500'
                            : percentage < 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Warehouse

