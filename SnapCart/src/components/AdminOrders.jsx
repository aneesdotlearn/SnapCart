import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import { FaTrash, FaEdit, FaPlus, FaChevronDown, FaChevronUp, FaShoppingBag, FaUser } from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  
  // Expanded card state
  const [expandedOrders, setExpandedOrders] = useState({});

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState({
    user: "",
    items: [], // { productId, name, image, price, quantity }
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    deliveryCharge: 40,
    handlingCharge: 10,
  });

  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 1,
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, { headers }),
      ]);

      setOrders(ordersRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setProducts(productsRes.data.data || productsRes.data.products || []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading order data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Order deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete order");
    }
  };

  // Create Order Items Management
  const handleAddItem = () => {
    if (!newItem.productId) return;
    const product = products.find((p) => p._id === newItem.productId);
    if (!product) return;

    // Check if item already added
    const existingIndex = formData.items.findIndex(
      (item) => item.productId === newItem.productId
    );

    let updatedItems = [...formData.items];
    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += Number(newItem.quantity);
    } else {
      updatedItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: Number(newItem.quantity),
      });
    }

    setFormData({ ...formData, items: updatedItems });
    setNewItem({ productId: "", quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // Helper to calculate totals
  const calculateSummary = (items, delivery = 40, handling = 10) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = subtotal + Number(delivery) + Number(handling);
    return { subtotal, deliveryCharge: Number(delivery), handlingCharge: Number(handling), grandTotal };
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.user) {
      alert("Please select a user");
      return;
    }
    if (formData.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const { subtotal, deliveryCharge, handlingCharge, grandTotal } = calculateSummary(
      formData.items,
      formData.deliveryCharge,
      formData.handlingCharge
    );

    const payload = {
      user: formData.user,
      items: formData.items,
      orderSummary: { subtotal, deliveryCharge, handlingCharge, grandTotal },
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      orderStatus: formData.orderStatus,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Order created successfully");
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        user: "",
        items: [],
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        deliveryCharge: 40,
        handlingCharge: 10,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create order: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      user: order.user?._id || "",
      items: order.items || [],
      paymentMethod: order.paymentMethod || "COD",
      paymentStatus: order.paymentStatus || "Pending",
      orderStatus: order.orderStatus || "Pending",
      deliveryCharge: order.orderSummary?.deliveryCharge || 40,
      handlingCharge: order.orderSummary?.handlingCharge || 10,
    });
    setIsEditModalOpen(true);
  };

  const handleEditOrder = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Order must have at least one item");
      return;
    }

    const { subtotal, deliveryCharge, handlingCharge, grandTotal } = calculateSummary(
      formData.items,
      formData.deliveryCharge,
      formData.handlingCharge
    );

    const payload = {
      items: formData.items,
      orderSummary: { subtotal, deliveryCharge, handlingCharge, grandTotal },
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      orderStatus: formData.orderStatus,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/orders/${selectedOrder._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Order updated successfully");
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Status updated successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update status");
    }
  };

  const handleQuickPaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Payment status updated");
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update payment status");
    }
  };

  // Filters logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter ? order.orderStatus === statusFilter : true;
    const matchesPayment = paymentFilter ? order.paymentStatus === paymentFilter : true;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const { subtotal, deliveryCharge, handlingCharge, grandTotal } = calculateSummary(
    formData.items,
    formData.deliveryCharge,
    formData.handlingCharge
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl w-full px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-orange-500">Admin Portal</p>
            <h1 className="text-3xl font-black text-purple-950">Order Management</h1>
          </div>
          <button
            onClick={() => {
              setFormData({
                user: "",
                items: [],
                paymentMethod: "COD",
                paymentStatus: "Pending",
                orderStatus: "Pending",
                deliveryCharge: 40,
                handlingCharge: 10,
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-3 font-bold text-white shadow transition"
          >
            <FaPlus /> Add New Order
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-purple-50 border border-purple-100 p-4 flex justify-between items-center text-purple-950 font-medium">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-purple-600 font-bold hover:text-purple-900">Close</button>
          </div>
        )}

        {/* Filters Controls */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by Order ID or User name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Order Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">Payment Status Filter</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Payments</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="text-center py-20 text-purple-950 font-bold text-lg">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
            No orders found matching the criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md"
                >
                  {/* Order Card Header */}
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-950 text-sm md:text-base">
                          Order ID: <span className="text-gray-500">{order._id}</span>
                        </span>
                        <button
                          onClick={() => toggleExpandOrder(order._id)}
                          className="text-purple-600 hover:text-purple-800 focus:outline-none flex items-center"
                        >
                          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-purple-900 font-medium">
                        <FaUser className="text-orange-500 text-xs" />
                        <span>{order.user?.name || "Unknown"} ({order.user?.email || "No email"})</span>
                      </div>
                    </div>

                    {/* Quick Updates & Pricing */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right mr-2">
                        <p className="text-xs text-gray-400">Grand Total</p>
                        <p className="font-black text-lg text-orange-600">Rs {order.orderSummary?.grandTotal}</p>
                      </div>

                      {/* Order Status Select */}
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                          className={`rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-50 border-green-200 text-green-700"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-orange-50 border-orange-200 text-orange-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Payment Status Select */}
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1">Payment</label>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleQuickPaymentStatusChange(order._id, e.target.value)}
                          className={`rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-50 border-green-200 text-green-700"
                              : order.paymentStatus === "Failed"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>

                      {/* CRUD Buttons */}
                      <div className="flex items-center gap-1 self-end mt-2 md:mt-0">
                        <button
                          onClick={() => openEditModal(order)}
                          title="Edit Order Details"
                          className="p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          title="Delete Order"
                          className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items details */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 p-5">
                      <h4 className="text-xs uppercase font-black text-purple-950 tracking-wider mb-3">Order Items</h4>
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

                      {/* Order Summary footer */}
                      <div className="mt-5 border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between text-xs text-gray-600 gap-4">
                        <div className="flex flex-wrap gap-4">
                          <p><span className="font-bold">Payment Method:</span> {order.paymentMethod}</p>
                          <p><span className="font-bold">Items Count:</span> {order.items?.length}</p>
                        </div>
                        <div className="w-full md:w-64 space-y-1 self-end">
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

      {/* CREATE ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                <FaShoppingBag className="text-orange-500" /> Place New Order
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-purple-900 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-5">
              {/* User Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-purple-950 mb-2">Assign Customer</label>
                <select
                  required
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">-- Choose User --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div className="border border-orange-100 bg-orange-50/30 rounded-xl p-4">
                <h3 className="font-bold text-purple-950 mb-3 flex items-center gap-1">Order Items</h3>

                {/* Add Item Row */}
                <div className="flex gap-2 mb-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-purple-900 mb-1">Select Product</label>
                    <select
                      value={newItem.productId}
                      onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Rs {p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-purple-900 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-purple-900 text-white rounded-lg px-4 py-2 hover:bg-purple-950 transition flex items-center gap-1 font-bold text-sm h-[38px]"
                  >
                    Add
                  </button>
                </div>

                {/* Added items list */}
                {formData.items.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-4 bg-white rounded-lg border border-dashed">
                    No items added yet. Choose a product and click add.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                          <span className="font-bold text-purple-950 max-w-[240px] truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>Rs {item.price} × {item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status and Payment method */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Order Status</label>
                  <select
                    value={formData.orderStatus}
                    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="COD">COD</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Adjust Charges */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Delivery Charge (Rs)</label>
                  <input
                    type="number"
                    value={formData.deliveryCharge}
                    onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Handling Charge (Rs)</label>
                  <input
                    type="number"
                    value={formData.handlingCharge}
                    onChange={(e) => setFormData({ ...formData, handlingCharge: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Summary calculations view */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-700 space-y-1 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>Rs {deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge:</span>
                  <span>Rs {handlingCharge}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-black text-purple-950">
                  <span>Grand Total:</span>
                  <span className="text-orange-600">Rs {grandTotal}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border px-5 py-3 font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-3 font-bold text-white shadow transition"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                <FaEdit className="text-orange-500" /> Edit Order: {selectedOrder?._id}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-purple-900 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditOrder} className="p-6 space-y-5">
              {/* Product selection for edits */}
              <div className="border border-orange-100 bg-orange-50/30 rounded-xl p-4">
                <h3 className="font-bold text-purple-950 mb-3">Manage Items</h3>
                <div className="flex gap-2 mb-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-purple-900 mb-1">Select Product to Add</label>
                    <select
                      value={newItem.productId}
                      onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none bg-white"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Rs {p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-purple-900 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-purple-900 text-white rounded-lg px-4 py-2 hover:bg-purple-950 transition font-bold text-sm h-[38px]"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                        <span className="font-bold text-purple-950 max-w-[240px] truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Rs {item.price} × {item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status updates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Order Status</label>
                  <select
                    value={formData.orderStatus}
                    onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="COD">COD</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Adjust Charges */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Delivery Charge (Rs)</label>
                  <input
                    type="number"
                    value={formData.deliveryCharge}
                    onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-950 mb-2">Handling Charge (Rs)</label>
                  <input
                    type="number"
                    value={formData.handlingCharge}
                    onChange={(e) => setFormData({ ...formData, handlingCharge: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Calculations summary */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-700 space-y-1 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>Rs {deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge:</span>
                  <span>Rs {handlingCharge}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-black text-purple-950">
                  <span>Grand Total:</span>
                  <span className="text-orange-600">Rs {grandTotal}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border px-5 py-3 font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-3 font-bold text-white shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminOrders;
