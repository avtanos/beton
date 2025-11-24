import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
const DemoRecipes = () => {
    const [recipes, setRecipes] = useState([
        {
            id: 1,
            name: 'Бетон Б25',
            code: 'B25',
            description: 'Бетон марки Б25 по ГОСТ',
            cement_kg: 350,
            sand_kg: 600,
            gravel_kg: 1200,
            water_kg: 180,
            additive1_kg: 2.5,
            additive2_kg: 0,
            mixing_time_sec: 120,
            discharge_time_sec: 60,
            is_gost: true,
            version: 1,
            is_active: true,
        },
        {
            id: 2,
            name: 'Бетон М300',
            code: 'M300',
            description: 'Бетон марки М300',
            cement_kg: 400,
            sand_kg: 650,
            gravel_kg: 1150,
            water_kg: 200,
            additive1_kg: 3.0,
            additive2_kg: 0,
            mixing_time_sec: 150,
            discharge_time_sec: 60,
            is_gost: true,
            version: 1,
            is_active: true,
        },
        {
            id: 3,
            name: 'Бетон М400',
            code: 'M400',
            description: 'Высокопрочный бетон М400',
            cement_kg: 450,
            sand_kg: 600,
            gravel_kg: 1100,
            water_kg: 180,
            additive1_kg: 4.0,
            additive2_kg: 1.5,
            mixing_time_sec: 180,
            discharge_time_sec: 60,
            is_gost: false,
            version: 2,
            is_active: true,
        },
    ]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        cement_kg: '',
        sand_kg: '',
        gravel_kg: '',
        water_kg: '',
        additive1_kg: '0',
        additive2_kg: '0',
        mixing_time_sec: '120',
        discharge_time_sec: '60',
        is_gost: false,
    });
    const handleCreate = (e) => {
        e.preventDefault();
        const newRecipe = {
            id: recipes.length + 1,
            name: formData.name,
            code: formData.code,
            description: formData.description,
            cement_kg: parseFloat(formData.cement_kg),
            sand_kg: parseFloat(formData.sand_kg),
            gravel_kg: parseFloat(formData.gravel_kg),
            water_kg: parseFloat(formData.water_kg),
            additive1_kg: parseFloat(formData.additive1_kg),
            additive2_kg: parseFloat(formData.additive2_kg),
            mixing_time_sec: parseInt(formData.mixing_time_sec),
            discharge_time_sec: parseInt(formData.discharge_time_sec),
            is_gost: formData.is_gost,
            version: 1,
            is_active: true,
        };
        setRecipes([...recipes, newRecipe]);
        setShowCreateModal(false);
        setFormData({
            name: '',
            code: '',
            description: '',
            cement_kg: '',
            sand_kg: '',
            gravel_kg: '',
            water_kg: '',
            additive1_kg: '0',
            additive2_kg: '0',
            mixing_time_sec: '120',
            discharge_time_sec: '60',
            is_gost: false,
        });
    };
    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            name: recipe.name,
            code: recipe.code,
            description: recipe.description,
            cement_kg: recipe.cement_kg.toString(),
            sand_kg: recipe.sand_kg.toString(),
            gravel_kg: recipe.gravel_kg.toString(),
            water_kg: recipe.water_kg.toString(),
            additive1_kg: recipe.additive1_kg.toString(),
            additive2_kg: recipe.additive2_kg.toString(),
            mixing_time_sec: recipe.mixing_time_sec.toString(),
            discharge_time_sec: recipe.discharge_time_sec.toString(),
            is_gost: recipe.is_gost,
        });
        setShowEditModal(true);
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        if (editingRecipe) {
            setRecipes(recipes.map(r => r.id === editingRecipe.id
                ? {
                    ...r,
                    name: formData.name,
                    code: formData.code,
                    description: formData.description,
                    cement_kg: parseFloat(formData.cement_kg),
                    sand_kg: parseFloat(formData.sand_kg),
                    gravel_kg: parseFloat(formData.gravel_kg),
                    water_kg: parseFloat(formData.water_kg),
                    additive1_kg: parseFloat(formData.additive1_kg),
                    additive2_kg: parseFloat(formData.additive2_kg),
                    mixing_time_sec: parseInt(formData.mixing_time_sec),
                    discharge_time_sec: parseInt(formData.discharge_time_sec),
                    is_gost: formData.is_gost,
                    version: r.version + 1,
                }
                : r));
            setShowEditModal(false);
            setEditingRecipe(null);
        }
    };
    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту рецептуру?')) {
            setRecipes(recipes.filter(r => r.id !== id));
        }
    };
    const handleToggleActive = (id) => {
        setRecipes(recipes.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
    };
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u0420\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u044B" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm", children: "+ \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0440\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u0443" })] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: recipes.map((recipe) => (_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: recipe.name }), _jsxs("div", { className: "flex gap-2", children: [recipe.is_gost && (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: "\u0413\u041E\u0421\u0422" })), _jsx("button", { onClick: () => handleToggleActive(recipe.id), className: `px-2 py-1 text-xs rounded ${recipe.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'}`, children: recipe.is_active ? 'Активна' : 'Неактивна' })] })] }), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["\u041A\u043E\u0434: ", recipe.code] }), recipe.description && (_jsx("div", { className: "text-sm text-gray-600 mb-4", children: recipe.description })), _jsxs("div", { className: "space-y-2 text-sm mb-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "\u0426\u0435\u043C\u0435\u043D\u0442:" }), _jsxs("span", { className: "font-medium", children: [recipe.cement_kg, " \u043A\u0433/\u043C\u00B3"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "\u041F\u0435\u0441\u043E\u043A:" }), _jsxs("span", { className: "font-medium", children: [recipe.sand_kg, " \u043A\u0433/\u043C\u00B3"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "\u0429\u0435\u0431\u0435\u043D\u044C:" }), _jsxs("span", { className: "font-medium", children: [recipe.gravel_kg, " \u043A\u0433/\u043C\u00B3"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "\u0412\u043E\u0434\u0430:" }), _jsxs("span", { className: "font-medium", children: [recipe.water_kg, " \u043A\u0433/\u043C\u00B3"] })] })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx("button", { onClick: () => handleEdit(recipe), className: "flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx("button", { onClick: () => handleDelete(recipe.id), className: "flex-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })] })] }, recipe.id))) }), showCreateModal && (_jsx(RecipeModal, { title: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0440\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u0443", formData: formData, setFormData: setFormData, onSubmit: handleCreate, onClose: () => setShowCreateModal(false) })), showEditModal && editingRecipe && (_jsx(RecipeModal, { title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u0446\u0435\u043F\u0442\u0443\u0440\u0443", formData: formData, setFormData: setFormData, onSubmit: handleUpdate, onClose: () => {
                    setShowEditModal(false);
                    setEditingRecipe(null);
                } }))] }));
};
const RecipeModal = ({ title, formData, setFormData, onSubmit, onClose }) => {
    return (_jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsx("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full", children: _jsxs("form", { onSubmit: onSubmit, children: [_jsxs("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: title }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("input", { type: "text", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041A\u043E\u0434" }), _jsx("input", { type: "text", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.code, onChange: (e) => setFormData({ ...formData, code: e.target.value }) })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("textarea", { className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0426\u0435\u043C\u0435\u043D\u0442 (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.cement_kg, onChange: (e) => setFormData({ ...formData, cement_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u0435\u0441\u043E\u043A (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.sand_kg, onChange: (e) => setFormData({ ...formData, sand_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0429\u0435\u0431\u0435\u043D\u044C (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.gravel_kg, onChange: (e) => setFormData({ ...formData, gravel_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0412\u043E\u0434\u0430 (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.water_kg, onChange: (e) => setFormData({ ...formData, water_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0414\u043E\u0431\u0430\u0432\u043A\u0430 1 (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.additive1_kg, onChange: (e) => setFormData({ ...formData, additive1_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0414\u043E\u0431\u0430\u0432\u043A\u0430 2 (\u043A\u0433/\u043C\u00B3)" }), _jsx("input", { type: "number", step: "0.1", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.additive2_kg, onChange: (e) => setFormData({ ...formData, additive2_kg: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0412\u0440\u0435\u043C\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u043D\u0438\u044F (\u0441\u0435\u043A)" }), _jsx("input", { type: "number", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.mixing_time_sec, onChange: (e) => setFormData({ ...formData, mixing_time_sec: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0412\u0440\u0435\u043C\u044F \u0432\u044B\u0433\u0440\u0443\u0437\u043A\u0438 (\u0441\u0435\u043A)" }), _jsx("input", { type: "number", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.discharge_time_sec, onChange: (e) => setFormData({ ...formData, discharge_time_sec: e.target.value }) })] }), _jsx("div", { className: "col-span-2", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500", checked: formData.is_gost, onChange: (e) => setFormData({ ...formData, is_gost: e.target.checked }) }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "\u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0413\u041E\u0421\u0422" })] }) })] })] }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: [_jsx("button", { type: "submit", className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { type: "button", onClick: onClose, className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] }) })] }) }));
};
export default DemoRecipes;
