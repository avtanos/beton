import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { QualityStatus } from '../types';
import { format } from 'date-fns';
const Quality = () => {
    const { data: qualityChecks, isLoading } = useQuery({
        queryKey: ['quality'],
        queryFn: async () => {
            const response = await apiClient.get('/quality');
            return response.data;
        },
    });
    const getStatusColor = (status) => {
        switch (status) {
            case QualityStatus.APPROVED:
                return 'bg-green-100 text-green-800';
            case QualityStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };
    const getStatusLabel = (status) => {
        const labels = {
            [QualityStatus.PENDING]: 'Ожидает проверки',
            [QualityStatus.APPROVED]: 'Одобрено',
            [QualityStatus.REJECTED]: 'Отклонено',
        };
        return labels[status];
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430" }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("ul", { className: "divide-y divide-gray-200", children: qualityChecks?.map((check) => (_jsx("li", { children: _jsxs("div", { className: "px-4 py-4 sm:px-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: ["\u041F\u0430\u0440\u0442\u0438\u044F #", check.batch_id] }), _jsx("span", { className: `ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(check.status)}`, children: getStatusLabel(check.status) })] }), _jsx("div", { className: "text-sm text-gray-500", children: format(new Date(check.checked_at), 'dd.MM.yyyy HH:mm') })] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3", children: [check.mobility_cm !== null && check.mobility_cm !== undefined && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "\u041F\u043E\u0434\u0432\u0438\u0436\u043D\u043E\u0441\u0442\u044C" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [check.mobility_cm, " \u0441\u043C"] })] })), check.strength_mpa !== null && check.strength_mpa !== undefined && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "\u041F\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u044C" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [check.strength_mpa, " \u041C\u041F\u0430"] })] })), check.moisture_pct !== null && check.moisture_pct !== undefined && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [check.moisture_pct, "%"] })] }))] }), check.deviations && (_jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-xs text-gray-500", children: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F:" }), _jsx("p", { className: "text-sm text-gray-900", children: check.deviations })] }))] }) }, check.id))) }) })] }));
};
export default Quality;
