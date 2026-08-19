import { useEffect } from 'react'
import './App.css'
import ProductPage from './components/ProductPage'
import Cart from './components/Cart'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Favorites from './components/Favorites'
import Checkout from './components/Checkout'
import AdminProduct from './components/AdminProduct'
import AdminRoute from './components/AdminRoute'
import AdminOrders from './components/AdminOrders'
import UserOrders from './components/UserOrders'
import SignIn from './components/login/SignIn'
import SignUp from './components/login/SignUp'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { loginSuccess, logout } from "./features/user/userSlice";
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success && res.data.user){
          dispatch(loginSuccess({ user: res.data.user, token: token }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatch(logout());
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProductPage/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/favorites" element={<Favorites/>} />
            <Route path="/orders" element={<UserOrders />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/products" element={<AdminProduct/>} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
          
          <Route path="/cart" element={<Cart/>} />
          <Route path='/login' element={<SignIn/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
