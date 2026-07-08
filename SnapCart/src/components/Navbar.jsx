import React from 'react';
import search from "../assets/bg-img/search.svg";
import { useNavigate } from 'react-router-dom';

const Navbar = ({cartCount}) => {
  
  const navigate = useNavigate();
  return (
    <nav className="bg-orange-400 text-white py-6">
    <div className="flex justify-between items-center px-4">
      <h1 className="font-bold text-4xl">SnapCart</h1>
      <div>
        {/* <img src={search} alt="" className='w-10px min-h-10px'/> */}
        <input type="text" id="searchInput" placeholder="Search Product" className="font-semibold text-lg cursor-pointer rounded-lg bg-gray-100 px-40 py-2 text-center"/>
      </div>
      
      <div className=' flex  gap-2'>
      <button className = "bg-gray-100 text-purple-800 font-semibold py-1 px-2 rounded-lg">Login</button>
      
      <button onClick={()=> navigate("/cart")} className = "bg-gray-100 text-purple-800 font-semibold py-1 px-2 rounded-lg">Cart : {cartCount || 0}</button>
      </div>
    </div>
    </nav>
  );
};

export default Navbar;