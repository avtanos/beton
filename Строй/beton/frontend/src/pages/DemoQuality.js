import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QualityStatus } from '../types';
const DemoQuality = () => {
    const [qualityChecks, setQualityChecks] = useState([
        {
            id: 1,
            batch_id: 1,
            mobility_cm: 12.5,
            strength_mpa: 28.5,
            moisture_pct: 5.2,
            deviations: null,
            status: QualityStatus.APPROVED,
            checked_at: '2024-11-18T14:30:00',
        },
        {
            id: 2,
            batch_id: 2,
            mobility_cm: 10.0,
            strength_mpa: null,
            moisture_pct: 4.8,
            deviations: 'Требуется дополнительная проверка прочности',
            status: QualityStatus.PENDING,
            checked_at: '2024-11-18T16:35:00',
        },
        {
            id: 3,
            batch_id: 3,
            mobility_cm: 8.5,
            strength_mpa: 30.2,
            moisture_pct: 5.0,
            deviations: null,
            status: QualityStatus.APPROVED,
            checked_at: '2024-11-17T10:15:00',
        },
    ]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCheck, setEditingCheck] = useState(null);
    const [formData, setFormData] = useState({
        batch_id: '',
        mobility_cm: '',
        strength_mpa: '',
        moisture_pct: '',
        deviations: '',
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
    const handleCreate = (e) => {
        e.preventDefault();
        const newCheck = {
            id: qualityChecks.length + 1,
            batch_id: parseInt(formData.batch_id),
            mobility_cm: formData.mobility_cm ? parseFloat(formData.mobility_cm) : null,
            strength_mpa: formData.strength_mpa ? parseFloat(formData.strength_mpa) : null,
            moisture_pct: formData.moisture_pct ? parseFloat(formData.moisture_pct) : null,
            deviations: formData.deviations || null,
            status: QualityStatus.PENDING,
            checked_at: new Date().toISOString(),
        };
        setQualityChecks([newCheck, ...qualityChecks]);
        setShowCreateModal(false);
        setFormData({
            batch_id: '',
            mobility_cm: '',
            strength_mpa: '',
            moisture_pct: '',
            deviations: '',
        });
    };
    const handleEdit = (check) => {
        setEditingCheck(check);
        setFormData({
            batch_id: check.batch_id.toString(),
            mobility_cm: check.mobility_cm?.toString() || '',
            strength_mpa: check.strength_mpa?.toString() || '',
            moisture_pct: check.moisture_pct?.toString() || '',
            deviations: check.deviations || '',
        });
        setShowEditModal(true);
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        if (editingCheck) {
            setQualityChecks(qualityChecks.map(c => c.id === editingCheck.id
                ? {
                    ...c,
                    mobility_cm: formData.mobility_cm ? parseFloat(formData.mobility_cm) : null,
                    strength_mpa: formData.strength_mpa ? parseFloat(formData.strength_mpa) : null,
                    moisture_pct: formData.moisture_pct ? parseFloat(formData.moisture_pct) : null,
                    deviations: formData.deviations || null,
                }
                : c));
            setShowEditModal(false);
            setEditingCheck(null);
        }
    };
    const handleStatusChange = (id, status) => {
        setQualityChecks(qualityChecks.map(c => c.id === id ? { ...c, status } : c));
    };
    return (_jsxs("div", { className: "px-4 py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/demo", className: "text-primary-600 hover:text-primary-700 text-sm font-medium", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C" }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm", children: "+ \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443" })] })] }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041F\u0430\u0440\u0442\u0438\u044F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041F\u043E\u0434\u0432\u0438\u0436\u043D\u043E\u0441\u0442\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041F\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: qualityChecks.map((check) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: ["#", check.batch_id] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: check.mobility_cm !== null ? `${check.mobility_cm} см` : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: check.strength_mpa !== null ? `${check.strength_mpa} МПа` : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: check.moisture_pct !== null ? `${check.moisture_pct}%` : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(check.status)}`, children: getStatusLabel(check.status) }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2", children: [_jsx("button", { onClick: () => handleEdit(check), className: "text-blue-600 hover:text-blue-900", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), check.status === QualityStatus.PENDING && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange(check.id, QualityStatus.APPROVED), className: "text-green-600 hover:text-green-900", children: "\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C" }), _jsx("button", { onClick: () => handleStatusChange(check.id, QualityStatus.REJECTED), className: "text-red-600 hover:text-red-900", children: "\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C" })] }))] })] }, check.id))) })] }) }) }), (showCreateModal || showEditModal) && (_jsx(QualityModal, { title: showCreateModal ? 'Создать проверку качества' : 'Редактировать проверку', formData: formData, setFormData: setFormData, onSubmit: showCreateModal ? handleCreate : handleUpdate, onClose: () => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingCheck(null);
                } }))] }));
};
const QualityModal = ({ title, formData, setFormData, onSubmit, onClose }) => {
    return (_jsx("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsx("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: _jsxs("form", { onSubmit: onSubmit, children: [_jsxs("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 mb-4", children: title }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "ID \u041F\u0430\u0440\u0442\u0438\u0438" }), _jsx("input", { type: "number", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.batch_id, onChange: (e) => setFormData({ ...formData, batch_id: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u043E\u0434\u0432\u0438\u0436\u043D\u043E\u0441\u0442\u044C (\u0441\u043C)" }), _jsx("input", { type: "number", step: "0.1", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.mobility_cm, onChange: (e) => setFormData({ ...formData, mobility_cm: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u044C (\u041C\u041F\u0430)" }), _jsx("input", { type: "number", step: "0.1", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.strength_mpa, onChange: (e) => setFormData({ ...formData, strength_mpa: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C (%)" }), _jsx("input", { type: "number", step: "0.1", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.moisture_pct, onChange: (e) => setFormData({ ...formData, moisture_pct: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F" }), _jsx("textarea", { className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500", value: formData.deviations, onChange: (e) => setFormData({ ...formData, deviations: e.target.value }) })] })] })] }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: [_jsx("button", { type: "submit", className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }), _jsx("button", { type: "button", onClick: onClose, className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })] })] }) })] }) }));
};
export default DemoQuality;
