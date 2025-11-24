import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { BatchStatus } from '../types';
import { format } from 'date-fns';
const Batches = () => {
    const queryClient = useQueryClient();
    const { data: batches, isLoading } = useQuery({
        queryKey: ['batches'],
        queryFn: async () => {
            const response = await apiClient.get('/batches');
            return response.data;
        },
    });
    const startBatchMutation = useMutation({
        mutationFn: async (id) => {
            const response = await apiClient.post(`/batches/${id}/start`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
        },
    });
    const getStatusColor = (status) => {
        switch (status) {
            case BatchStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            case BatchStatus.ERROR:
                return 'bg-red-100 text-red-800';
            case BatchStatus.DOSING:
            case BatchStatus.MIXING:
            case BatchStatus.DISCHARGING:
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };
    const getStatusLabel = (status) => {
        const labels = {
            [BatchStatus.PLANNED]: 'Запланирована',
            [BatchStatus.DOSING]: 'Дозирование',
            [BatchStatus.MIXING]: 'Перемешивание',
            [BatchStatus.DISCHARGING]: 'Выгрузка',
            [BatchStatus.COMPLETED]: 'Завершена',
            [BatchStatus.ERROR]: 'Ошибка',
        };
        return labels[status];
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u0440\u0442\u0438\u0438" }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("ul", { className: "divide-y divide-gray-200", children: batches?.map((batch) => (_jsx("li", { children: _jsxs("div", { className: "px-4 py-4 sm:px-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: batch.batch_number }), _jsx("span", { className: `ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`, children: getStatusLabel(batch.status) })] }), _jsx("div", { className: "text-sm text-gray-500", children: batch.created_at &&
                                                format(new Date(batch.created_at), 'dd.MM.yyyy HH:mm') })] }), _jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["\u041E\u0431\u044A\u0435\u043C: ", batch.volume_m3, " \u043C\u00B3 | \u0417\u0430\u043A\u0430\u0437: #", batch.order_id] }), batch.actual_cement_kg && (_jsxs("div", { className: "mt-2 text-xs text-gray-400", children: ["\u0424\u0430\u043A\u0442: \u0426\u0435\u043C\u0435\u043D\u0442 ", batch.actual_cement_kg.toFixed(1), " \u043A\u0433", batch.deviation_cement_pct && (_jsxs("span", { className: `ml-2 ${Math.abs(batch.deviation_cement_pct) > 2
                                                        ? 'text-red-600'
                                                        : 'text-green-600'}`, children: ["(", batch.deviation_cement_pct > 0 ? '+' : '', batch.deviation_cement_pct.toFixed(2), "%)"] }))] }))] }), batch.status === BatchStatus.PLANNED && (_jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => startBatchMutation.mutate(batch.id), disabled: startBatchMutation.isPending, className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm disabled:opacity-50", children: "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E" }) }))] }) }, batch.id))) }) })] }));
};
export default Batches;
