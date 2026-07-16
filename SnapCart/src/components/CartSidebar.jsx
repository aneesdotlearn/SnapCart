import React from 'react'
import Cart from "./Cart";

const CartSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 ${
                    isOpen ? "block" : "hidden"
                }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-screen w-[420px] bg-white transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <Cart onClose={onClose} />
            </div>
        </>
    );
};

export default CartSidebar;