import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QualityStatus } from '../types'

const DemoQuality = () => {
  const [qualityChecks, setQualityChecks] = useState([
    {
      id: 1,
      batch_id: 1,
      mobility_cm: 12.5,
      strength_mpa: 28.5,
      moisture_pct: 5.2,
      deviations: null as string | null,
      status: QualityStatus.APPROVED,
      checked_at: '2024-11-18T14:30:00',
    },
    {
      id: 2,
      batch_id: 2,
      mobility_cm: 10.0,
      strength_mpa: null as number | null,
      moisture_pct: 4.8,
      deviations: 'Требуется дополнительная проверка прочности',
      status: QualityStatus.PENDING,
      checked_at: '2024-11-18T16:35:00',
    },
    {
      id: 3,
      batch_id: 3,
      mobility_cm: 8.5,
      strength_mpa: 30.2,
      moisture_pct: 5.0,
      deviations: null,
      status: QualityStatus.APPROVED,
      checked_at: '2024-11-17T10:15:00',
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCheck, setEditingCheck] = useState<typeof qualityChecks[0] | null>(null)
  const [formData, setFormData] = useState({
    batch_id: '',
    mobility_cm: '',
    strength_mpa: '',
    moisture_pct: '',
    deviations: '',
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const newCheck = {
      id: qualityChecks.length + 1,
      batch_id: parseInt(formData.batch_id),
      mobility_cm: formData.mobility_cm ? parseFloat(formData.mobility_cm) : null,
      strength_mpa: formData.strength_mpa ? parseFloat(formData.strength_mpa) : null,
      moisture_pct: formData.moisture_pct ? parseFloat(formData.moisture_pct) : null,
      deviations: formData.deviations || null,
      status: QualityStatus.PENDING,
      checked_at: new Date().toISOString(),
    }
    setQualityChecks([newCheck, ...qualityChecks])
    setShowCreateModal(false)
    setFormData({
      batch_id: '',
      mobility_cm: '',
      strength_mpa: '',
      moisture_pct: '',
      deviations: '',
    })
  }

  const handleEdit = (check: typeof qualityChecks[0]) => {
    setEditingCheck(check)
    setFormData({
      batch_id: check.batch_id.toString(),
      mobility_cm: check.mobility_cm?.toString() || '',
      strength_mpa: check.strength_mpa?.toString() || '',
      moisture_pct: check.moisture_pct?.toString() || '',
      deviations: check.deviations || '',
    })
    setShowEditModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCheck) {
      setQualityChecks(qualityChecks.map(c => 
        c.id === editingCheck.id 
          ? {
              ...c,
              mobility_cm: formData.mobility_cm ? parseFloat(formData.mobility_cm) : null,
              strength_mpa: formData.strength_mpa ? parseFloat(formData.strength_mpa) : null,
              moisture_pct: formData.moisture_pct ? parseFloat(formData.moisture_pct) : null,
              deviations: formData.deviations || null,
            }
          : c
      ))
      setShowEditModal(false)
      setEditingCheck(null)
    }
  }

  const handleStatusChange = (id: number, status: QualityStatus) => {
    setQualityChecks(qualityChecks.map(c => 
      c.id === id ? { ...c, status } : c
    ))
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Контроль качества</h1>
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
            + Создать проверку
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Партия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Подвижность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прочность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Влажность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qualityChecks.map((check) => (
                <tr key={check.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{check.batch_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {check.mobility_cm !== null ? `${check.mobility_cm} см` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {check.strength_mpa !== null ? `${check.strength_mpa} МПа` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {check.moisture_pct !== null ? `${check.moisture_pct}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        check.status
                      )}`}
                    >
                      {getStatusLabel(check.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(check)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                    {check.status === QualityStatus.PENDING && (
                      <>
                        <button
                          onClick={() => handleStatusChange(check.id, QualityStatus.APPROVED)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleStatusChange(check.id, QualityStatus.REJECTED)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showCreateModal || showEditModal) && (
        <QualityModal
          title={showCreateModal ? 'Создать проверку качества' : 'Редактировать проверку'}
          formData={formData}
          setFormData={setFormData}
          onSubmit={showCreateModal ? handleCreate : handleUpdate}
          onClose={() => {
            setShowCreateModal(false)
            setShowEditModal(false)
            setEditingCheck(null)
          }}
        />
      )}
    </div>
  )
}

interface QualityModalProps {
  title: string
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

const QualityModal = ({ title, formData, setFormData, onSubmit, onClose }: QualityModalProps) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={onSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {title}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID Партии
                  </label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.batch_id}
                    onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Подвижность (см)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.mobility_cm}
                    onChange={(e) => setFormData({ ...formData, mobility_cm: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Прочность (МПа)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.strength_mpa}
                    onChange={(e) => setFormData({ ...formData, strength_mpa: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Влажность (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.moisture_pct}
                    onChange={(e) => setFormData({ ...formData, moisture_pct: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Отклонения
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.deviations}
                    onChange={(e) => setFormData({ ...formData, deviations: e.target.value })}
                  />
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

export default DemoQuality
