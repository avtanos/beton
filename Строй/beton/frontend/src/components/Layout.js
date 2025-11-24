import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
const Layout = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const navigation = [
        { name: 'Дашборд', path: '/' },
        { name: 'Заказы', path: '/orders' },
        { name: 'Рецептуры', path: '/recipes' },
        { name: 'Партии', path: '/batches' },
        { name: 'Склад', path: '/warehouse' },
        { name: 'Качество', path: '/quality' },
        { name: 'Мониторинг', path: '/monitoring' },
    ];
    const adminNavigation = [
        { name: 'Пользователи', path: '/users' },
    ];
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("nav", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0 flex items-center", children: _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "\u0410\u0421\u0423 \u0422\u041F \u0411\u0435\u0442\u043E\u043D\u043D\u043E\u0433\u043E \u0437\u0430\u0432\u043E\u0434\u0430" }) }), _jsxs("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: [navigation.map((item) => (_jsx(Link, { to: item.path, className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(item.path)
                                                    ? 'border-primary-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`, children: item.name }, item.path))), (user?.role === 'admin' || user?.role === 'production_head') &&
                                                adminNavigation.map((item) => (_jsx(Link, { to: item.path, className: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(item.path)
                                                        ? 'border-primary-500 text-gray-900'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`, children: item.name }, item.path)))] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-sm text-gray-700 mr-4", children: user?.full_name || user?.username }), _jsx("button", { onClick: logout, className: "text-sm text-gray-500 hover:text-gray-700", children: "\u0412\u044B\u0445\u043E\u0434" })] })] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsx(Outlet, {}) })] }));
};
export default Layout;
