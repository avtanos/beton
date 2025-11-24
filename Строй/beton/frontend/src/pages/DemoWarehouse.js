import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
const DemoWarehouse = () => {
    const [materials, setMaterials] = useState([
        {
            id: 1,
            material_type: 'cement',
            material_name: 'Цемент ПЦ 500',
            storage_location: 'Силос №1',
            current_stock_kg: 50000,
            min_stock_kg: 10000,
            max_stock_kg: 100000,
            moisture_pct: 0,
        },
        {
            id: 2,
            material_type: 'sand',
            material_name: 'Песок речной',
            storage_location: 'Бункер №1',
            current_stock_kg: 150000,
            min_stock_kg: 30000,
            max_stock_kg: 200000,
            moisture_pct: 5.2,
        },
        {
            id: 3,
            material_type: 'gravel',
            material_name: 'Щебень гранитный 20-40',
            storage_location: 'Бункер №2',
            current_stock_kg: 200000,
            min_stock_kg: 50000,
            max_stock_kg: 300000,
            moisture_pct: 0,
        },
        {
            id: 4,
            material_type: 'water',
            material_name: 'Вода техническая',
            storage_location: 'Емкость №1',
            current_stock_kg: 50000,
            min_stock_kg: 10000,
            max_stock_kg: 100000,
            moisture_pct: 0,
        },
        {
            id: 5,
            material_type: 'additive1',
            material_name: 'Пластификатор С-3',
            storage_location: 'Емкость №2',
            current_stock_kg: 5000,
            min_stock_kg: 1000,
            max_stock_kg: 10000,
            moisture_pct: 0,
        },
    ]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [editData, setEditData] = useState({
        current_stock_kg: '',
        min_stock_kg: '',
        moisture_pct: '',
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
    const handleEdit = (material) => {
        setEditingMaterial(material);
        setEditData({
            current_stock_kg: material.current_stock_kg.toString(),
            min_stock_kg: material.min_stock_kg.toString(),
            moisture_pct: material.moisture_pct.toString(),
        });
        setShowEditModal(true);
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        if (editingMaterial) {
            setMaterials(materials.map(m => m.id === editingMaterial.id
                ? {
                    ...m,
                    current_stock_kg: parseFloat(editData.current_stock_kg),
                    min_stock_kg: parseFloat(editData.min_stock_kg),
                    moisture_pct: parseFloat(editData.moisture_pct),
                }
                : m));
            setShowEditModal(false);
            setEditingMaterial(null);
        }
    };
    const handleAddStock = (id, amount) => {
        setMaterials(materials.map(m => m.id === id
            ? { ...m, current_stock_kg: Math.min(m.current_stock_kg + amount, m.max_stock_kg || Infinity) }
            : m));
    };
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0421\u043A\u043B\u0430\u0434 \u0441\u044B\u0440\u044C\u044F" }), _jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: materials.map((material) => {
                    const stockStatus = getStockStatus(material);
                    const percentage = material.max_stock_kg
                        ? (material.current_stock_kg / material.max_stock_kg) * 100
                        : 0;
                    return (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: material.material_name }), _jsx("span", { className: `text-sm font-medium ${stockStatus.color}`, children: stockStatus.label })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u0422\u0438\u043F: ", material.material_type] }), material.storage_location && (_jsxs("div", { className: "text-sm text-gray-500 mb-4", children: ["\u041C\u0435\u0441\u0442\u043E: ", material.storage_location] })), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043E\u0441\u0442\u0430\u0442\u043E\u043A:" }), _jsxs("span", { className: "font-medium", children: [material.current_stock_kg.toFixed(1), " \u043A\u0433"] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439:" }), _jsxs("span", { className: "font-medium", children: [material.min_stock_kg.toFixed(1), " \u043A\u0433"] })] }), material.max_stock_kg && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439:" }), _jsxs("span", { className: "font-medium", children: [material.max_stock_kg.toFixed(1), " \u043A\u0433"] })] })), material.moisture_pct > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C:" }), _jsxs("span", { className: "font-medium", children: [material.moisture_pct.toFixed(2), "%"] })] })), material.max_stock_kg && (_jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${percentage < 30
                                                        ? 'bg-red-500'
                                                        : percentage < 70
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'}`, style: { width: `${Math.min(percentage, 100)}%` } }) }), _jsxs("div", { className: "text-xs text-gray-500 mt-1 text-center", children: [percentage.toFixed(1), "%"] })] }))] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("button", { onClick: () => handleEdit(material), className: "flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx("button", { onClick: () => handleAddStock(material.id, 10000), className: "flex-1 text-sm bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100", children: "+10\u0442" })] })] }, material.id));
                }) }), showEditModal && editingMaterial && (_jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: () => setShowEditModal(false) }), _jsx("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: _jsxs("form", { onSubmit: handleUpdate, children: [_jsxs("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: [_jsxs("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: ["\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C: ", editingMaterial.material_name] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043E\u0441\u0442\u0430\u0442\u043E\u043A (\u043A\u0433)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: editData.current_stock_kg, onChange: (e) => setEditData({ ...editData, current_stock_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u043E\u0441\u0442\u0430\u0442\u043E\u043A (\u043A\u0433)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: editData.min_stock_kg, onChange: (e) => setEditData({ ...editData, min_stock_kg: e.target.value }) })] }), editingMaterial.moisture_pct >= 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C (%)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: editData.moisture_pct, onChange: (e) => setEditData({ ...editData, moisture_pct: e.target.value }) })] }))] })] }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: [_jsx("button", { type: "submit", className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { type: "button", onClick: () => setShowEditModal(false), className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] }) })] }) }))] }));
};
export default DemoWarehouse;
