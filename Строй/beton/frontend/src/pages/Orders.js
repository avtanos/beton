import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { OrderStatus } from '../types';
import { format } from 'date-fns';
const Orders = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await apiClient.get('/orders');
            return response.data;
        },
    });
    const { data: recipes } = useQuery({
        queryKey: ['recipes'],
        queryFn: async () => {
            const response = await apiClient.get('/recipes?is_active=true');
            return response.data;
        },
    });
    const createOrderMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post('/orders', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setShowCreateModal(false);
        },
    });
    // const updateOrderMutation = useMutation({
    //   mutationFn: async ({ id, data }: { id: number; data: any }) => {
    //     const response = await apiClient.patch(`/orders/${id}`, data)
    //     return response.data
    //   },
    //   onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: ['orders'] })
    //   },
    // })
    const getStatusColor = (status) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            case OrderStatus.IN_PROGRESS:
                return 'bg-blue-100 text-blue-800';
            case OrderStatus.CANCELLED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };
    const getStatusLabel = (status) => {
        const labels = {
            [OrderStatus.PENDING]: 'Ожидает',
            [OrderStatus.IN_PROGRESS]: 'В производстве',
            [OrderStatus.COMPLETED]: 'Выполнен',
            [OrderStatus.CANCELLED]: 'Отменен',
        };
        return labels[status];
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0417\u0430\u043A\u0430\u0437\u044B" }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437" })] }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("ul", { className: "divide-y divide-gray-200", children: orders?.map((order) => (_jsx("li", { children: _jsxs("div", { className: "px-4 py-4 sm:px-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: order.order_number }), _jsx("span", { className: `ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`, children: getStatusLabel(order.status) })] }), _jsx("div", { className: "text-sm text-gray-500", children: order.planned_time &&
                                                format(new Date(order.planned_time), 'dd.MM.yyyy HH:mm') })] }), _jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [_jsxs("div", { className: "sm:flex", children: [_jsxs("p", { className: "flex items-center text-sm text-gray-500", children: ["\u041C\u0430\u0440\u043A\u0430: ", order.concrete_grade] }), _jsxs("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: ["\u041E\u0431\u044A\u0435\u043C: ", order.volume_m3, " \u043C\u00B3"] })] }), _jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: [order.customer_name && (_jsxs("p", { className: "mr-4", children: ["\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A: ", order.customer_name] })), order.vehicle_number && (_jsxs("p", { children: ["\u041C\u0430\u0448\u0438\u043D\u0430: ", order.vehicle_number] }))] })] })] }) }, order.id))) }) }), showCreateModal && (_jsx(CreateOrderModal, { recipes: recipes || [], onClose: () => setShowCreateModal(false), onSubmit: (data) => createOrderMutation.mutate(data), isLoading: createOrderMutation.isPending }))] }));
};
const CreateOrderModal = ({ recipes, onClose, onSubmit, isLoading, }) => {
    const [formData, setFormData] = useState({
        concrete_grade: '',
        volume_m3: '',
        recipe_id: '',
        planned_time: '',
        customer_name: '',
        delivery_address: '',
        vehicle_number: '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            volume_m3: parseFloat(formData.volume_m3),
            recipe_id: parseInt(formData.recipe_id),
            planned_time: formData.planned_time || undefined,
        });
    };
    return (_jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsx("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041C\u0430\u0440\u043A\u0430 \u0431\u0435\u0442\u043E\u043D\u0430" }), _jsx("input", { type: "text", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.concrete_grade, onChange: (e) => setFormData({ ...formData, concrete_grade: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0420\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u0430" }), _jsxs("select", { required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.recipe_id, onChange: (e) => setFormData({ ...formData, recipe_id: e.target.value }), children: [_jsx("option", { value: "", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u0443" }), recipes.map((recipe) => (_jsxs("option", { value: recipe.id, children: [recipe.name, " (", recipe.code, ")"] }, recipe.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041E\u0431\u044A\u0435\u043C (\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.volume_m3, onChange: (e) => setFormData({ ...formData, volume_m3: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u043B\u0430\u043D\u0438\u0440\u0443\u0435\u043C\u043E\u0435 \u0432\u0440\u0435\u043C\u044F" }), _jsx("input", { type: "datetime-local", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.planned_time, onChange: (e) => setFormData({ ...formData, planned_time: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A" }), _jsx("input", { type: "text", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.customer_name, onChange: (e) => setFormData({ ...formData, customer_name: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" }), _jsx("input", { type: "text", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.delivery_address, onChange: (e) => setFormData({ ...formData, delivery_address: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041D\u043E\u043C\u0435\u0440 \u043C\u0430\u0448\u0438\u043D\u044B" }), _jsx("input", { type: "text", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.vehicle_number, onChange: (e) => setFormData({ ...formData, vehicle_number: e.target.value }) })] })] })] }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: [_jsx("button", { type: "submit", disabled: isLoading, className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50", children: isLoading ? 'Создание...' : 'Создать' }), _jsx("button", { type: "button", onClick: onClose, className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] }) })] }) }));
};
export default Orders;
