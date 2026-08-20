import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../features/user/userSlice';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <nav className="bg-orange-400 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Top Row: Logo & Hamburger */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="flex items-center gap-8">
            <h1 className="font-bold text-3xl md:text-4xl cursor-pointer tracking-tight" onClick={() => { setIsMenuOpen(false); navigate("/admin/products"); }}>
              SnapCart
            </h1>
            <p className="hidden md:inline-block bg-purple-950 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded">
              Admin Portal
            </p>
          </div>
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-purple-900 transition focus:outline-none md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Desktop Links (always visible on md+) */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="text-lg font-bold hover:text-purple-900 transition underline-offset-4 hover:underline"
          >
            Products
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-lg font-bold hover:text-purple-900 transition underline-offset-4 hover:underline"
          >
            Orders
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button onClick={() => navigate("/admin/products")} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
              <FiUser size={18} />
              {user.name}
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
              <FiUser size={18} />
              Login
            </button>
          )}

          <button onClick={handleLogout} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
            Logout
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="flex flex-col gap-3 py-3 border-t border-orange-300 md:hidden animate-fadeIn w-full">
            <div className="flex items-center gap-2 mb-2">
              <p className="bg-purple-950 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded">
                Admin Portal
              </p>
            </div>
            <button
              onClick={() => { setIsMenuOpen(false); navigate("/admin/products"); }}
              className="text-left py-2 font-bold hover:text-purple-900 transition"
            >
              Products
            </button>
            <button
              onClick={() => { setIsMenuOpen(false); navigate("/admin/orders"); }}
              className="text-left py-2 font-bold hover:text-purple-900 transition"
            >
              Orders
            </button>
            <hr className="border-orange-300 my-1" />
            <div className="flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/admin/products"); }}
                  className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
                >
                  <FiUser size={18} />
                  {user.name}
                </button>
              ) : (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/login"); }}
                  className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
                >
                  <FiUser size={18} />
                  Login
                </button>
              )}

              <button
                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
