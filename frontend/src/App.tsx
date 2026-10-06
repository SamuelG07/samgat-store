import CheckoutPayment from './pages/CheckoutPayment';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import Register from './pages/Register';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAdmins from './pages/admin/AdminAdmins';
import CustomerDetails from './pages/admin/CustomerDetails';
import AdminDetails from './pages/admin/AdminDetails';
import AdminInventory from './pages/admin/AdminInventory';
import AdminStockMovements from './pages/admin/AdminStockMovements';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPendingPayments from './pages/admin/AdminPendingPayments';

const publicRoute = (element: React.ReactNode) => <PublicLayout>{element}</PublicLayout>;

const protectedPublicRoute = (element: React.ReactNode) => (
  <ProtectedRoute>
    <PublicLayout>{element}</PublicLayout>
  </ProtectedRoute>
);

const adminRoute = (element: React.ReactNode) => (
  <ProtectedRoute requireAdmin>
    <AdminLayout>{element}</AdminLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Público */}
	<Route path="/checkout/pagamento/:orderId" element={protectedPublicRoute(<CheckoutPayment />)} />
        <Route path="/" element={publicRoute(<Home />)} />
        <Route path="/categorias" element={publicRoute(<Categories />)} />
        <Route path="/produtos" element={publicRoute(<Products />)} />
        <Route path="/produtos/:id" element={publicRoute(<ProductDetails />)} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas (cliente) */}
	<Route path="/admin/payments" element={adminRoute(<AdminPendingPayments />)} />
        <Route path="/carrinho" element={protectedPublicRoute(<Cart />)} />
        <Route path="/pedidos" element={protectedPublicRoute(<Orders />)} />
        <Route path="/pedidos/:id" element={protectedPublicRoute(<OrderDetails />)} />

        {/* Admin */}
        <Route path="/admin" element={adminRoute(<AdminDashboard />)} />
        <Route path="/admin/products" element={adminRoute(<AdminProducts />)} />
        <Route path="/admin/categories" element={adminRoute(<AdminCategories />)} />
        <Route path="/admin/orders" element={adminRoute(<AdminOrders />)} />
        <Route path="/admin/users" element={adminRoute(<AdminUsers />)} />
        <Route path="/admin/inventory" element={adminRoute(<AdminInventory />)} />
        <Route path="/admin/stock-movements" element={adminRoute(<AdminStockMovements />)} />
	<Route path="/admin/customers" element={adminRoute(<AdminCustomers />)} />
	<Route path="/admin/customers/:id" element={adminRoute(<CustomerDetails />)} />
	<Route path="/admin/admins" element={adminRoute(<AdminAdmins />)} />
	<Route path="/admin/admins/:id" element={adminRoute(<AdminDetails />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
