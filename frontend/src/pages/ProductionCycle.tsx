import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BatchStatus } from '../types'

const ProductionCycle = () => {
  const [currentBatch, setCurrentBatch] = useState<{
    id: number
    batch_number: string
    status: BatchStatus
    step: number
    timeElapsed: number
    steps: Array<{
      name: string
      duration: number
      status: 'pending' | 'active' | 'completed'
      description: string
      iot?: string[]
      ai?: string
    }>
  } | null>(null)

  const [isRunning, setIsRunning] = useState(false)

  const cycleSteps = [
    {
      name: 'Дозирование цемента',
      duration: 30,
      description: 'Загрузка цемента из силоса через шнек. IoT контролирует вес.',
      iot: ['Весы цемента', 'Датчик уровня силоса'],
      ai: 'Коррекция количества на основе влажности',
    },
    {
      name: 'Дозирование песка',
      duration: 45,
      description: 'Загрузка песка из бункера через конвейер. Измерение влажности.',
      iot: ['Весы песка', 'Датчик влажности', 'Датчик уровня бункера'],
      ai: 'Автоматическая коррекция воды с учетом влажности',
    },
    {
      name: 'Дозирование щебня',
      duration: 60,
      description: 'Загрузка щебня из бункера. Контроль уровня.',
      iot: ['Весы щебня', 'Датчик уровня бункера'],
      ai: 'Оптимизация последовательности загрузки',
    },
    {
      name: 'Дозирование воды',
      duration: 20,
      description: 'Дозирование воды с учетом влажности инертных материалов.',
      iot: ['Дозатор воды', 'Датчик расхода'],
      ai: 'Расчет скорректированного количества воды',
    },
    {
      name: 'Дозирование добавок',
      duration: 10,
      description: 'Точное дозирование пластификаторов и ускорителей.',
      iot: ['Дозатор добавок'],
      ai: 'Контроль точности ±0.5%',
    },
    {
      name: 'Перемешивание',
      duration: 120,
      description: 'Перемешивание всех компонентов в смесителе.',
      iot: ['Датчик мощности двигателя', 'Датчик температуры', 'Датчик вибрации'],
      ai: 'Анализ энергопотребления, предсказание качества',
    },
    {
      name: 'Выгрузка',
      duration: 60,
      description: 'Выгрузка готового бетона в миксер автомобиля.',
      iot: ['Весы выгрузки', 'GPS трекер'],
      ai: 'Контроль веса выгруженного бетона',
    },
  ]

  const startCycle = () => {
    const newBatch = {
      id: 1,
      batch_number: `BATCH-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-DEMO`,
      status: BatchStatus.DOSING,
      step: 0,
      timeElapsed: 0,
      steps: cycleSteps.map((step, index) => ({
        name: step.name,
        duration: step.duration,
        description: step.description,
        iot: step.iot,
        ai: step.ai,
        status: (index === 0 ? 'active' : 'pending') as 'pending' | 'active' | 'completed',
      })),
    }
    setCurrentBatch(newBatch)
    setIsRunning(true)
  }

  useEffect(() => {
    if (!isRunning || !currentBatch) return

    const interval = setInterval(() => {
      setCurrentBatch(prev => {
        if (!prev) return null

        const currentStep = prev.steps[prev.step]
        const newTimeElapsed = prev.timeElapsed + 1

        // Если текущий шаг завершен
        if (newTimeElapsed >= currentStep.duration) {
          // Отмечаем текущий шаг как завершенный
          const updatedSteps = prev.steps.map((step, index) => {
            if (index === prev.step) {
              return { ...step, status: 'completed' as const }
            }
            if (index === prev.step + 1) {
              return { ...step, status: 'active' as const }
            }
            return step
          })

          // Переходим к следующему шагу
          if (prev.step < prev.steps.length - 1) {
            return {
              ...prev,
              step: prev.step + 1,
              timeElapsed: 0,
              steps: updatedSteps,
              status: prev.step + 1 === prev.steps.length - 1 
                ? BatchStatus.DISCHARGING 
                : prev.step + 1 === prev.steps.length - 2
                ? BatchStatus.MIXING
                : BatchStatus.DOSING,
            }
          } else {
            // Цикл завершен
            setIsRunning(false)
            return {
              ...prev,
              status: BatchStatus.COMPLETED,
              steps: updatedSteps,
            }
          }
        }

        return {
          ...prev,
          timeElapsed: newTimeElapsed,
        }
      })
    }, 1000) // Обновление каждую секунду

    return () => clearInterval(interval)
  }, [isRunning, currentBatch])

  const getStepProgress = (step: typeof cycleSteps[0], stepIndex: number) => {
    if (!currentBatch) return 0
    if (stepIndex < currentBatch.step) return 100
    if (stepIndex > currentBatch.step) return 0
    return (currentBatch.timeElapsed / step.duration) * 100
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalDuration = cycleSteps.reduce((sum, step) => sum + step.duration, 0)
  const totalProgress = currentBatch 
    ? ((currentBatch.step * 100 + getStepProgress(cycleSteps[currentBatch.step], currentBatch.step)) / cycleSteps.length)
    : 0

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Цикл производства</h1>
        <div className="flex gap-2">
          <Link
            to="/demo"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Назад к разделам
          </Link>
          {!isRunning && (
            <button
              onClick={startCycle}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm"
            >
              Запустить демо-цикл
            </button>
          )}
        </div>
      </div>

      {currentBatch && (
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentBatch.batch_number}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Статус: {currentBatch.status}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {totalProgress.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">
                Общее время: {formatTime(
                  currentBatch.step * cycleSteps[0].duration + currentBatch.timeElapsed
                )} / {formatTime(totalDuration)}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {cycleSteps.map((step, index) => {
          const progress = currentBatch ? getStepProgress(step, index) : 0
          const stepStatus = currentBatch?.steps[index]?.status || 'pending'
          const isActive = stepStatus === 'active'
          const isCompleted = stepStatus === 'completed'

          return (
            <div
              key={index}
              className={`bg-white shadow rounded-lg p-6 border-l-4 ${
                isActive
                  ? 'border-blue-500'
                  : isCompleted
                  ? 'border-green-500'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCompleted
                          ? 'bg-green-100 text-green-800'
                          : isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isActive ? 'В процессе' : isCompleted ? 'Завершено' : 'Ожидает'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-xs font-semibold text-blue-800 mb-1">
                        IoT Датчики:
                      </div>
                      <div className="text-sm text-blue-700">
                        {step.iot.join(', ')}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-xs font-semibold text-purple-800 mb-1">
                        AI Функции:
                      </div>
                      <div className="text-sm text-purple-700">{step.ai}</div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {formatTime(step.duration)}
                  </div>
                  {isActive && (
                    <div className="text-xs text-gray-500 mt-1">
                      Осталось: {formatTime(step.duration - (currentBatch?.timeElapsed || 0))}
                    </div>
                  )}
                </div>
              </div>

              {isActive && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {progress.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {currentBatch && currentBatch.status === BatchStatus.COMPLETED && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Цикл производства завершен!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Партия готова к отгрузке. Все этапы выполнены успешно.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductionCycle

