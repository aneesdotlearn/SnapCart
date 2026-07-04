import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar'
import ProductPage from './components/ProductPage'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Navbar/> */}
      
      <ProductPage/>
      <Footer/>
    </>
  )
}

export default App
