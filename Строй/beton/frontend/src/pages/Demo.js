import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const Demo = () => {
    const sections = [
        {
            title: 'Дашборд',
            path: '/demo/dashboard',
            description: 'Обзор производства и ключевые метрики',
            icon: '📊',
        },
        {
            title: 'Заказы',
            path: '/demo/orders',
            description: 'Управление заказами на производство',
            icon: '📋',
        },
        {
            title: 'Рецептуры',
            path: '/demo/recipes',
            description: 'Управление рецептурами бетона',
            icon: '📖',
        },
        {
            title: 'Партии',
            path: '/demo/batches',
            description: 'Производственные партии',
            icon: '🏭',
        },
        {
            title: 'Склад',
            path: '/demo/warehouse',
            description: 'Управление складом сырья',
            icon: '📦',
        },
        {
            title: 'Качество',
            path: '/demo/quality',
            description: 'Контроль качества продукции',
            icon: '✅',
        },
        {
            title: 'Мониторинг',
            path: '/demo/monitoring',
            description: 'Мониторинг оборудования',
            icon: '🖥️',
        },
        {
            title: 'Цикл производства',
            path: '/demo/cycle',
            description: 'Визуализация цикла производства с IoT и AI',
            icon: '🔄',
        },
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: _jsxs("div", { className: "container mx-auto px-4 py-16", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "\u0410\u0421\u0423 \u0422\u041F \u0411\u0435\u0442\u043E\u043D\u043D\u043E\u0433\u043E \u0437\u0430\u0432\u043E\u0434\u0430" }), _jsx("p", { className: "text-xl text-gray-600 mb-2", children: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C" }), _jsx("p", { className: "text-sm text-gray-500", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: sections.map((section) => (_jsx(Link, { to: section.path, className: "block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-primary-500", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "text-4xl mr-4", children: section.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: section.title }), _jsx("p", { className: "text-sm text-gray-600", children: section.description })] }), _jsx("div", { className: "text-primary-500 ml-2", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] }) }, section.path))) }), _jsx("div", { className: "mt-12 text-center", children: _jsx(Link, { to: "/login", className: "inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium", children: "\u0412\u043E\u0439\u0442\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443" }) })] }) }));
};
export default Demo;
