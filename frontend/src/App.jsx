import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
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
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
 return (
  <Provider store={store}>
   <BrowserRouter>
   <Layout>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/products/:id' element={<ProductDetail />} />
      <Route path='/cart' element={<Cart />} />
      <Route path = '/login' element = {<Login />} />
      <Route path = '/register' element = {<Register />} />
      

      <Route element={<PrivateRoute />}>
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<Orders />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
   </Layout>
   <ToastContainer position ="top-right" />
   </BrowserRouter>
  </Provider>
 ); 
}

export default App; 
