import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Recipes from './pages/Recipes'
import Batches from './pages/Batches'
import Warehouse from './pages/Warehouse'
import Quality from './pages/Quality'
import Monitoring from './pages/Monitoring'
import Users from './pages/Users'
import Demo from './pages/Demo'
import DemoDashboard from './pages/DemoDashboard'
import DemoOrders from './pages/DemoOrders'
import DemoRecipes from './pages/DemoRecipes'
import DemoBatches from './pages/DemoBatches'
import DemoWarehouse from './pages/DemoWarehouse'
import DemoQuality from './pages/DemoQuality'
import DemoMonitoring from './pages/DemoMonitoring'
import ProductionCycle from './pages/ProductionCycle'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/demo/dashboard" element={<DemoDashboard />} />
      <Route path="/demo/orders" element={<DemoOrders />} />
      <Route path="/demo/recipes" element={<DemoRecipes />} />
      <Route path="/demo/batches" element={<DemoBatches />} />
      <Route path="/demo/warehouse" element={<DemoWarehouse />} />
      <Route path="/demo/quality" element={<DemoQuality />} />
      <Route path="/demo/monitoring" element={<DemoMonitoring />} />
      <Route path="/demo/cycle" element={<ProductionCycle />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="batches" element={<Batches />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="quality" element={<Quality />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default App

