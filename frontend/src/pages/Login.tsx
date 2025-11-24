import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Тестовые пользователи для быстрого входа
const TEST_USERS = [
  { username: 'admin', password: 'admin123', role: 'Администратор', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { username: 'head', password: 'head123', role: 'Начальник производства', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  { username: 'master', password: 'master123', role: 'Мастер смены', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { username: 'operator', password: 'operator123', role: 'Оператор АСУ ТП', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { username: 'technologist', password: 'tech123', role: 'Технолог', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { username: 'lab', password: 'lab123', role: 'Лаборант', color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300' },
  { username: 'logistics', password: 'log123', role: 'Логист', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
]

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleQuickLogin = async (testUser: typeof TEST_USERS[0]) => {
    setUsername(testUser.username)
    setPassword(testUser.password)
    setError('')
    setLoading(true)

    try {
      await login(testUser.username, testUser.password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            АСУ ТП Бетонного завода
          </p>
          <div className="mt-4 text-center">
            <Link
              to="/demo"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Демонстрационный режим →
            </Link>
          </div>
        </div>

        {/* Быстрый вход для тестовых пользователей */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Быстрый вход (тестовые пользователи):</p>
          <div className="grid grid-cols-2 gap-2">
            {TEST_USERS.map((user) => (
              <button
                key={user.username}
                type="button"
                onClick={() => handleQuickLogin(user)}
                disabled={loading}
                className={`${user.color} border-2 rounded-lg p-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="font-semibold">{user.role}</div>
                <div className="text-gray-600">{user.username}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Или войдите вручную</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Имя пользователя
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

