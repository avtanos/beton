import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BatchStatus } from '../types';
const ProductionCycle = () => {
    const [currentBatch, setCurrentBatch] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
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
    ];
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
                status: (index === 0 ? 'active' : 'pending'),
            })),
        };
        setCurrentBatch(newBatch);
        setIsRunning(true);
    };
    useEffect(() => {
        if (!isRunning || !currentBatch)
            return;
        const interval = setInterval(() => {
            setCurrentBatch(prev => {
                if (!prev)
                    return null;
                const currentStep = prev.steps[prev.step];
                const newTimeElapsed = prev.timeElapsed + 1;
                // Если текущий шаг завершен
                if (newTimeElapsed >= currentStep.duration) {
                    // Отмечаем текущий шаг как завершенный
                    const updatedSteps = prev.steps.map((step, index) => {
                        if (index === prev.step) {
                            return { ...step, status: 'completed' };
                        }
                        if (index === prev.step + 1) {
                            return { ...step, status: 'active' };
                        }
                        return step;
                    });
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
                        };
                    }
                    else {
                        // Цикл завершен
                        setIsRunning(false);
                        return {
                            ...prev,
                            status: BatchStatus.COMPLETED,
                            steps: updatedSteps,
                        };
                    }
                }
                return {
                    ...prev,
                    timeElapsed: newTimeElapsed,
                };
            });
        }, 1000); // Обновление каждую секунду
        return () => clearInterval(interval);
    }, [isRunning, currentBatch]);
    const getStepProgress = (step, stepIndex) => {
        if (!currentBatch)
            return 0;
        if (stepIndex < currentBatch.step)
            return 100;
        if (stepIndex > currentBatch.step)
            return 0;
        return (currentBatch.timeElapsed / step.duration) * 100;
    };
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const totalDuration = cycleSteps.reduce((sum, step) => sum + step.duration, 0);
    const totalProgress = currentBatch
        ? ((currentBatch.step * 100 + getStepProgress(cycleSteps[currentBatch.step], currentBatch.step)) / cycleSteps.length)
        : 0;
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0426\u0438\u043A\u043B \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0430" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" }), !isRunning && (_jsx("button", { onClick: startCycle, className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm", children: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0434\u0435\u043C\u043E-\u0446\u0438\u043A\u043B" }))] })] }), currentBatch && (_jsxs("div", { className: "mb-6 bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: currentBatch.batch_number }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["\u0421\u0442\u0430\u0442\u0443\u0441: ", currentBatch.status] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-primary-600", children: [totalProgress.toFixed(1), "%"] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["\u041E\u0431\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F: ", formatTime(currentBatch.step * cycleSteps[0].duration + currentBatch.timeElapsed), " / ", formatTime(totalDuration)] })] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 mb-4", children: _jsx("div", { className: "bg-primary-600 h-3 rounded-full transition-all duration-300", style: { width: `${totalProgress}%` } }) })] })), _jsx("div", { className: "space-y-4", children: cycleSteps.map((step, index) => {
                    const progress = currentBatch ? getStepProgress(step, index) : 0;
                    const stepStatus = currentBatch?.steps[index]?.status || 'pending';
                    const isActive = stepStatus === 'active';
                    const isCompleted = stepStatus === 'completed';
                    return (_jsxs("div", { className: `bg-white shadow rounded-lg p-6 border-l-4 ${isActive
                            ? 'border-blue-500'
                            : isCompleted
                                ? 'border-green-500'
                                : 'border-gray-300'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCompleted
                                                            ? 'bg-green-100 text-green-800'
                                                            : isActive
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-600'}`, children: isCompleted ? '✓' : index + 1 }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: step.name }), _jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${isActive
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : isCompleted
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-600'}`, children: isActive ? 'В процессе' : isCompleted ? 'Завершено' : 'Ожидает' })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: step.description }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { className: "bg-blue-50 p-3 rounded", children: [_jsx("div", { className: "text-xs font-semibold text-blue-800 mb-1", children: "IoT \u0414\u0430\u0442\u0447\u0438\u043A\u0438:" }), _jsx("div", { className: "text-sm text-blue-700", children: step.iot.join(', ') })] }), _jsxs("div", { className: "bg-purple-50 p-3 rounded", children: [_jsx("div", { className: "text-xs font-semibold text-purple-800 mb-1", children: "AI \u0424\u0443\u043D\u043A\u0446\u0438\u0438:" }), _jsx("div", { className: "text-sm text-purple-700", children: step.ai })] })] })] }), _jsxs("div", { className: "ml-4 text-right", children: [_jsx("div", { className: "text-sm font-medium text-gray-700", children: formatTime(step.duration) }), isActive && (_jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C: ", formatTime(step.duration - (currentBatch?.timeElapsed || 0))] }))] })] }), isActive && (_jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-1000", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "text-xs text-gray-500 mt-1 text-center", children: [progress.toFixed(1), "%"] })] }))] }, index));
                }) }), currentBatch && currentBatch.status === BatchStatus.COMPLETED && (_jsx("div", { className: "mt-6 bg-green-50 border border-green-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "text-3xl mr-4", children: "\u2705" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-green-900", children: "\u0426\u0438\u043A\u043B \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D!" }), _jsx("p", { className: "text-sm text-green-700 mt-1", children: "\u041F\u0430\u0440\u0442\u0438\u044F \u0433\u043E\u0442\u043E\u0432\u0430 \u043A \u043E\u0442\u0433\u0440\u0443\u0437\u043A\u0435. \u0412\u0441\u0435 \u044D\u0442\u0430\u043F\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E." })] })] }) }))] }));
};
export default ProductionCycle;
