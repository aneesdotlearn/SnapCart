import React, {useState} from 'react'
import Navbar from './Navbar';
import Banner from './Banner';
import Footer from './Footer'
// import Cart from './Cart';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';


const ProductPage = () => {
    // const count = useSelector((state) => state.cart.items.length);
    // const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    // const cartCount = useSelector((state) => state.cart.items.length);
    const cartCount = useSelector((state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const products = [
  {
    id:1,
    name:"Fresh Apple - 1kg",
    price:120,
    category:"Fruits",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3x9jr6GWpXSuWEknsOotZiSW9w3beOELkBQzng_KNw&s=10"
  },
  {
    id:2,
    name:"Amul Gold Full Cream Fresh Milk - 500ml",
    price:32,
    category:"Dairy",
    image:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTH1x29ELjDVeP0SczKo5ot3QDW99j9c3Cd4KBYhvABfYad7L1DDyvvj4hRUoihkKmvD79Jtg2Ia_0N95sZSVrzT9XpkQdZNeA4BsIamN7_W3EK7G1g1-bYFkU"
  },
  {
    id:3,
    name:"Lay's Classic Salted Potato Chips",
    price:20,
    category:"Snacks",
    image:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTMOqAKXshXzBN20OCOpiGvjjbRdj7Z2WVbfAkIoWC9_LRIoVMb5mScvFtQAGSh1vuN22Q-2tN9VDyX-W7qKZY7A1iO2tC8JAVEa6jtOCFwM6aBqC2Wx74Pjg"
  },
  {
    id:4,
    name:"Kellogg Pringles Original Potato Chips",
    price:93,
    category:"Snacks",
    image:"https://m.media-amazon.com/images/I/61jMhxrOd8L.jpg"
  },
  {
    id:5,
    name:"Cadbury Dairy Milk Silk Bubbly Chocolate Bar, 46 g",
    price:109,
    category:"Snacks",
    image:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRZir7Qz4GKiGWeVLcDTe5-oI-rQJzesr7BXFGnTdzTiXh1FUv6Umdpt_b22YDGSBM8wEel7BbBtsRTY4dVp2QzaHcjFZlVZkeBrF3TWLsXObOHh090t0nHAl8"
  },
  {
    id:6,
    name:"CMF by Nothing 65W GaN 3-Port Mobile Charger",
    price:642,
    category:"Snacks",
    image:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQOD1q3ai1oSlXXW6mvWr48kW0JB0-IQIdeD8V71w5dSCUWg4kL6EzZOEtUZI_wDqpujyXBOBU1SXbez6znV2D27g2Hdi8lZMMxnaYp96Q"
  },
    {
    id:7,
    name:"Fortune Kachi Ghani Mustard Oil | Bottle",
    price:240,
    category:"Oil",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-1100-1100,pr-true,f-auto,q-40,dpr-2/cms/product_variant/1c371142-bfaa-4bed-8b0d-56953b59780e/Fortune-Kachi-Ghani-Mustard-Oil-Bottle.jpeg"
  },
  {
    id:8,
    name:"Red Bull Energy Drink | Ready to Drink Beverage",
    price:119,
    category:"Drinks",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-902-902,pr-true,f-auto,q-40,dpr-2/cms/product_variant/012fba41-5f14-4b7c-a314-91d34ca7c1fe/Red-Bull-Energy-Drink-Ready-to-Drink-Beverage.jpg"
  },
  {
    id:9,
    name:"Muskmelon (Kirni Pazham)- 1pc",
    price:37,
    category:"Snacks",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-2924-3000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/42b1835f-c87a-42ee-adc2-b21668b76582/Muskmelon-Kirni-Pazham-.jpeg"
  },
  {
    id:10,
    name:"MAGGI 2-Minute Instant Noodles | Masala Noodles",
    price:53,
    category:"Snacks",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/d0228a03-8a64-4437-af4d-23f15b2232e6/MAGGI-2-Minute-Instant-Noodles-Masala-Noodles-Made-With-Quality-Spices.jpeg"
  },
  {
    id:11,
    name:"iD Fresh Idli & Dosa Batter | 1kg ",
    price:89,
    category:"Batter",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-1000-1000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/57253b4d-1964-4b01-8c26-87ada955acd3/iD-Fresh-Idli-Dosa-Batter.jpg"
  },
  {
    id:12,
    name:"Surf Excel Matic Top Load Detergent Liquid | 5kg",
    price:642,
    category:"Detergent",
    image:"https://cdn.zeptonow.com/production/ik-seo/tr:w-403,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/b4907b1b-45a2-47e8-9668-2ead04b52ee0/Surf-Excel-Matic-Top-Load-Detergent-Liquid-Pouch.jpg"
  },
];

// const addToCart =  (product) => {
//     setCart((prevCart) => [...prevCart, product]);

// };

  return (
    <div>
    <Navbar cartCount={cartCount}/>
    <Banner/>
    <section className="bg-gray-100 px-3 py-5 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-4">Our Featured Products</h1> 
        <div className="grid grid-cols-6 gap-4">
            {products.map((prod) => {
                return (
                    <div 
                        key={prod.id}
                        className="bg-white p-2 rounded-lg shadow-md flex flex-col items-center gap-3 cursor-pointer hover:scale-105
                        transition duration-300">

                        <img src={prod.image} alt={prod.name}
                        className="h-[200px]"/>
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-purple-900">{prod.name}</h2>
                            <div className='flex flex-row gap-2'><p className='font-bold'>₹{prod.price}</p><del>₹{prod.price}</del></div>
                            {/* <p>{prod.category}</p> */}
                        </div>

                        <button onClick={() => dispatch(addToCart(prod))} className="bg-orange-400 text-purple px-4 py-2 rounded hover:bg-purple-600 transition-colors">Add to Cart</button>

                    </div>
                    
                );
            })}

        </div>
    </section>
    <Footer/>
    </div>
  );
};

export default ProductPage;