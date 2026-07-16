import React from 'react';
import search from "../assets/bg-img/search.svg";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const placeholders = [
  'Search "Milk"',
  'Search "Apple"',
  'Search "Chips"',
  'Search "Chocolate"',
  'Search "Cold Drinks"',
  'Search "Rice"',
];

const Navbar = ({cartCount, openCart}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

    const [placeholder, setPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 2000); // Changes every 2 seconds

    return () => clearInterval(interval);
  }, []);
  
  const navigate = useNavigate();
  return (
    <nav className="bg-orange-400 text-white py-6">
    <div className="flex justify-between items-center px-4">
      <h1 className="font-bold text-4xl">SnapCart</h1>
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-[500px] gap-2">
      <FiSearch className="text-purple-800 text-xl font-bold" />

      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 px-2 text-purple-900"
      />
    </div>
      
      <div className=' flex  gap-2'>
        
      <button className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-orange-400 hover:text-white transition">
        <FiUser size={18} />
        Login
      </button>

        {/* <div className='text-center'>
        <button onClick={() => navigate('/favorites')} className = "bg-gray-100 text-purple-800 font-semibold py-1 px-2 rounded-3xl">🧡</button>
        <p className='text-gray font-light text-xs'>Favorites</p>
        </div> */}

      <div className="text-center">
        <button
          onClick={() => navigate("/favorites")}
          className="bg-gray-100 text-purple-800 p-3 rounded-full hover:bg-orange-400 hover:text-white transition"
        >
          <FaRegHeart size={20} />
        </button>

        
      </div>

      <button onClick={openCart} className = "bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-orange-400 hover:text-white transition"><FaShoppingCart />Cart : {cartCount || 0}</button>
      </div>
    </div>
    </nav>
  );
};

export default Navbar;