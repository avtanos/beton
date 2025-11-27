import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { Batch, BatchStatus } from '../types'
import { format } from 'date-fns'

const Batches = () => {
  const queryClient = useQueryClient()

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const response = await apiClient.get('/batches')
      return response.data as Batch[]
    },
  })

  const startBatchMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.post(`/batches/${id}/start`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })

  const getStatusColor = (status: BatchStatus) => {
    switch (status) {
      case BatchStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case BatchStatus.ERROR:
        return 'bg-red-100 text-red-800'
      case BatchStatus.DOSING:
      case BatchStatus.MIXING:
      case BatchStatus.DISCHARGING:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: BatchStatus) => {
    const labels: Record<BatchStatus, string> = {
      [BatchStatus.PLANNED]: 'Запланирована',
      [BatchStatus.DOSING]: 'Дозирование',
      [BatchStatus.MIXING]: 'Перемешивание',
      [BatchStatus.DISCHARGING]: 'Выгрузка',
      [BatchStatus.COMPLETED]: 'Завершена',
      [BatchStatus.ERROR]: 'Ошибка',
    }
    return labels[status]
  }

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Производственные партии</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {batches?.map((batch) => (
            <li key={batch.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {batch.batch_number}
                    </p>
                    <span
                      className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {getStatusLabel(batch.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {batch.created_at &&
                      format(new Date(batch.created_at), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Объем: {batch.volume_m3} м³ | Заказ: #{batch.order_id}
                  </p>
                  {batch.actual_cement_kg && (
                    <div className="mt-2 text-xs text-gray-400">
                      Факт: Цемент {batch.actual_cement_kg.toFixed(1)} кг
                      {batch.deviation_cement_pct && (
                        <span
                          className={`ml-2 ${
                            Math.abs(batch.deviation_cement_pct) > 2
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          ({batch.deviation_cement_pct > 0 ? '+' : ''}
                          {batch.deviation_cement_pct.toFixed(2)}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {batch.status === BatchStatus.PLANNED && (
                  <div className="mt-4">
                    <button
                      onClick={() => startBatchMutation.mutate(batch.id)}
                      disabled={startBatchMutation.isPending}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm disabled:opacity-50"
                    >
                      Запустить производство
                    </button>
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

export default Batches

