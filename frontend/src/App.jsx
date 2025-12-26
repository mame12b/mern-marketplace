import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './redux/store';

import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import DashboardRedirect from './components/auth/DashboardRedirect';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './components/product/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import SellerApplication from './pages/SellerApplication';

// Role-based Dashboards
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';




function App() {
 return (
  <Provider store={store}>
   <BrowserRouter>
   
     <Routes>
      {/* layout as Route  */}
      <Route element={<Layout />}>
        {/*Default Page   */}
        <Route index element={<Home />} />

        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path = '/login' element = {<Login />} />
        <Route path = '/register' element = {<Register />} />
      
        {/* Protected routes - All authenticated users */}
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashboardRedirect />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/seller/apply' element={<SellerApplication />} />
      </Route>

        {/* Buyer-only routes */}
      <Route element={<RoleBasedRoute allowedRoles={['buyer']} />}>
        <Route path='/buyer/dashboard' element={<BuyerDashboard />} />
      </Route>

        {/* Seller-only routes */}
      <Route element={<RoleBasedRoute allowedRoles={['seller']} />}>
        <Route path='/seller/dashboard' element={<SellerDashboard />} />
      </Route>

        {/* Admin-only routes */}
      <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
      </Route>

        {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
   
   <ToastContainer position ="top-right" />
   </BrowserRouter>
  </Provider>
 ); 
}

export default App; 
