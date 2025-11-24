import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { User, UserRole } from '../types'

const Users = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/users')
      return response.data as User[]
    },
  })

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      [UserRole.OPERATOR]: 'Оператор АСУ ТП',
      [UserRole.TECHNOLOGIST]: 'Технолог',
      [UserRole.SHIFT_MASTER]: 'Мастер смены',
      [UserRole.LABORATORY]: 'Лаборант',
      [UserRole.PRODUCTION_HEAD]: 'Начальник производства',
      [UserRole.LOGISTICS]: 'Логист/диспетчер',
      [UserRole.ADMIN]: 'Администратор',
    }
    return labels[role]
  }

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Пользователи</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users?.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-sm text-gray-500">{user.username}</p>
                    {user.email && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Users

