import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Recipes from './pages/Recipes';
import Batches from './pages/Batches';
import Warehouse from './pages/Warehouse';
import Quality from './pages/Quality';
import Monitoring from './pages/Monitoring';
import Users from './pages/Users';
import Demo from './pages/Demo';
import DemoDashboard from './pages/DemoDashboard';
import DemoOrders from './pages/DemoOrders';
import DemoRecipes from './pages/DemoRecipes';
import DemoBatches from './pages/DemoBatches';
import DemoWarehouse from './pages/DemoWarehouse';
import DemoQuality from './pages/DemoQuality';
import DemoMonitoring from './pages/DemoMonitoring';
import ProductionCycle from './pages/ProductionCycle';
function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
}
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/demo", element: _jsx(Demo, {}) }), _jsx(Route, { path: "/demo/dashboard", element: _jsx(DemoDashboard, {}) }), _jsx(Route, { path: "/demo/orders", element: _jsx(DemoOrders, {}) }), _jsx(Route, { path: "/demo/recipes", element: _jsx(DemoRecipes, {}) }), _jsx(Route, { path: "/demo/batches", element: _jsx(DemoBatches, {}) }), _jsx(Route, { path: "/demo/warehouse", element: _jsx(DemoWarehouse, {}) }), _jsx(Route, { path: "/demo/quality", element: _jsx(DemoQuality, {}) }), _jsx(Route, { path: "/demo/monitoring", element: _jsx(DemoMonitoring, {}) }), _jsx(Route, { path: "/demo/cycle", element: _jsx(ProductionCycle, {}) }), _jsxs(Route, { path: "/", element: _jsx(PrivateRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "orders", element: _jsx(Orders, {}) }), _jsx(Route, { path: "recipes", element: _jsx(Recipes, {}) }), _jsx(Route, { path: "batches", element: _jsx(Batches, {}) }), _jsx(Route, { path: "warehouse", element: _jsx(Warehouse, {}) }), _jsx(Route, { path: "quality", element: _jsx(Quality, {}) }), _jsx(Route, { path: "monitoring", element: _jsx(Monitoring, {}) }), _jsx(Route, { path: "users", element: _jsx(Users, {}) })] })] }));
}
export default App;
