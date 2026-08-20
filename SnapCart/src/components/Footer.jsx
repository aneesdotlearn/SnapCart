import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-red-500 via-orange to-orange-500 text-white text-center flex flex-col md:flex-row gap-6 md:gap-3 items-center justify-between px-6 py-8 md:py-6">

            <h2 className="text-3xl font-bold"> SnapCart</h2>

            <ul className="flex-col gap-4 text-s cursor-pointer text-left">
                <h4 className="font-bold text-purple-900">Company</h4>
                <li className="hover:underline transition duration-300 hover:scale-125 ">About</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Careers</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Privacy Policy</li>
            </ul>

            <ul className="flex-col gap-4 text-s cursor-pointer text-left">
                <h4 className="font-bold text-purple-900">Customer</h4>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Help</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Support</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Contact</li>
            </ul>

            <ul className="flex-col gap-4 text-s cursor-pointer text-left">
                <h4 className="font-bold text-purple-900 ">Follow Us</h4>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Instagram</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Facebook</li>
                <li className="hover:underline transition duration-300 hover:scale-125 ">Twitter</li>
            </ul>

            <p className="text-md font-semibold">
                @<span className="font-bold text-purple-900">2026</span> Shopify. All Rights Reserved.
            </p>
        </footer>
    )
}

export default Footer