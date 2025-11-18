import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'
import { QualityCheck, QualityStatus } from '../types'
import { format } from 'date-fns'

const Quality = () => {
  const { data: qualityChecks, isLoading } = useQuery({
    queryKey: ['quality'],
    queryFn: async () => {
      const response = await apiClient.get('/quality')
      return response.data as QualityCheck[]
    },
  })

  const getStatusColor = (status: QualityStatus) => {
    switch (status) {
      case QualityStatus.APPROVED:
        return 'bg-green-100 text-green-800'
      case QualityStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: QualityStatus) => {
    const labels: Record<QualityStatus, string> = {
      [QualityStatus.PENDING]: 'Ожидает проверки',
      [QualityStatus.APPROVED]: 'Одобрено',
      [QualityStatus.REJECTED]: 'Отклонено',
    }
    return labels[status]
  }

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Контроль качества</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {qualityChecks?.map((check) => (
            <li key={check.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      Партия #{check.batch_id}
                    </p>
                    <span
                      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        check.status
                      )}`}
                    >
                      {getStatusLabel(check.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(check.checked_at), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {check.mobility_cm !== null && check.mobility_cm !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500">Подвижность</p>
                      <p className="text-sm font-medium text-gray-900">
                        {check.mobility_cm} см
                      </p>
                    </div>
                  )}
                  {check.strength_mpa !== null && check.strength_mpa !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500">Прочность</p>
                      <p className="text-sm font-medium text-gray-900">
                        {check.strength_mpa} МПа
                      </p>
                    </div>
                  )}
                  {check.moisture_pct !== null && check.moisture_pct !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500">Влажность</p>
                      <p className="text-sm font-medium text-gray-900">
                        {check.moisture_pct}%
                      </p>
                    </div>
                  )}
                </div>
                {check.deviations && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Отклонения:</p>
                    <p className="text-sm text-gray-900">{check.deviations}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Quality

