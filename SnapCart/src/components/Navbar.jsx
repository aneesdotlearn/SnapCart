import React from 'react';
import search from "../assets/bg-img/search.svg";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiLogOut, FiUser, FiSearch, FiMenu, FiX, FiHome } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../features/user/userSlice';

const placeholders = [
  'Search "Milk"',
  'Search "Apple"',
  'Search "Chips"',
  'Search "Chocolate"',
  'Search "Cold Drinks"',
  'Search "Rice"',
];

const Navbar = ({ cartCount, openCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);

  // Inject CSS to handle spacing for the sticky bottom bar on mobile
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'mobile-bottom-nav-spacing';
    style.innerHTML = `
      @media (max-width: 767px) {
        body {
          padding-bottom: 80px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById('mobile-bottom-nav-spacing');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const navItems = [
    {
      label: 'Home',
      icon: <FiHome size={20} />,
      activeIcon: <FiHome size={20} className="text-purple-800" />,
      action: () => { setIsMenuOpen(false); navigate("/"); },
      active: location.pathname === '/'
    },
    {
      label: 'Favorites',
      icon: <FaRegHeart size={20} />,
      activeIcon: <FaHeart size={20} className="text-purple-500" />,
      action: () => { setIsMenuOpen(false); navigate("/favorites"); },
      active: location.pathname === '/favorites'
    },
    {
      label: 'Cart',
      icon: (
        <div className="relative">
          <FaShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
      ),
      activeIcon: (
        <div className="relative">
          <FaShoppingCart size={20} className="text-purple-800" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
      ),
      action: () => { setIsMenuOpen(false); openCart(); },
      active: false
    },
    {
      label: user ? 'Profile' : 'Login',
      icon: <FiUser size={20} />,
      activeIcon: <FiUser size={20} className="text-purple-800" />,
      action: () => { setIsMenuOpen(false); navigate(user ? "/profile" : "/login"); },
      active: location.pathname === '/profile' || location.pathname === '/login' || location.pathname === '/signin' || location.pathname === '/signup'
    }
  ];

  if (user) {
    navItems.push({
      label: 'Logout',
      icon: <FiLogOut size={20} />,
      activeIcon: <FiLogOut size={20} className="text-purple-800" />,
      action: () => { setIsMenuOpen(false); handleLogout(); },
      active: false
    });
  }

  return (
    <>
      <nav className="bg-gradient-to-b from-red-600 to-orange-500 text-white py-4 shadow-md sticky top-0 z-50">
        <div className=" mx-auto px-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Top Row: Logo & Hamburger button */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <h1 className="font-bold text-3xl md:text-4xl cursor-pointer tracking-tight" onClick={() => { setIsMenuOpen(false); navigate("/"); }}>
              SnapCart
            </h1>

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
              onClick={() => navigate("/")}
              className="text-lg font-bold hover:text-purple-900 transition underline-offset-4 hover:underline"
            >
              Home
            </button>
            {user && (
              <button
                onClick={() => navigate("/orders")}
                className="text-lg font-bold hover:text-purple-900 transition underline-offset-4 hover:underline"
              >
                My Orders
              </button>
            )}
          </div>



          {/* Search Bar (Centered, responsive width) */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-[480px] lg:w-[500px] gap-2 shadow-inner">
            <FiSearch className="text-purple-800 text-xl font-bold" />
            <input
              type="text"
              placeholder={placeholder}
              className="bg-transparent outline-none flex-1 px-2 text-purple-900 placeholder-gray-400 text-sm md:text-base"
            />
          </div>







          {/* Desktop Action Buttons (always visible on md+) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate("/profile")} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
                <FiUser size={18} />
                {user.name}
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
                <FiUser size={18} />
                Login
              </button>
            )}

            <button
              onClick={() => navigate("/favorites")}
              className="bg-gray-100 text-purple-800 p-2.5 rounded-full hover:bg-purple-900 hover:text-white transition shadow-sm"
              aria-label="Favorites"
            >
              <FaRegHeart size={20} />
            </button>

            <button onClick={openCart} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
              <FaShoppingCart />
              Cart: {cartCount || 0}
            </button>

            {user && (
              <button onClick={handleLogout} className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-900 hover:text-white transition shadow-sm">
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Dropdown (Visible only on mobile/tablet when toggled) */}
          {isMenuOpen && (
            <div className="flex flex-col gap-3 py-3 border-t border-orange-300 md:hidden animate-fadeIn w-full">
              <button
                onClick={() => { setIsMenuOpen(false); navigate("/"); }}
                className="text-left py-2 font-bold hover:text-purple-900 transition"
              >
                Home
              </button>
              {user && (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/orders"); }}
                  className="text-left py-2 font-bold hover:text-purple-900 transition"
                >
                  My Orders
                </button>
              )}
              <hr className="border-orange-300 my-1" />
              <div className="flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/profile"); }}
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
                  onClick={() => { setIsMenuOpen(false); navigate("/favorites"); }}
                  className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
                >
                  <FaRegHeart size={18} />
                  Favorites
                </button>

                <button
                  onClick={() => { setIsMenuOpen(false); openCart(); }}
                  className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
                >
                  <FaShoppingCart />
                  Cart ({cartCount || 0})
                </button>

                {user && (
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="bg-gray-100 text-purple-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-900 hover:text-white transition"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sticky Bottom Navigation for Mobile */}
      <div className="fixed bottom-4 left-4 right-4 bg-orange-50/75 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-150 flex justify-around items-center py-2 px-3 z-50 md:hidden transition-all duration-300">
        {navItems.map((item, index) => {
          const isActive = item.active;
          return (
            <button
              key={index}
              onClick={item.action}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-300 ease-in-out ${isActive ? 'text-purple-800 scale-105' : 'text-gray-500 hover:text-purple-600 active:scale-95'
                }`}
            >
              {/* Active Glow Bubble */}
              <div
                className={`absolute inset-0 m-auto w-10 h-10 rounded-full transition-all duration-350 ease-out -z-10 ${isActive
                  ? 'bg-purple-100 opacity-100 scale-110 shadow-sm'
                  : 'scale-50 opacity-0 bg-transparent'
                  }`}
              />

              <div className={`transition-all duration-300 ease-out ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                {isActive ? item.activeIcon : item.icon}
              </div>

              <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ease-out ${isActive ? 'text-purple-800 font-bold scale-105' : 'text-gray-400'
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
