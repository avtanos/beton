import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const DemoDashboard = () => {
    const [stats, setStats] = useState({
        active_batches: 3,
        pending_orders: 5,
        equipment_working: 6,
        equipment_total: 6,
        low_stock: 0,
    });
    // Имитация обновления данных каждые 3 секунды
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                active_batches: Math.floor(Math.random() * 5) + 1,
                pending_orders: Math.floor(Math.random() * 10) + 1,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0414\u0430\u0448\u0431\u043E\u0440\u0434" }), _jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "text-2xl font-bold text-gray-900", children: stats.active_batches }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsx("dl", { children: _jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043F\u0430\u0440\u0442\u0438\u0439" }) }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "text-2xl font-bold text-gray-900", children: stats.pending_orders }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsx("dl", { children: _jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u041E\u0436\u0438\u0434\u0430\u044E\u0449\u0438\u0445 \u0437\u0430\u043A\u0430\u0437\u043E\u0432" }) }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsxs("div", { className: "text-2xl font-bold text-gray-900", children: [stats.equipment_working, "/", stats.equipment_total] }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsx("dl", { children: _jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u041E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442" }) }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "text-2xl font-bold text-red-600", children: stats.low_stock }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsx("dl", { children: _jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u041D\u0438\u0437\u043A\u0438\u0439 \u043E\u0441\u0442\u0430\u0442\u043E\u043A" }) }) })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F" }), _jsx("div", { className: "space-y-3", children: [
                                        { name: 'Весы цемента', status: 'working' },
                                        { name: 'Смеситель №1', status: 'idle' },
                                        { name: 'Конвейер №1', status: 'working' },
                                    ].map((eq) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded", children: [_jsx("div", { className: "font-medium text-gray-900", children: eq.name }), _jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${eq.status === 'working'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'}`, children: eq.status })] }, eq.name))) })] }) }), _jsx("div", { className: "bg-white shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043F\u0430\u0440\u0442\u0438\u0438" }), _jsx("div", { className: "space-y-3", children: [
                                        { number: 'BATCH-20241118-ABC12345', time: '18.11.2024 14:30', status: 'completed' },
                                        { number: 'BATCH-20241118-DEF67890', time: '18.11.2024 13:15', status: 'mixing' },
                                        { number: 'BATCH-20241118-GHI11223', time: '18.11.2024 12:00', status: 'completed' },
                                    ].map((batch) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: batch.number }), _jsx("div", { className: "text-sm text-gray-500", children: batch.time })] }), _jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${batch.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : batch.status === 'error'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'}`, children: batch.status })] }, batch.number))) })] }) })] })] }));
};
export default DemoDashboard;
