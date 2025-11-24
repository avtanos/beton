import { useState } from 'react'
import { Link } from 'react-router-dom'

const DemoWarehouse = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      material_type: 'cement',
      material_name: 'Цемент ПЦ 500',
      storage_location: 'Силос №1',
      current_stock_kg: 50000,
      min_stock_kg: 10000,
      max_stock_kg: 100000,
      moisture_pct: 0,
    },
    {
      id: 2,
      material_type: 'sand',
      material_name: 'Песок речной',
      storage_location: 'Бункер №1',
      current_stock_kg: 150000,
      min_stock_kg: 30000,
      max_stock_kg: 200000,
      moisture_pct: 5.2,
    },
    {
      id: 3,
      material_type: 'gravel',
      material_name: 'Щебень гранитный 20-40',
      storage_location: 'Бункер №2',
      current_stock_kg: 200000,
      min_stock_kg: 50000,
      max_stock_kg: 300000,
      moisture_pct: 0,
    },
    {
      id: 4,
      material_type: 'water',
      material_name: 'Вода техническая',
      storage_location: 'Емкость №1',
      current_stock_kg: 50000,
      min_stock_kg: 10000,
      max_stock_kg: 100000,
      moisture_pct: 0,
    },
    {
      id: 5,
      material_type: 'additive1',
      material_name: 'Пластификатор С-3',
      storage_location: 'Емкость №2',
      current_stock_kg: 5000,
      min_stock_kg: 1000,
      max_stock_kg: 10000,
      moisture_pct: 0,
    },
  ])

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<typeof materials[0] | null>(null)
  const [editData, setEditData] = useState({
    current_stock_kg: '',
    min_stock_kg: '',
    moisture_pct: '',
  })

  const getStockStatus = (material: typeof materials[0]) => {
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

  const handleEdit = (material: typeof materials[0]) => {
    setEditingMaterial(material)
    setEditData({
      current_stock_kg: material.current_stock_kg.toString(),
      min_stock_kg: material.min_stock_kg.toString(),
      moisture_pct: material.moisture_pct.toString(),
    })
    setShowEditModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id 
          ? {
              ...m,
              current_stock_kg: parseFloat(editData.current_stock_kg),
              min_stock_kg: parseFloat(editData.min_stock_kg),
              moisture_pct: parseFloat(editData.moisture_pct),
            }
          : m
      ))
      setShowEditModal(false)
      setEditingMaterial(null)
    }
  }

  const handleAddStock = (id: number, amount: number) => {
    setMaterials(materials.map(m => 
      m.id === id 
        ? { ...m, current_stock_kg: Math.min(m.current_stock_kg + amount, m.max_stock_kg || Infinity) }
        : m
    ))
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Склад сырья</h1>
        <Link
          to="/demo"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Назад к разделам
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
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
              <div className="space-y-2 mb-4">
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
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(material)}
                  className="flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleAddStock(material.id, 10000)}
                  className="flex-1 text-sm bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100"
                >
                  +10т
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showEditModal && editingMaterial && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdate}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Редактировать: {editingMaterial.material_name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Текущий остаток (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={editData.current_stock_kg}
                        onChange={(e) => setEditData({ ...editData, current_stock_kg: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Минимальный остаток (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={editData.min_stock_kg}
                        onChange={(e) => setEditData({ ...editData, min_stock_kg: e.target.value })}
                      />
                    </div>
                    {editingMaterial.moisture_pct >= 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Влажность (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={editData.moisture_pct}
                          onChange={(e) => setEditData({ ...editData, moisture_pct: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
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

export default DemoWarehouse
