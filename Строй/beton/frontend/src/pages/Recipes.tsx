import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { Recipe } from '../types'
import { useAuthStore } from '../store/authStore'

const Recipes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const canEdit = user?.role === 'technologist' || user?.role === 'admin'

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await apiClient.get('/recipes')
      return response.data as Recipe[]
    },
  })

  const createRecipeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/recipes', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setShowCreateModal(false)
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Рецептуры</h1>
        {canEdit && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Создать рецептуру
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {recipe.name}
              </h3>
              {recipe.is_gost && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ГОСТ
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-2">Код: {recipe.code}</div>
            {recipe.description && (
              <div className="text-sm text-gray-600 mb-4">{recipe.description}</div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Цемент:</span>
                <span className="font-medium">{recipe.cement_kg} кг/м³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Песок:</span>
                <span className="font-medium">{recipe.sand_kg} кг/м³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Щебень:</span>
                <span className="font-medium">{recipe.gravel_kg} кг/м³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Вода:</span>
                <span className="font-medium">{recipe.water_kg} кг/м³</span>
              </div>
              {recipe.additive1_kg > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Добавка 1:</span>
                  <span className="font-medium">{recipe.additive1_kg} кг/м³</span>
                </div>
              )}
              {recipe.additive2_kg > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Добавка 2:</span>
                  <span className="font-medium">{recipe.additive2_kg} кг/м³</span>
                </div>
              )}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Время перемешивания:</span>
                  <span>{recipe.mixing_time_sec} сек</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Версия: {recipe.version} |{' '}
              {recipe.is_active ? 'Активна' : 'Неактивна'}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateRecipeModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createRecipeMutation.mutate(data)}
          isLoading={createRecipeMutation.isPending}
        />
      )}
    </div>
  )
}

interface CreateRecipeModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
}

const CreateRecipeModal = ({
  onClose,
  onSubmit,
  isLoading,
}: CreateRecipeModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    cement_kg: '',
    sand_kg: '',
    gravel_kg: '',
    water_kg: '',
    additive1_kg: '0',
    additive2_kg: '0',
    mixing_time_sec: '120',
    discharge_time_sec: '60',
    is_gost: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      cement_kg: parseFloat(formData.cement_kg),
      sand_kg: parseFloat(formData.sand_kg),
      gravel_kg: parseFloat(formData.gravel_kg),
      water_kg: parseFloat(formData.water_kg),
      additive1_kg: parseFloat(formData.additive1_kg),
      additive2_kg: parseFloat(formData.additive2_kg),
      mixing_time_sec: parseInt(formData.mixing_time_sec),
      discharge_time_sec: parseInt(formData.discharge_time_sec),
    })
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Создать рецептуру
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Название
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Код
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Цемент (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.cement_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, cement_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Песок (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.sand_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, sand_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Щебень (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.gravel_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, gravel_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Вода (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.water_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, water_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Добавка 1 (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.additive1_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, additive1_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Добавка 2 (кг/м³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.additive2_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, additive2_kg: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Время перемешивания (сек)
                  </label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.mixing_time_sec}
                    onChange={(e) =>
                      setFormData({ ...formData, mixing_time_sec: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Время выгрузки (сек)
                  </label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.discharge_time_sec}
                    onChange={(e) =>
                      setFormData({ ...formData, discharge_time_sec: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formData.is_gost}
                      onChange={(e) =>
                        setFormData({ ...formData, is_gost: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Соответствует ГОСТ
                    </span>
                  </label>
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

export default Recipes

