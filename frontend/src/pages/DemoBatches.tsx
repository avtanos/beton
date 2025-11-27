import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BatchStatus } from '../types'

const DemoBatches = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      batch_number: 'BATCH-20241118-ABC12345',
      order_id: 1,
      recipe_id: 1,
      volume_m3: 10.5,
      status: BatchStatus.PLANNED,
      actual_cement_kg: null as number | null,
      actual_sand_kg: null as number | null,
      actual_gravel_kg: null as number | null,
      actual_water_kg: null as number | null,
      deviation_cement_pct: null as number | null,
      created_at: '2024-11-18T14:00:00',
      started_at: null as string | null,
      completed_at: null as string | null,
    },
    {
      id: 2,
      batch_number: 'BATCH-20241118-DEF67890',
      order_id: 2,
      recipe_id: 2,
      volume_m3: 25.0,
      status: BatchStatus.DOSING,
      actual_cement_kg: null,
      actual_sand_kg: null,
      actual_gravel_kg: null,
      actual_water_kg: null,
      deviation_cement_pct: null,
      created_at: '2024-11-18T16:30:00',
      started_at: '2024-11-18T16:30:00',
      completed_at: null,
    },
    {
      id: 3,
      batch_number: 'BATCH-20241118-GHI11223',
      order_id: 3,
      recipe_id: 1,
      volume_m3: 15.0,
      status: BatchStatus.COMPLETED,
      actual_cement_kg: 3675,
      actual_sand_kg: 6300,
      actual_gravel_kg: 12600,
      actual_water_kg: 1890,
      deviation_cement_pct: 0.5,
      created_at: '2024-11-18T10:00:00',
      started_at: '2024-11-18T10:00:00',
      completed_at: '2024-11-18T10:25:00',
    },
  ])

  const [showDosingModal, setShowDosingModal] = useState(false)
  const [currentBatch, setCurrentBatch] = useState<number | null>(null)
  const [dosingData, setDosingData] = useState({
    actual_cement: '',
    actual_sand: '',
    actual_gravel: '',
    actual_water: '',
  })

  // Автоматическое продвижение процесса
  useEffect(() => {
    const interval = setInterval(() => {
      setBatches(prevBatches => 
        prevBatches.map(batch => {
          if (batch.status === BatchStatus.DOSING) {
            // Через 5 секунд переходим к перемешиванию
            return { ...batch, status: BatchStatus.MIXING }
          }
          if (batch.status === BatchStatus.MIXING) {
            // Через 10 секунд переходим к выгрузке
            return { ...batch, status: BatchStatus.DISCHARGING }
          }
          if (batch.status === BatchStatus.DISCHARGING) {
            // Через 5 секунд завершаем
            return { 
              ...batch, 
              status: BatchStatus.COMPLETED,
              completed_at: new Date().toISOString()
            }
          }
          return batch
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

  const handleStartBatch = (id: number) => {
    setBatches(batches.map(batch => 
      batch.id === id 
        ? { ...batch, status: BatchStatus.DOSING, started_at: new Date().toISOString() }
        : batch
    ))
  }

  const handleCompleteDosing = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentBatch) {
      const batch = batches.find(b => b.id === currentBatch)
      if (batch) {
        const planned_cement = 350 * batch.volume_m3

        const actual_cement = parseFloat(dosingData.actual_cement)
        const actual_sand = parseFloat(dosingData.actual_sand)
        const actual_gravel = parseFloat(dosingData.actual_gravel)
        const actual_water = parseFloat(dosingData.actual_water)

        const deviation_cement = ((actual_cement - planned_cement) / planned_cement) * 100

        setBatches(batches.map(b => 
          b.id === currentBatch 
            ? { 
                ...b, 
                status: BatchStatus.MIXING,
                actual_cement_kg: actual_cement,
                actual_sand_kg: actual_sand,
                actual_gravel_kg: actual_gravel,
                actual_water_kg: actual_water,
                deviation_cement_pct: deviation_cement,
              }
            : b
        ))
      }
    }
    setShowDosingModal(false)
    setDosingData({ actual_cement: '', actual_sand: '', actual_gravel: '', actual_water: '' })
    setCurrentBatch(null)
  }

  const openDosingModal = (id: number) => {
    setCurrentBatch(id)
    setShowDosingModal(true)
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Производственные партии</h1>
        <Link
          to="/demo"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Назад к разделам
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер партии
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Объем (м³)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отклонение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.batch_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.volume_m3} м³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {getStatusLabel(batch.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.deviation_cement_pct !== null ? (
                      <span className={batch.deviation_cement_pct > 2 ? 'text-red-600' : 'text-green-600'}>
                        {batch.deviation_cement_pct > 0 ? '+' : ''}
                        {batch.deviation_cement_pct.toFixed(2)}%
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {batch.status === BatchStatus.PLANNED && (
                      <button
                        onClick={() => handleStartBatch(batch.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Запустить
                      </button>
                    )}
                    {batch.status === BatchStatus.DOSING && (
                      <button
                        onClick={() => openDosingModal(batch.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Завершить дозирование
                      </button>
                    )}
                    {batch.status === BatchStatus.COMPLETED && (
                      <span className="text-gray-400">Завершено</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDosingModal && currentBatch && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDosingModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCompleteDosing}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Завершение дозирования
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Цемент (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={dosingData.actual_cement}
                        onChange={(e) => setDosingData({ ...dosingData, actual_cement: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Песок (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={dosingData.actual_sand}
                        onChange={(e) => setDosingData({ ...dosingData, actual_sand: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Щебень (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={dosingData.actual_gravel}
                        onChange={(e) => setDosingData({ ...dosingData, actual_gravel: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Вода (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={dosingData.actual_water}
                        onChange={(e) => setDosingData({ ...dosingData, actual_water: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Завершить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDosingModal(false)}
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

export default DemoBatches
