import { useState } from 'react'
import { Link } from 'react-router-dom'

const DemoRecipes = () => {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Бетон Б25',
      code: 'B25',
      description: 'Бетон марки Б25 по ГОСТ',
      cement_kg: 350,
      sand_kg: 600,
      gravel_kg: 1200,
      water_kg: 180,
      additive1_kg: 2.5,
      additive2_kg: 0,
      mixing_time_sec: 120,
      discharge_time_sec: 60,
      is_gost: true,
      version: 1,
      is_active: true,
    },
    {
      id: 2,
      name: 'Бетон М300',
      code: 'M300',
      description: 'Бетон марки М300',
      cement_kg: 400,
      sand_kg: 650,
      gravel_kg: 1150,
      water_kg: 200,
      additive1_kg: 3.0,
      additive2_kg: 0,
      mixing_time_sec: 150,
      discharge_time_sec: 60,
      is_gost: true,
      version: 1,
      is_active: true,
    },
    {
      id: 3,
      name: 'Бетон М400',
      code: 'M400',
      description: 'Высокопрочный бетон М400',
      cement_kg: 450,
      sand_kg: 600,
      gravel_kg: 1100,
      water_kg: 180,
      additive1_kg: 4.0,
      additive2_kg: 1.5,
      mixing_time_sec: 180,
      discharge_time_sec: 60,
      is_gost: false,
      version: 2,
      is_active: true,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<typeof recipes[0] | null>(null)
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const newRecipe = {
      id: recipes.length + 1,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      cement_kg: parseFloat(formData.cement_kg),
      sand_kg: parseFloat(formData.sand_kg),
      gravel_kg: parseFloat(formData.gravel_kg),
      water_kg: parseFloat(formData.water_kg),
      additive1_kg: parseFloat(formData.additive1_kg),
      additive2_kg: parseFloat(formData.additive2_kg),
      mixing_time_sec: parseInt(formData.mixing_time_sec),
      discharge_time_sec: parseInt(formData.discharge_time_sec),
      is_gost: formData.is_gost,
      version: 1,
      is_active: true,
    }
    setRecipes([...recipes, newRecipe])
    setShowCreateModal(false)
    setFormData({
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
  }

  const handleEdit = (recipe: typeof recipes[0]) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      code: recipe.code,
      description: recipe.description,
      cement_kg: recipe.cement_kg.toString(),
      sand_kg: recipe.sand_kg.toString(),
      gravel_kg: recipe.gravel_kg.toString(),
      water_kg: recipe.water_kg.toString(),
      additive1_kg: recipe.additive1_kg.toString(),
      additive2_kg: recipe.additive2_kg.toString(),
      mixing_time_sec: recipe.mixing_time_sec.toString(),
      discharge_time_sec: recipe.discharge_time_sec.toString(),
      is_gost: recipe.is_gost,
    })
    setShowEditModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRecipe) {
      setRecipes(recipes.map(r => 
        r.id === editingRecipe.id 
          ? {
              ...r,
              name: formData.name,
              code: formData.code,
              description: formData.description,
              cement_kg: parseFloat(formData.cement_kg),
              sand_kg: parseFloat(formData.sand_kg),
              gravel_kg: parseFloat(formData.gravel_kg),
              water_kg: parseFloat(formData.water_kg),
              additive1_kg: parseFloat(formData.additive1_kg),
              additive2_kg: parseFloat(formData.additive2_kg),
              mixing_time_sec: parseInt(formData.mixing_time_sec),
              discharge_time_sec: parseInt(formData.discharge_time_sec),
              is_gost: formData.is_gost,
              version: r.version + 1,
            }
          : r
      ))
      setShowEditModal(false)
      setEditingRecipe(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту рецептуру?')) {
      setRecipes(recipes.filter(r => r.id !== id))
    }
  }

  const handleToggleActive = (id: number) => {
    setRecipes(recipes.map(r => 
      r.id === id ? { ...r, is_active: !r.is_active } : r
    ))
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Рецептуры</h1>
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
            + Создать рецептуру
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
              <div className="flex gap-2">
                {recipe.is_gost && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ГОСТ
                  </span>
                )}
                <button
                  onClick={() => handleToggleActive(recipe.id)}
                  className={`px-2 py-1 text-xs rounded ${
                    recipe.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {recipe.is_active ? 'Активна' : 'Неактивна'}
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-2">Код: {recipe.code}</div>
            {recipe.description && (
              <div className="text-sm text-gray-600 mb-4">{recipe.description}</div>
            )}
            <div className="space-y-2 text-sm mb-4">
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
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(recipe)}
                className="flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(recipe.id)}
                className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <RecipeModal
          title="Создать рецептуру"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && editingRecipe && (
        <RecipeModal
          title="Редактировать рецептуру"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false)
            setEditingRecipe(null)
          }}
        />
      )}
    </div>
  )
}

interface RecipeModalProps {
  title: string
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

const RecipeModal = ({ title, formData, setFormData, onSubmit, onClose }: RecipeModalProps) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={onSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {title}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, cement_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, sand_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, gravel_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, water_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, additive1_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, additive2_kg: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, mixing_time_sec: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, discharge_time_sec: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={formData.is_gost}
                      onChange={(e) => setFormData({ ...formData, is_gost: e.target.checked })}
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
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                Сохранить
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

export default DemoRecipes
