import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { format } from 'date-fns';
const Monitoring = () => {
    const { data: equipment, isLoading } = useQuery({
        queryKey: ['equipment'],
        queryFn: async () => {
            const response = await apiClient.get('/monitoring/equipment');
            return response.data;
        },
        refetchInterval: 5000, // Обновление каждые 5 секунд
    });
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
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
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u041C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F" }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: equipment?.map((eq) => (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: eq.equipment_name }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eq.status, eq.is_operational)}`, children: eq.status })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u0422\u0438\u043F: ", eq.equipment_type] }), _jsxs("div", { className: "text-sm text-gray-500 mb-4", children: ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E:", ' ', format(new Date(eq.last_update), 'dd.MM.yyyy HH:mm:ss')] }), eq.error_message && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded", children: _jsx("p", { className: "text-sm text-red-800", children: eq.error_message }) })), _jsx("div", { className: "mt-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `h-3 w-3 rounded-full mr-2 ${eq.is_operational ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: "text-sm text-gray-600", children: eq.is_operational ? 'Работает' : 'Не работает' })] }) })] }, eq.id))) })] }));
};
export default Monitoring;
