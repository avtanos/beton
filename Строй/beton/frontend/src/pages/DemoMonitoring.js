import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const DemoMonitoring = () => {
    const [lastUpdate, setLastUpdate] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const equipment = [
        {
            id: 1,
            equipment_name: 'Весы цемента',
            equipment_type: 'scale',
            is_operational: true,
            status: 'working',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
        {
            id: 2,
            equipment_name: 'Весы песка',
            equipment_type: 'scale',
            is_operational: true,
            status: 'working',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
        {
            id: 3,
            equipment_name: 'Весы щебня',
            equipment_type: 'scale',
            is_operational: true,
            status: 'working',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
        {
            id: 4,
            equipment_name: 'Смеситель №1',
            equipment_type: 'mixer',
            is_operational: true,
            status: 'idle',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
        {
            id: 5,
            equipment_name: 'Конвейер №1',
            equipment_type: 'conveyor',
            is_operational: true,
            status: 'working',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
        {
            id: 6,
            equipment_name: 'Силос цемента №1',
            equipment_type: 'silo',
            is_operational: true,
            status: 'working',
            last_update: '2024-11-18T16:40:00',
            error_message: null,
        },
    ];
    const getStatusColor = (status, isOperational) => {
        if (!isOperational)
            return 'bg-red-100 text-red-800';
        switch (status.toLowerCase()) {
            case 'working':
                return 'bg-green-100 text-green-800';
            case 'idle':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'maintenance':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u041C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F" }), _jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: equipment.map((eq) => (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: eq.equipment_name }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eq.status, eq.is_operational)}`, children: eq.status })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u0422\u0438\u043F: ", eq.equipment_type] }), _jsxs("div", { className: "text-sm text-gray-500 mb-4", children: ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E:", ' ', lastUpdate.toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })] }), eq.error_message && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded", children: _jsx("p", { className: "text-sm text-red-800", children: eq.error_message }) })), _jsx("div", { className: "mt-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `h-3 w-3 rounded-full mr-2 ${eq.is_operational ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: "text-sm text-gray-600", children: eq.is_operational ? 'Работает' : 'Не работает' })] }) })] }, eq.id))) })] }));
};
export default DemoMonitoring;
