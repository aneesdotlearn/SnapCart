import { useEffect } from 'react'
import './App.css'
import ProductPage from './components/ProductPage'
import Cart from './components/Cart'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Favorites from './components/Favorites'
import Checkout from './components/Checkout'
// import AuthPage from './components/AuthPage'
import SignIn from './components/login/SignIn'
import SignUp from './components/login/SignUp'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { loginSuccess } from "./features/user/userSlice";
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
        const res = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success && res.data.user){
          dispatch(loginSuccess({ user: res.data.user, token: token }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  // const [cart, setCart] = useState([]);
  // const addToCart =  (product) => {
  //     setCart((prevCart) => {
  //       const existingItem = prevCart.find((item) => item.id === product.id);

    //       if (existingItem) {
    //         return prevCart.map((item) =>
    //           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    //         );
    //       } else {
    //         return [...prevCart, { ...product, quantity: 1 }];
    //       }
    //     });
    // };

  return (
    <>
      <Router>
      {/* <Navbar/> */}
      
      <Routes>
        <Route path="/" element={<ProductPage/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/favorites" element={<Favorites/>} />
        </Route>
        
          <Route path="/cart" element={<Cart/>} />
        {/* <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} /> */}
        <Route path='/login' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp/>} />
        
      </Routes>
      </Router>
    </>
  )
}

export default App
