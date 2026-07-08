import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'
import Cart from './components/Cart'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {
    const [cart, setCart] = useState([]);
    const addToCart =  (product) => {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id === product.id); 

          if (existingItem) {
            return prevCart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            return [...prevCart, { ...product, quantity: 1 }];
          }
        });
    };

  return (
    <>
      <Router>
      {/* <Navbar/> */}
      
      <Routes>
        <Route path="/" element={<ProductPage addToCart={addToCart} cart={cart}/>} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>} />
      </Routes>
      </Router>
    </>
  )
}

export default App
