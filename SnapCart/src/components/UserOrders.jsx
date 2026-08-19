import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaChevronDown, FaChevronUp, FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

const UserOrders = () => {
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchUserOrders = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
        { orderStatus: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Order cancelled successfully");
      fetchUserOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500 text-lg" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500 text-lg" />;
      default:
        return <FaTruck className="text-blue-500 text-lg" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-6xl w-full px-4 py-8 flex-grow">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-wider text-orange-500">My Account</p>
          <h1 className="text-3xl font-black text-purple-950">My Orders</h1>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-orange-50 border border-orange-100 p-4 flex justify-between items-center text-orange-950 font-medium">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-orange-600 font-bold hover:text-orange-950">Close</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-purple-950 font-bold text-lg">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <FaShoppingBag className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="font-bold text-lg text-purple-950 mb-2">No Orders Placed Yet</h3>
            <p className="text-gray-400 mb-6">Looks like you haven't ordered anything from SnapCart yet.</p>
            <a href="/" className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-600 transition shadow">
              Shop Now
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const isCancellable = order.orderStatus === "Pending" || order.orderStatus === "Confirmed";

              return (
                <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md">
                  {/* Card Header */}
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-950 text-sm md:text-base">
                          Order ID: <span className="text-gray-500">{order._id}</span>
                        </span>
                        <button
                          onClick={() => toggleExpand(order._id)}
                          className="text-purple-600 hover:text-purple-800 focus:outline-none flex items-center"
                        >
                          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Date: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-900 font-medium">
                        Payment Method: <span className="font-bold">{order.paymentMethod}</span> ({order.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="font-black text-lg text-orange-600">Rs {order.orderSummary?.grandTotal}</p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${getStatusClass(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </div>
                      </div>

                      {/* Cancel Order Button */}
                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Items details */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 p-5">
                      <h4 className="text-xs uppercase font-black text-purple-950 tracking-wider mb-3">Items in this Order</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm font-sans">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded border border-gray-100 bg-gray-50" />
                              <div>
                                <h5 className="font-bold text-sm text-purple-950">{item.name}</h5>
                                <p className="text-xs text-gray-400">Price: Rs {item.price}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-900">Qty: {item.quantity}</p>
                              <p className="text-xs text-gray-500 font-bold">Total: Rs {item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Block */}
                      <div className="mt-5 border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between text-xs text-gray-600 gap-4">
                        <div>
                          <p><span className="font-bold">Total Items:</span> {order.items?.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                        <div className="w-full md:w-64 space-y-1 self-end font-sans">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-bold">Rs {order.orderSummary?.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Charge:</span>
                            <span>Rs {order.orderSummary?.deliveryCharge}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Handling Charge:</span>
                            <span>Rs {order.orderSummary?.handlingCharge}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-1 text-sm font-black text-purple-950">
                            <span>Grand Total:</span>
                            <span className="text-orange-600">Rs {order.orderSummary?.grandTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserOrders;
