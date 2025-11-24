import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
const Warehouse = () => {
    const { data: materials, isLoading } = useQuery({
        queryKey: ['warehouse'],
        queryFn: async () => {
            const response = await apiClient.get('/warehouse');
            return response.data;
        },
    });
    const getStockStatus = (material) => {
        if (material.current_stock_kg <= material.min_stock_kg) {
            return { color: 'text-red-600', label: 'Критический остаток' };
        }
        if (material.max_stock_kg) {
            const percentage = (material.current_stock_kg / material.max_stock_kg) * 100;
            if (percentage < 30) {
                return { color: 'text-yellow-600', label: 'Низкий остаток' };
            }
        }
        return { color: 'text-green-600', label: 'Норма' };
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u0421\u043A\u043B\u0430\u0434 \u0441\u044B\u0440\u044C\u044F" }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: materials?.map((material) => {
                    const stockStatus = getStockStatus(material);
                    const percentage = material.max_stock_kg
                        ? (material.current_stock_kg / material.max_stock_kg) * 100
                        : 0;
                    return (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: material.material_name }), _jsx("span", { className: `text-sm font-medium ${stockStatus.color}`, children: stockStatus.label })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u0422\u0438\u043F: ", material.material_type] }), material.storage_location && (_jsxs("div", { className: "text-sm text-gray-500 mb-4", children: ["\u041C\u0435\u0441\u0442\u043E: ", material.storage_location] })), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043E\u0441\u0442\u0430\u0442\u043E\u043A:" }), _jsxs("span", { className: "font-medium", children: [material.current_stock_kg.toFixed(1), " \u043A\u0433"] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439:" }), _jsxs("span", { className: "font-medium", children: [material.min_stock_kg.toFixed(1), " \u043A\u0433"] })] }), material.max_stock_kg && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439:" }), _jsxs("span", { className: "font-medium", children: [material.max_stock_kg.toFixed(1), " \u043A\u0433"] })] })), material.moisture_pct > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C:" }), _jsxs("span", { className: "font-medium", children: [material.moisture_pct.toFixed(2), "%"] })] })), material.max_stock_kg && (_jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${percentage < 30
                                                        ? 'bg-red-500'
                                                        : percentage < 70
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'}`, style: { width: `${Math.min(percentage, 100)}%` } }) }), _jsxs("div", { className: "text-xs text-gray-500 mt-1 text-center", children: [percentage.toFixed(1), "%"] })] }))] })] }, material.id));
                }) })] }));
};
export default Warehouse;
