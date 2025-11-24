import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { UserRole } from '../types';
const Users = () => {
    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await apiClient.get('/users');
            return response.data;
        },
    });
    const getRoleLabel = (role) => {
        const labels = {
            [UserRole.OPERATOR]: 'Оператор АСУ ТП',
            [UserRole.TECHNOLOGIST]: 'Технолог',
            [UserRole.SHIFT_MASTER]: 'Мастер смены',
            [UserRole.LABORATORY]: 'Лаборант',
            [UserRole.PRODUCTION_HEAD]: 'Начальник производства',
            [UserRole.LOGISTICS]: 'Логист/диспетчер',
            [UserRole.ADMIN]: 'Администратор',
        };
        return labels[role];
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438" }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("ul", { className: "divide-y divide-gray-200", children: users?.map((user) => (_jsx("li", { children: _jsx("div", { className: "px-4 py-4 sm:px-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user.full_name || user.username }), _jsx("p", { className: "text-sm text-gray-500", children: user.username }), user.email && (_jsx("p", { className: "text-sm text-gray-500", children: user.email }))] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: user.is_active ? 'Активен' : 'Неактивен' }), _jsx("span", { className: "text-sm text-gray-600", children: getRoleLabel(user.role) })] })] }) }) }, user.id))) }) })] }));
};
export default Users;
