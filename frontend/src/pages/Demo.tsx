import { Link } from 'react-router-dom'

const Demo = () => {
  const sections = [
    {
      title: 'Дашборд',
      path: '/demo/dashboard',
      description: 'Обзор производства и ключевые метрики',
      icon: '📊',
    },
    {
      title: 'Заказы',
      path: '/demo/orders',
      description: 'Управление заказами на производство',
      icon: '📋',
    },
    {
      title: 'Рецептуры',
      path: '/demo/recipes',
      description: 'Управление рецептурами бетона',
      icon: '📖',
    },
    {
      title: 'Партии',
      path: '/demo/batches',
      description: 'Производственные партии',
      icon: '🏭',
    },
    {
      title: 'Склад',
      path: '/demo/warehouse',
      description: 'Управление складом сырья',
      icon: '📦',
    },
    {
      title: 'Качество',
      path: '/demo/quality',
      description: 'Контроль качества продукции',
      icon: '✅',
    },
    {
      title: 'Мониторинг',
      path: '/demo/monitoring',
      description: 'Мониторинг оборудования',
      icon: '🖥️',
    },
    {
      title: 'Цикл производства',
      path: '/demo/cycle',
      description: 'Визуализация цикла производства с IoT и AI',
      icon: '🔄',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            АСУ ТП Бетонного завода
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Демонстрационный режим
          </p>
          <p className="text-sm text-gray-500">
            Выберите раздел для просмотра
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-primary-500"
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
                <div className="text-primary-500 ml-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
          >
            Войти в систему
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Demo

